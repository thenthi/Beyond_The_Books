/**
 * Beyond The Books — Google Apps Script backend
 * Dán toàn bộ file này vào Extensions → Apps Script của Google Sheet, rồi Deploy → Web app.
 * Xem hướng dẫn trong apps-script/README.md
 */

// Mã phiên bản: mở <URL Web app>?ping=1 để xem Google đang chạy bản nào
const VERSION = 'btb-2026-10-20-map';

// 1) Trang Contact (đặt lịch) → tab "Bookings"
const BOOKINGS = 'Bookings';
const BOOKING_HEADERS = ['Created at', 'Person ID', 'Living Book', 'Topic', 'Date', 'Time',
  'Name', 'Email', 'Gender', 'Message'];

// 2) Trang Be a Living Book (living-book.html) → tab "Living Book applications"
//    Tiêu đề cột = nguyên văn câu hỏi trên trang
const LIVING_BOOKS = 'Living Book applications';
const LIVING_HEADERS = ['Created at',
  "Q1 What's your name?",
  'Q2 Email address',
  'Q3 What language are you comfortable having a conversation in?',
  'Q4 Which topics would you feel comfortable/confident talking about as a Living Book?',
  'Q5 Why would you like to be a Living Book? What interested you?',
  'Q6 Do you have experience with similar events? Can you tell us more about it?',
  'Q7 What qualities do you have that would make you a good Living Book?'];

// 3) Trang FAQ, phần Feedback for us (faq.html) → tab "Feedback"
const FEEDBACK = 'Feedback';
const FEEDBACK_HEADERS = ['Created at',
  'Q1 Overall, how satisfied were you with Beyond the Books?',
  'Q2 Was the booking process easy to use?',
  'Q3 Did Beyond the Books help you feel more connected to others?',
  'Q4 How was the length of your session?',
  'Q5 Would you join another session in the future?',
  'Q6 Would you recommend Beyond the Books to a friend?',
  'Q7 Which topics would you like to see more of?',
  'Q7 Something new (typed)',
  "Q8 Anything else you'd like to tell us?"];

function getSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.setFrozenRows(1);
  }
  // Luôn ghi lại hàng tiêu đề cho khớp với câu hỏi hiện tại (kể cả khi tab đã có từ trước)
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Thêm dấu ' để Sheets giữ nguyên dạng chữ, không tự đổi "2026-10-17" / "10:30" thành ngày giờ
const text_ = (v) => "'" + String(v || '');

// Chạy hàm này 1 lần trong Apps Script (nút ▶ Run) để tạo sẵn 3 tab với đúng tiêu đề cột
// và cấp quyền gửi email cho script
function setup() {
  getSheet_(BOOKINGS, BOOKING_HEADERS);
  getSheet_(LIVING_BOOKS, LIVING_HEADERS);
  getSheet_(FEEDBACK, FEEDBACK_HEADERS);
  Logger.log('Emails left today: ' + MailApp.getRemainingDailyQuota());
}

// ===== Email xác nhận gửi về cho người dùng =====
const PRIVACY_NOTE = 'Your personal information is kept private and secure. It is only used by the ' +
  'Beyond The Books team to organise your session and will never be shared with anyone else.';

// Chỗ gặp Living Book: gửi kèm trong mail xác nhận đặt lịch. Ảnh bản đồ lấy từ web (GitHub Pages).
const MEET_PLACE = 'Swanston Library, Level 5: the Balcony next to PCs 5C 1-20 (circled in red on the map). ' +
  'From the library entrance, follow the red line past the Holds desk.';
const MAP_URL = 'https://thenthi.github.io/Beyond_The_Books/assets/library-map.jpg';

