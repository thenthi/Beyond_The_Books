# Kết nối web với Google Sheet

Sau khi làm xong các bước dưới đây:

- Mỗi lượt book được lưu thành một dòng trong tab **Bookings** của Sheet.
- Mỗi đơn "Be a Living Book" được lưu vào tab **Living Book applications**.
- Mỗi câu trả lời feedback (trang FAQ) được lưu vào tab **Feedback**.
- Khung giờ đã có người đặt sẽ hiện **Booked** và không bấm được nữa.

## Các bước (khoảng 5 phút)

1. Vào [sheets.google.com](https://sheets.google.com) và tạo một Google Sheet mới, ví dụ đặt tên **Beyond The Books – Bookings**.
2. Trên thanh menu của Sheet, chọn **Extensions → Apps Script**.
3. Xoá hết code có sẵn, dán toàn bộ nội dung file [`Code.gs`](Code.gs) vào, rồi bấm **Save** (biểu tượng đĩa).
4. Bấm **Deploy → New deployment**:
   - Ở *Select type* (bánh răng), chọn **Web app**.
   - *Execute as*: **Me**.
   - *Who has access*: **Anyone**.
   - Bấm **Deploy**. Google sẽ hỏi quyền truy cập: chọn tài khoản của bạn → **Advanced** → **Go to … (unsafe)** → **Allow**. Đây là script của chính bạn nên cứ cho phép.
5. Copy **Web app URL** (có dạng `https://script.google.com/macros/s/…/exec`).
6. Mở file [`../api.js`](../api.js) và dán URL vào dòng:

   ```js
   const BOOKING_API_URL = 'https://script.google.com/macros/s/…/exec';
   ```

7. Lưu file, mở lại web và thử book một lượt. Bạn sẽ thấy tab **Bookings** tự xuất hiện trong Sheet, kèm một dòng dữ liệu mới.

## Lưu ý

- **Nếu sửa `Code.gs`**, bạn phải vào **Deploy → Manage deployments → Edit (cây bút) → Version: New version → Deploy** thì thay đổi mới có hiệu lực. URL vẫn giữ nguyên.
- **Huỷ một lượt book:** xoá dòng đó trong Sheet, khung giờ sẽ trống lại.
- **Không đổi tên Living Book** trong `data.js` khi đã có người đặt lịch. Lịch đặt được gắn theo mã tạo từ tên, ví dụ `art-linh-nguyen`, nên đổi tên sẽ làm mất liên kết với các lượt đặt cũ.
- **Khi `BOOKING_API_URL` còn để trống**, web vẫn chạy bình thường nhưng **không lưu gì cả**, và mọi khung giờ đều chọn được.
