// Form dạng "khung câu hỏi" dùng chung cho trang Be a Living Book và trang Feedback (FAQ).
// data-type trên <form> quyết định dữ liệu được lưu vào tab nào trên Google Sheet.
const form = document.querySelector('#q-form');
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

function showError(text) {
  errorBox.textContent = text;
  errorBox.hidden = false;
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const answers = Object.fromEntries(new FormData(form));

  // Form feedback: không bắt buộc câu nào, nhưng phải trả lời ít nhất 1 câu
  if (form.hasAttribute('data-need-one') && !Object.values(answers).some((v) => v.trim())) {
    showError('Please answer at least one question.');
    return;
  }

  errorBox.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const result = await sendToSheet({ type: form.dataset.type, ...answers });
    if (!result.ok) throw new Error(result.error);
    form.hidden = true;
    document.querySelector('#thanks').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    showError('Something went wrong. Please try again.');
  }
});
