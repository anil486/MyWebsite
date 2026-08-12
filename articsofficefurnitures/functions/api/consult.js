// Cloudflare Pages Function
// Route: POST /api/consult
// Receives the consultation form submission and emails it via Resend.
//
// Requires an environment variable/secret named RESEND_API_KEY, set in
// Cloudflare Pages → your project → Settings → Environment variables.

const TO_EMAIL = "articsofficefurn@gmail.com";
// Must be an address/domain you've verified in Resend (see setup notes).
const FROM_EMAIL = "Artics Website <consultations@articsofficefurnitures.com>";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const form = await request.formData();

    // Honeypot: if this hidden field is filled in, silently pretend success.
    const honeypot = (form.get("_gotcha") || "").toString().trim();
    if (honeypot) {
      return jsonResponse({ ok: true });
    }

    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const company = (form.get("company") || "").toString().trim();
    const phone = (form.get("phone") || "").toString().trim();
    const projectType = (form.get("project_type") || "").toString().trim();
    const message = (form.get("message") || "").toString().trim();

    // Basic server-side validation (mirrors the HTML "required" fields).
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message) {
      return jsonResponse({ ok: false, error: "Missing required fields." }, 400);
    }
    if (!emailPattern.test(email)) {
      return jsonResponse({ ok: false, error: "Invalid email address." }, 400);
    }

    if (!env.RESEND_API_KEY) {
      return jsonResponse(
        { ok: false, error: "Email service is not configured." },
        500
      );
    }

    const html = `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company) || "—"}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone) || "—"}</p>
      <p><strong>Project Type:</strong> ${escapeHtml(projectType) || "—"}</p>
      <p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New Consultation Request — ${name}`,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error("Resend error:", errText);
      return jsonResponse(
        { ok: false, error: "Failed to send email." },
        502
      );
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error("Consult form error:", err);
    return jsonResponse({ ok: false, error: "Unexpected server error." }, 500);
  }
}

// Reject other methods on this route.
export async function onRequestGet() {
  return jsonResponse({ ok: false, error: "Method not allowed." }, 405);
}
