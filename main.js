document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

// stagger reveal delays for grouped cards (grid children)
document.querySelectorAll('.cap-grid, .proj-grid, .clients-row, .readout, .process-list').forEach(group=>{
  Array.from(group.children).forEach((child,i)=>{
    child.classList.add('reveal');
    child.style.transitionDelay = (i * 70) + 'ms';
  });
});

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{ threshold:0.12 });
document.querySelectorAll('.reveal').forEach(el=>{
  el.classList.remove('in');
  io.observe(el);
});

// header shrink + progress bar on scroll
const header = document.querySelector('header');
const progressBar = document.getElementById('progressBar');
function onScroll(){
  const y = window.scrollY;
  if(header){
    header.classList.toggle('scrolled', y > 40);
    header.style.borderBottomColor = y > 40 ? 'rgba(233,230,222,0.28)' : 'rgba(233,230,222,0.14)';
  }
  if(progressBar){
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// mark current nav link
(function markCurrentNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.links a, #mnav a').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#')) return;
    const target = href.split('/').pop();
    if(target === path || (target === 'index.html' && path === '')){
      a.classList.add('current');
    }
  });
})();

// Cross-page transitions are handled natively by the browser via the
// `@view-transition { navigation: auto; }` CSS rule (see styles.css) on
// browsers that support MPA View Transitions (Chrome 126+, and others as
// they ship it). No JavaScript is required for that — this keeps normal
// link navigation, back/forward, and accessibility fully intact.
// Browsers without support simply do a normal navigation; the CSS fallback
// fade-in animation in styles.css covers those.


/* Mobile menu fix */
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mnav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
});