const esc_ = (v) => String(v || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function sendMail_(to, subject, intro, rows, withMap) {
  if (!to) return;
  const table = rows.map(([k, v]) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6b6b6b">${esc_(k)}</td><td style="padding:4px 0"><b>${esc_(v)}</b></td></tr>`).join('');
  const html = `<div style="font-family:Arial,sans-serif;color:#1f2a27;line-height:1.5;max-width:520px">
    <h2 style="color:#304e63;margin:0 0 12px">Beyond The Books</h2>
    <p>${esc_(intro)}</p>
    ${table ? `<table style="border-collapse:collapse;margin:12px 0">${table}</table>` : ''}
    ${withMap ? `<h3 style="color:#304e63;margin:20px 0 6px">📍 Where to meet</h3>
    <p style="margin:0 0 10px">${esc_(MEET_PLACE)}</p>
    <a href="${MAP_URL}"><img src="${MAP_URL}" alt="Map of Swanston Library Level 5" width="520"
      style="display:block;width:100%;max-width:520px;height:auto;border:1px solid #e4ddd2;border-radius:8px" /></a>` : ''}
    <p style="padding:12px 14px;background:#fff7ec;border-left:4px solid #a8bfa3;border-radius:6px">🔒 ${PRIVACY_NOTE}</p>
    <p>See you soon,<br>The Beyond The Books team</p>
  </div>`;
  const text = intro + '\n\n' + rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    (withMap ? `\n\nWhere to meet: ${MEET_PLACE}\nMap: ${MAP_URL}` : '') +
    '\n\n' + PRIVACY_NOTE + '\n\nThe Beyond The Books team';
  // Lỗi gửi mail (sai địa chỉ, hết hạn mức) không được làm hỏng việc lưu dữ liệu
  try {
    MailApp.sendEmail({ to: to, subject: subject, body: text, htmlBody: html, name: 'Beyond The Books' });
  } catch (err) {
    console.error('Email failed: ' + err);
  }
}

// GET ?ping=1        →  kiểm tra phiên bản code đang chạy
// GET ?person=<id>   →  các khung giờ đã có người đặt của Living Book đó
function doGet(e) {
  if (e.parameter.ping) return json_({ ok: true, version: VERSION });
  const personId = (e.parameter.person || '').trim();
  const rows = getSheet_(BOOKINGS, BOOKING_HEADERS).getDataRange().getDisplayValues().slice(1);
  const booked = rows
    .filter((r) => r[1] === personId)
    .map((r) => ({ date: r[4], time: r[5] }));
  return json_({ ok: true, booked: booked });
}

// POST (body JSON) → lưu feedback, đơn Be a Living Book hoặc booking
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // tránh 2 người đặt cùng lúc

  try {
    // Feedback không có email nên không gửi mail
    if (data.type === 'feedback') {
      getSheet_(FEEDBACK, FEEDBACK_HEADERS).appendRow([new Date(),
        data.q1 || '', data.q2 || '', data.q3 || '', data.q4 || '', data.q5 || '', data.q6 || '',
        data.q7 || '', data.q7_other || '', data.q8 || '']);
      return json_({ ok: true });
    }

    if (data.type === 'livingbook') {
      getSheet_(LIVING_BOOKS, LIVING_HEADERS).appendRow([new Date(),
        data.q1, data.q2, data.q3, data.q4, data.q5, data.q6, data.q7]);
      sendMail_(data.q2, 'We received your Living Book application',
        `Hi ${data.q1}, thank you for applying to be a Living Book! We have received your application and will get back to you soon.`, []);
      return json_({ ok: true });
    }

    const sheet = getSheet_(BOOKINGS, BOOKING_HEADERS);
    const rows = sheet.getDataRange().getDisplayValues().slice(1);
    const taken = rows.some((r) => r[1] === data.personId && r[4] === data.date && r[5] === data.time);
    if (taken) return json_({ ok: false, error: 'taken' });

    sheet.appendRow([new Date(), data.personId, data.personName, data.topic, text_(data.date),
      text_(data.time), data.name, data.email, data.gender || '', data.message || '']);
    sendMail_(data.email, 'Your Beyond The Books booking is confirmed',
      `Hi ${data.name}, your session is booked! Here are the details:`,
      [['Living Book', data.personName], ['Topic', data.topic], ['Date', data.date], ['Time', data.time]], true);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
