/**
 * Beyond The Books — Google Apps Script backend
 * Dán toàn bộ file này vào Extensions → Apps Script của Google Sheet, rồi Deploy → Web app.
 * Xem hướng dẫn trong apps-script/README.md
 */

const BOOKINGS = 'Bookings';
const BOOKING_HEADERS = ['Created at', 'Person ID', 'Living Book', 'Topic', 'Date', 'Time',
  'Name', 'Email', 'Phone', 'Gender', 'Message'];

const LIVING_BOOKS = 'Living Book applications';
// Tiêu đề cột = nguyên văn câu hỏi trên trang Be a Living Book (living-book.html)
const LIVING_HEADERS = ['Created at',
  "Q1 What's your name?",
  'Q2 Email address',
  'Q3 What language are you comfortable having a conversation in?',
  'Q4 Which topics would you feel comfortable/confident talking about as a Living Book?',
  'Q5 Why would you like to be a Living Book? What interested you?',
  'Q6 Do you have experience with similar events? Can you tell us more about it?',
  'Q7 What qualities do you have that would make you a good Living Book?'];

const FEEDBACK = 'Feedback';
const FEEDBACK_HEADERS = ['Created at',
  'Q1 What did you like most about Beyond the Book?',
  'Q2 What did you like least about the experience?',
  'Q3 Was the booking process easy to use?',
  'Q4 Did Beyond the Book help you feel more connected to others?',
  'Q5 What topic would you like to have in the future?',
  'Q6 Would you join another session in the future? Why or why not?',
  'Q7 What do you think could improve?',
  'Q8 What do you think could be removed?'];

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

// GET ?person=<id>  →  các khung giờ đã có người đặt của Living Book đó
function doGet(e) {
  const personId = (e.parameter.person || '').trim();
  const rows = getSheet_(BOOKINGS, BOOKING_HEADERS).getDataRange().getDisplayValues().slice(1);
  const booked = rows
    .filter((r) => r[1] === personId)
    .map((r) => ({ date: r[4], time: r[5] }));
  return json_({ ok: true, booked: booked });
}

// POST (body JSON) → lưu booking hoặc đơn đăng ký Living Book
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // tránh 2 người đặt cùng lúc

  try {
    if (data.type === 'livingbook') {
      getSheet_(LIVING_BOOKS, LIVING_HEADERS).appendRow([new Date(),
        data.q1, data.q2, data.q3, data.q4, data.q5, data.q6, data.q7]);
      return json_({ ok: true });
    }

    if (data.type === 'feedback') {
      getSheet_(FEEDBACK, FEEDBACK_HEADERS).appendRow([new Date(),
        data.q1, data.q2, data.q3, data.q4, data.q5, data.q6, data.q7, data.q8]);
      return json_({ ok: true });
    }

    const sheet = getSheet_(BOOKINGS, BOOKING_HEADERS);
    const rows = sheet.getDataRange().getDisplayValues().slice(1);
    const taken = rows.some((r) => r[1] === data.personId && r[4] === data.date && r[5] === data.time);
    if (taken) return json_({ ok: false, error: 'taken' });

    sheet.appendRow([new Date(), data.personId, data.personName, data.topic, text_(data.date),
      text_(data.time), data.name, data.email, text_(data.phone), data.gender || '', data.message || '']);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
