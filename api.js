// Kết nối với Google Sheet (qua Google Apps Script). Hướng dẫn: apps-script/README.md
// Dán URL Web App (kết thúc bằng /exec) vào đây:
const BOOKING_API_URL = 'https://script.google.com/macros/s/AKfycbzgdUtIK2v3iPvCx5aJN377LgaUesdqg7qLC6rQmA62eDO4C7aUEYDd-JmQIO_Zt6wr1A/exec';

// Lấy các khung giờ đã có người đặt: [{ date: '2026-10-17', time: '10:30' }, ...]
async function fetchBooked(personId) {
  if (!BOOKING_API_URL) return [];
  const res = await fetch(`${BOOKING_API_URL}?person=${encodeURIComponent(personId)}`);
  const data = await res.json();
  return data.booked || [];
}

// Gửi dữ liệu lên Sheet. Trả về { ok: true } hoặc { ok: false, error: 'taken' }
async function sendToSheet(payload) {
  if (!BOOKING_API_URL) {
    console.warn('BOOKING_API_URL is empty — data was not saved.', payload);
    return { ok: true };
  }
  // text/plain để trình duyệt không chặn (CORS) khi gửi tới Apps Script
  const res = await fetch(BOOKING_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
