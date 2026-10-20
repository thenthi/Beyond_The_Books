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

// Ô email chỉ nhận địa chỉ Gmail (@gmail.com): báo lỗi bằng câu dễ hiểu thay cho thông báo mặc định
document.querySelectorAll('input[data-gmail]').forEach((input) => {
  input.addEventListener('input', () => input.setCustomValidity(''));
  input.addEventListener('invalid', () => {
    if (input.value && !input.validity.valueMissing) {
      const rmit = /@([a-z0-9-]+\.)*rmit\.edu(\.[a-z]+)?$/i.test(input.value.trim());
      input.setCustomValidity(rmit
        ? 'RMIT email addresses are not accepted. Please use a Gmail address (ending in @gmail.com).'
        : 'Please use a Gmail address (ending in @gmail.com).');
    }
  });
});

// Vào trang chủ từ mã QR (?from=qr): hiện lời chào hỏi người mới / người cũ
const welcome = document.querySelector('#welcome');
if (welcome && new URLSearchParams(location.search).get('from') === 'qr') {
  history.replaceState(null, '', location.pathname + location.hash); // tải lại trang thì không hiện nữa
  welcome.showModal();
  welcome.focus(); // đặt con trỏ vào khung thông báo, không vào nút ✕ (đỡ hiện viền xanh)
  welcome.addEventListener('click', (e) => {
    if (e.target === welcome || e.target.closest('[data-close]')) welcome.close(); // chạm ra ngoài hoặc nút đóng
  });
}
