const form = document.querySelector('#living-form');
const select = document.querySelector('#topic-select');

select.insertAdjacentHTML('beforeend',
  TOPICS.map((t) => `<option value="${t.id}">${t.title}</option>`).join('') +
  '<option value="other">Other</option>');

const submitBtn = form.querySelector('button[type="submit"]');
const errorBox = document.querySelector('#form-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const result = await sendToSheet({ type: 'livingbook', ...Object.fromEntries(new FormData(form)) });
    if (!result.ok) throw new Error(result.error);
    form.hidden = true;
    document.querySelector('#thanks').hidden = false;
  } catch (err) {
    errorBox.textContent = 'Something went wrong. Please try again.';
    errorBox.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});
