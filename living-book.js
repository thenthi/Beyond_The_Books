const form = document.querySelector('#living-form');
const select = document.querySelector('#topic-select');

select.insertAdjacentHTML('beforeend',
  TOPICS.map((t) => `<option value="${t.id}">${t.title}</option>`).join('') +
  '<option value="other">Other</option>');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // TODO: gửi dữ liệu đi (Google Form / Formspree / backend). Hiện tại chỉ hiển thị cảm ơn.
  console.log('Living Book:', Object.fromEntries(new FormData(form)));
  form.hidden = true;
  document.querySelector('#thanks').hidden = false;
});
