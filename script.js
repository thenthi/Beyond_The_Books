const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

toggle.addEventListener('click', () => {
  setMenu(!nav.classList.contains('open'));
});

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') setMenu(false);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.site-header')) setMenu(false);
});
// Thanh menu trong suốt ở trên cùng, cuộn xuống thì chuyển nền trắng
const header = document.querySelector('.site-header');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 8);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Phần tử có data-reveal hiện dần lên khi cuộn tới (vd. các tờ note Rules ở trang chủ)
const revealItems = document.querySelectorAll('[data-reveal]');
if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('shown');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  revealItems.forEach((el) => revealObserver.observe(el));
}
