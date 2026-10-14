# Kết nối web với Google Sheet (làm lại từ đầu)

Khi làm xong:

- Mỗi lượt đặt lịch (trang Contact) được lưu vào tab **Bookings**.
- Mỗi đơn đăng ký **Be a Living Book** được lưu vào tab **Living Book applications**.
- Khung giờ đã có người đặt sẽ hiện **Booked** và không chọn được nữa.

> Làm trên **một Google Sheet mới tinh**, đừng dùng lại Sheet cũ, để tránh lẫn với code cũ.

## Bước 1: Tạo Google Sheet mới

1. Đăng nhập **đúng tài khoản Google** bạn muốn dùng để lưu dữ liệu.
2. Vào <https://sheets.google.com> và bấm **Blank** (trang tính trống).
3. Đặt tên ở góc trên bên trái, ví dụ **Beyond The Books – Data**.

## Bước 2: Dán code

1. Trên menu của Sheet, chọn **Extensions → Apps Script**. Một tab mới mở ra.
2. Trong file `Code.gs` có sẵn, **xoá hết** nội dung (Cmd + A rồi Delete).
3. Mở file [`Code.gs`](Code.gs) trong project này, **copy toàn bộ** và dán vào.
4. Bấm biểu tượng **đĩa mềm (Save)**.

## Bước 3: Tạo sẵn các tab (để kiểm tra code đã chạy)

1. Trên thanh công cụ của Apps Script, ở ô chọn hàm (cạnh nút ▶ Run), chọn **`setup`**.
2. Bấm **▶ Run**.
3. Lần đầu Google sẽ hỏi quyền: **Review permissions** → chọn tài khoản → **Advanced** → **Go to … (unsafe)** → **Allow**.
4. Quay lại tab Google Sheet. Bạn sẽ thấy 2 tab mới: **Bookings** và **Living Book applications**, có sẵn hàng tiêu đề. Nếu chưa thấy hai tab này thì code chưa chạy, đừng làm tiếp.

## Bước 4: Deploy (chỉ làm "New deployment" một lần duy nhất)

1. Trong Apps Script, bấm nút xanh **Deploy → New deployment**.
2. Bấm **bánh răng** cạnh *Select type* → chọn **Web app**.
3. Điền:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Bấm **Deploy** và copy **Web app URL** (dạng `https://script.google.com/macros/s/…/exec`).

## Bước 5: Kiểm tra URL

Dán URL vào trình duyệt và thêm `?ping=1` vào cuối, ví dụ:

```
https://script.google.com/macros/s/…/exec?ping=1
```

Trang phải hiện: `{"ok":true,"version":"btb-2026-10-14-mail"}`. Nếu đúng như vậy, gửi URL này cho người phụ trách web để dán vào dòng `BOOKING_API_URL` trong [`../api.js`](../api.js).

## Khi cần sửa code sau này

Sửa `Code.gs` → **Save** → **Deploy → Manage deployments** → bấm **cây bút ✏️ (Edit)** → ở **Version** chọn **New version** → **Deploy**.

Làm theo cách này thì URL giữ nguyên. **Đừng bấm "New deployment" lần nữa**, vì làm vậy sẽ tạo ra URL khác và web vẫn gọi URL cũ đang chạy code cũ.

## Huỷ một lượt đặt lịch

Xoá dòng đó trong tab **Bookings**, khung giờ sẽ trống lại.

## Email xác nhận

Sau khi đặt lịch hoặc gửi đơn Be a Living Book, người dùng sẽ nhận được email xác nhận, trong đó có câu cam kết bảo mật thông tin. Email được gửi từ tài khoản Google sở hữu Sheet, tên người gửi hiện là **Beyond The Books**.

- Tài khoản Gmail thường gửi được khoảng **100 email mỗi ngày**.
- Nếu gửi email bị lỗi, dữ liệu vẫn được lưu vào Sheet như bình thường.
