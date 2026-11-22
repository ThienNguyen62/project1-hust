# Chuẩn bị MySQL sau khi clone project

## 1. Mở kết nối MySQL trong Workbench

Nếu máy chưa có, cài MySQL Server và MySQL Workbench. Trong Workbench, mở kết nối local có sẵn, ví dụ **Local instance MySQL80**. Nếu chưa có kết nối, bấm **+** cạnh **MySQL Connections**, chọn **Standard TCP/IP**, điền hostname `127.0.0.1`, cổng MySQL (thường là `3306`) và tài khoản quản trị (thường là `root`). Bấm **Test Connection** và nhập mật khẩu MySQL của tài khoản quản trị.

**Kết quả cần thấy** là màn hình **SQL Editor** với mục **SCHEMAS** bên trái. Ghi lại cổng của kết nối để điền vào cấu hình backend.

## 2. Tạo database

Trong Workbench, chọn **File → Open SQL Script**, mở [schema.sql](./schema.sql) rồi bấm nút tia sét đầu tiên để chạy. Bấm biểu tượng làm mới bên cạnh **SCHEMAS**.

**Kết quả cần thấy** là `school_management` xuất hiện trong danh sách. Bạn có thể chạy lại file này nếu cần.

## 3. Tạo tài khoản cho backend

Mở [setup-user.sql](./setup-user.sql) trong Workbench. Thay `THAY_BANG_MAT_KHAU_RIENG` trong tab soạn lệnh bằng mật khẩu riêng bạn đặt cho `school_app`. Đặt con trỏ trong từng câu lệnh rồi nhấn **Ctrl+Enter** để chạy từ trên xuống.

Nếu `school_app` đã tồn tại, dùng mật khẩu hiện có và chỉ chạy hai câu `GRANT` và `SHOW GRANTS`. Khi xong, đóng tab SQL và chọn bỏ thay đổi nếu Workbench hỏi lưu.

**Kết quả cần thấy** là `SHOW GRANTS` liệt kê quyền `SELECT`, `INSERT`, `UPDATE`, `DELETE` trên `school_management.*`.

## 4. Điền cấu hình backend

Trong VS Code, nếu chưa có `backend/.env`, sao chép [backend/.env.example](../backend/.env.example) thành `backend/.env`. Nếu đã có, giữ các cấu hình hiện tại và thêm hoặc cập nhật các dòng dưới đây. Thay mật khẩu mẫu bằng mật khẩu của `school_app` và dùng cổng MySQL ở bước 1.

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=school_app
DB_PASSWORD="THAY_BANG_MAT_KHAU_RIENG"
DB_NAME=school_management
```

**Kết quả cần thấy** là `backend/.env` có đủ năm biến `DB_*`. Lưu mật khẩu thật trong file này, vốn được Git bỏ qua.

## 5. Kiểm tra kết nối

Trong VS Code, mở **Terminal → New Terminal**. Từ thư mục gốc project chạy `cd backend`. Nếu terminal đã ở thư mục `backend`, đi thẳng tới lệnh tiếp theo. Chạy `npm ci` nếu vừa clone và chưa cài dependencies, sau đó chạy:

```powershell
npm run db:check
```

**Kết quả cần thấy** là dòng sau:

```text
MySQL connection successful: { connected: 1, database_name: 'school_management' }
```

| Nếu gặp lỗi | Kiểm tra |
| --- | --- |
| `Missing DB_...` | Tên biến và vị trí file `backend/.env`. |
| `ECONNREFUSED` hoặc `ETIMEDOUT` | MySQL đang chạy và host, cổng khớp với kết nối trong Workbench. |
| `ER_ACCESS_DENIED_ERROR` | Tài khoản, mật khẩu và quyền ở bước 3. |
| `ER_BAD_DB_ERROR` | `school_management` đã xuất hiện trong **SCHEMAS** và khớp `DB_NAME`. |

[seed.sql](./seed.sql) dành cho dữ liệu mẫu sau khi project có bảng. Bạn có thể hoàn thành kiểm tra kết nối với database trống.
