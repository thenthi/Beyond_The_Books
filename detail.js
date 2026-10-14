const booking = findBooking(new URLSearchParams(location.search));
if (!booking) location.replace('booking.html');

const { topic, person } = booking;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const SCRIBBLE =
  '<svg class="scribble" viewBox="0 0 60 60" aria-hidden="true"><path d="M34 6C50 6 57 18 55 31C53 46 38 55 23 52C9 49 3 35 6 22C9 10 22 3 40 7" /></svg>';
// Dây leo + hoa trang trí chạy dọc mép trên và mép phải của card thông tin
const flower = (x, y, r = 1) =>
  `<g transform="translate(${x} ${y}) scale(${r})"><g fill="#fff" stroke="#1f2a27" stroke-width="1.1">` +
  [0, 72, 144, 216, 288].map((a) => `<ellipse cy="-6" rx="4" ry="5.5" transform="rotate(${a})"/>`).join('') +
  '</g><circle r="2.6" fill="#f28b75"/></g>';
const leaf = (x, y, a) =>
  `<path transform="translate(${x} ${y}) rotate(${a})" d="M0 0C4 -6 13 -6 17 0C13 6 4 6 0 0Z" fill="#a8bfa3" stroke="#1f2a27" stroke-width="1"/>`;
const VINE = `<svg class="info-vine" viewBox="0 0 200 150" aria-hidden="true">
  <path class="vine-line" d="M4 18C30 6 52 26 80 14S130 4 160 14S194 22 190 44S180 80 190 104S186 136 188 148" />
  ${leaf(36, 14, -20)}${leaf(64, 20, 160)}${leaf(110, 8, -10)}${leaf(146, 12, 150)}
  ${leaf(190, 58, 100)}${leaf(184, 96, 250)}${leaf(190, 126, 80)}
  ${flower(92, 12, 1.1)}${flower(174, 16, 1.3)}${flower(186, 76, 1)}${flower(188, 140, 0.8)}
</svg>`;

// Khung giờ: 9:00 → 17:30, mỗi khung 30 phút (buổi cuối kết thúc lúc 18:00)
const TIMES = [];
for (let mins = 9 * 60; mins < 18 * 60; mins += 30) {
  TIMES.push(`${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`);
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const lastMonth = new Date(today.getFullYear(), today.getMonth() + 12, 1); // xem được tới 12 tháng sau

let viewMonth = new Date(firstMonth);
let selectedDate = null;
let selectedTime = null;
let booked = new Set(); // các "ngày giờ" đã có người đặt, lấy từ Google Sheet
let loadingBooked = true;

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
  ${VINE}`;

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
    const available = date >= today; // từ hôm nay trở đi đều chọn được
    const selected = key === selectedDate;
    const isToday = date.getTime() === today.getTime();
    html += `<button type="button" class="day${selected ? ' selected' : ''}${isToday ? ' today' : ''}" data-date="${key}"
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
  if (loadingBooked) {
    els.times.innerHTML = '';
    els.hint.textContent = 'Checking availability…';
    els.hint.hidden = false;
    return;
  }
  els.hint.hidden = true;
  // nếu chọn hôm nay thì khoá các giờ đã qua; giờ đã có người đặt cũng bị khoá
  const now = new Date();
  const isToday = selectedDate === toKey(now);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  els.times.innerHTML = TIMES.map((t) => {
    const [h, m] = t.split(':').map(Number);
    const past = isToday && h * 60 + m <= nowMins;
    const taken = booked.has(`${selectedDate} ${t}`);
    return `<button type="button" class="slot${t === selectedTime ? ' selected' : ''}${taken ? ' booked' : ''}"
      data-time="${t}" ${past || taken ? 'disabled' : ''} aria-pressed="${t === selectedTime}">
      ${t}${taken ? '<small>Booked</small>' : ''}</button>`;
  }).join('');
}

function updateBookButton() {
  els.book.disabled = !(selectedDate && selectedTime);
}

function changeMonth(step) {
  const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + step, 1);
  if (next < firstMonth || next > lastMonth) return;
  viewMonth = next;
  renderCalendar();
}

els.prev.addEventListener('click', () => changeMonth(-1));
els.next.addEventListener('click', () => changeMonth(1));

// vuốt trái/phải trên lịch để đổi tháng (điện thoại)
let touchX = null;
const calendar = document.querySelector('.calendar');
calendar.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
calendar.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) changeMonth(dx < 0 ? 1 : -1);
  touchX = null;
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
  if (!btn || btn.disabled) return;
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

fetchBooked(person.id)
  .then((list) => { booked = new Set(list.map((b) => `${b.date} ${b.time}`)); })
  .catch(() => console.warn('Could not load booked slots'))
  .finally(() => {
    loadingBooked = false;
    els.hint.textContent = 'Pick a date first.';
    renderTimes();
  });
