const booking = findBooking(new URLSearchParams(location.search));
if (!booking) location.replace('booking.html');

const { topic, person } = booking;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const SCRIBBLE =
  '<svg class="scribble" viewBox="0 0 60 60" aria-hidden="true"><path d="M34 6C50 6 57 18 55 31C53 46 38 55 23 52C9 49 3 35 6 22C9 10 22 3 40 7" /></svg>';
const FLOWER =
  '<svg viewBox="-12 -12 24 24"><g fill="#fff" stroke="#1f2a27" stroke-width="1.1">' +
  [0, 72, 144, 216, 288].map((r) => `<ellipse cy="-6" rx="4" ry="5.5" transform="rotate(${r})"/>`).join('') +
  '</g><circle r="2.6" fill="#e07a5f"/></svg>';

const today = new Date();
today.setHours(0, 0, 0, 0);
const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1); // cho đặt tối đa 3 tháng

let viewMonth = new Date(firstMonth);
let selectedDate = null;
let selectedTime = null;

const els = {
  month: document.querySelector('#cal-month'),
  days: document.querySelector('#cal-days'),
  prev: document.querySelector('#cal-prev'),
  next: document.querySelector('#cal-next'),
  times: document.querySelector('#time-grid'),
  hint: document.querySelector('#time-hint'),
  book: document.querySelector('#book-btn'),
};

document.title = `${person.name} · Beyond The Books`;
document.querySelector('#info-card').style.setProperty('--topic-color', topic.color);
document.querySelector('#info-card').innerHTML = `
  <span class="avatar">${AVATAR_SVG}</span>
  <div>
    <span class="tag">${topic.title}</span>
    <h2>${person.name}</h2>
    <p class="person-role">${person.role}</p>
    <p>${person.bio}</p>
  </div>
  <span class="info-flower f1">${FLOWER}</span>
  <span class="info-flower f2">${FLOWER}</span>`;

const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function renderCalendar() {
  const y = viewMonth.getFullYear();
  const m = viewMonth.getMonth();
  els.month.textContent = `${MONTHS[m]} ${y}`;
  els.prev.disabled = viewMonth <= firstMonth;
  els.next.disabled = viewMonth >= lastMonth;

  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // tuần bắt đầu từ T2
  const total = new Date(y, m + 1, 0).getDate();
  let html = '<span></span>'.repeat(offset);

  for (let d = 1; d <= total; d++) {
    const date = new Date(y, m, d);
    const key = toKey(date);
    const available = date >= today && person.days.includes(date.getDay());
    const selected = key === selectedDate;
    html += `<button type="button" class="day${selected ? ' selected' : ''}" data-date="${key}"
      ${available ? '' : 'disabled'} aria-pressed="${selected}">${d}${selected ? SCRIBBLE : ''}</button>`;
  }
  els.days.innerHTML = html;
}

function renderTimes() {
  if (!selectedDate) {
    els.times.innerHTML = '';
    els.hint.hidden = false;
    return;
  }
  els.hint.hidden = true;
  els.times.innerHTML = person.times.map((t) =>
    `<button type="button" class="slot${t === selectedTime ? ' selected' : ''}" data-time="${t}"
      aria-pressed="${t === selectedTime}">${t}</button>`).join('');
}

function updateBookButton() {
  els.book.disabled = !(selectedDate && selectedTime);
}

els.prev.addEventListener('click', () => {
  viewMonth.setMonth(viewMonth.getMonth() - 1);
  renderCalendar();
});

els.next.addEventListener('click', () => {
  viewMonth.setMonth(viewMonth.getMonth() + 1);
  renderCalendar();
});

els.days.addEventListener('click', (e) => {
  const btn = e.target.closest('.day');
  if (!btn || btn.disabled) return;
  selectedDate = btn.dataset.date;
  selectedTime = null;
  renderCalendar();
  renderTimes();
  updateBookButton();
});

els.times.addEventListener('click', (e) => {
  const btn = e.target.closest('.slot');
  if (!btn) return;
  selectedTime = btn.dataset.time;
  renderTimes();
  updateBookButton();
});

els.book.addEventListener('click', () => {
  const params = new URLSearchParams(location.search);
  params.set('date', selectedDate);
  params.set('time', selectedTime);
  location.href = `contact.html?${params}`;
});

renderCalendar();
renderTimes();
