// Form dạng "khung câu hỏi" dùng chung cho trang Be a Living Book và trang Feedback (FAQ).
// data-type trên <form> quyết định dữ liệu được lưu vào tab nào trên Google Sheet.
// data-no-save: không lưu đi đâu cả, chỉ hiện lời cảm ơn.
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

// Chọn "Something new" (ô có data-other) thì hiện ô để gõ thêm
document.querySelectorAll('[data-other]').forEach((box) => {
  const other = document.getElementById(box.dataset.other);
  box.addEventListener('change', () => {
    other.hidden = !box.checked;
    if (box.checked) other.focus();
    else other.value = '';
  });
});

function showError(text) {
  errorBox.textContent = text;
  errorBox.hidden = false;
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Câu chọn nhiều đáp án (checkbox) gộp lại thành "Art, Film, …"
  const answers = {};
  for (const [key, value] of new FormData(form)) {
    answers[key] = answers[key] ? `${answers[key]}, ${value}` : value;
  }

  // Form feedback: không bắt buộc câu nào, nhưng phải trả lời ít nhất 1 câu
  if (form.hasAttribute('data-need-one') && !Object.values(answers).some((v) => v.trim())) {
    showError('Please answer at least one question.');
    return;
  }

  errorBox.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    if (!form.hasAttribute('data-no-save')) {
      const result = await sendToSheet({ type: form.dataset.type, ...answers });
      if (!result.ok) throw new Error(result.error);
    }
    form.hidden = true;
    document.querySelector('#thanks').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    showError('Something went wrong. Please try again.');
  }
});
