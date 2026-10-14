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

const submitBtn = form.querySelector('button[type="submit"]');
const errorBox = document.querySelector('#form-error');

function showError(html) {
  errorBox.innerHTML = html;
  errorBox.hidden = false;
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!booking || !params.get('date') || !params.get('time')) {
    showError('Please <a href="booking.html">choose a Living Book and a time</a> first.');
    return;
  }

  errorBox.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  const data = Object.fromEntries(new FormData(form));
  try {
    const result = await sendToSheet({
      type: 'booking',
      personId: booking.person.id,
      personName: booking.person.name,
      topic: booking.topic.title,
      date: params.get('date'),
      time: params.get('time'),
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      message: data.message,
    });

    if (!result.ok && result.error === 'taken') {
      const back = `detail.html?topic=${booking.topic.id}&person=${params.get('person')}`;
      showError(`Sorry, someone just booked this time. <a href="${back}">Pick another time →</a>`);
      return;
    }
    if (!result.ok) throw new Error(result.error);

    form.hidden = true;
    document.querySelector('#thanks').hidden = false;
  } catch (err) {
    showError('Something went wrong. Please try again.');
  }
});
