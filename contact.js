const params = new URLSearchParams(location.search);
const booking = findBooking(params);
const summary = document.querySelector('#summary');
const form = document.querySelector('#contact-form');

if (booking && params.get('date') && params.get('time')) {
  const [y, m, d] = params.get('date').split('-').map(Number);
  const dateText = new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
  summary.innerHTML = `
    <span class="tag">${booking.topic.title}</span>
    <strong>${booking.person.name}</strong>
    <span>${dateText} · ${params.get('time')}</span>`;
} else {
  summary.innerHTML = 'You haven\'t picked a session yet. <a href="booking.html">Choose a topic →</a>';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // TODO: gửi dữ liệu đi (Google Form / Formspree / backend). Hiện tại chỉ hiển thị cảm ơn.
  const data = Object.fromEntries(new FormData(form));
  console.log('Booking:', { ...data, ...Object.fromEntries(params) });
  form.hidden = true;
  document.querySelector('#thanks').hidden = false;
});
