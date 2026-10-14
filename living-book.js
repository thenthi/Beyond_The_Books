const form = document.querySelector('#living-form');
const submitBtn = form.querySelector('button[type="submit"]');
const errorBox = document.querySelector('#form-error');

// Các khung câu hỏi hiện dần lên khi cuộn tới
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shown');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.q-card').forEach((card) => observer.observe(card));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const answers = Object.fromEntries(new FormData(form));
  if (!Object.values(answers).some((v) => v.trim())) {
    errorBox.textContent = 'Please answer at least one question.';
    errorBox.hidden = false;
    return;
  }

  errorBox.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const result = await sendToSheet({ type: 'livingbook', ...answers });
    if (!result.ok) throw new Error(result.error);
    form.hidden = true;
    document.querySelector('#thanks').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    errorBox.textContent = 'Something went wrong. Please try again.';
    errorBox.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});
