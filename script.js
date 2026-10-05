const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
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