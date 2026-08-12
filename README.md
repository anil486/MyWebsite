# Artics Office Furnitures — Website

Marketing site for Artics Office Furnitures, with a consultation request form
that emails submissions via [Resend](https://resend.com).

## Structure

```
.
├── index.html              # The site (single-page, self-contained)
└── functions/
    └── api/
        └── consult.js       # Cloudflare Pages Function — POST /api/consult
```

The `functions/` directory uses Cloudflare Pages' file-based routing, so
`functions/api/consult.js` automatically becomes the `/api/consult` endpoint
once deployed. No separate backend is needed.

## Deploying (Cloudflare Pages)

1. Push this repo to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages →
   Connect to Git**, and select this repository.
3. Build settings: no build command needed — set the build output directory
   to `/` (root).
4. Under **Settings → Environment variables**, add a secret named
   `RESEND_API_KEY` with your Resend API key.
5. In Resend, verify the sending domain/address used in
   `functions/api/consult.js` (currently `consultations@articsofficefurnitures.com`).
6. Deploy. The form on the site will POST to `/api/consult`, which sends the
   submission to `articsofficefurn@gmail.com`.

## Local development

Since this is a static HTML file with a Cloudflare Pages Function, use
[Wrangler](https://developers.cloudflare.com/workers/wrangler/) to preview
locally with the function working:

```bash
npm install -g wrangler
wrangler pages dev .
```

## Notes

- `index.html` is self-contained (styles and most assets inline), so there's
  nothing else to link up.
- The form includes a honeypot field (`_gotcha`) for basic spam filtering.
