# Thiết lập MySQL

Project chọn MySQL. Chỉ backend kết nối database, frontend tiếp tục gọi Express API. Chưa tạo bảng nghiệp vụ.

## Bước 1 — Mở MySQL Workbench

Máy hiện tại đã có MySQL Server 8.0, Workbench 8.0; dịch vụ MySQL80 đang chạy nên không cần cài lại.

Mở Workbench, chọn kết nối local hoặc nhấn dấu + để tạo:

- Connection Method: Standard TCP/IP.
- Hostname: `127.0.0.1`.
- Port: `3306` (đổi nếu MySQL của bạn dùng cổng khác).
- Username: tài khoản quản trị MySQL của bạn, thường là `root`.

Nhấn Test Connection và nhập mật khẩu đã đặt khi cài MySQL. Đây không phải mật khẩu Windows hay SQL Server.

**Kết quả:** kết nối thành công, mở được cửa sổ SQL Editor. Nếu quên mật khẩu, chưa thực hiện các bước tạo user; không thử đổi tài khoản hoặc cấu hình hệ thống tùy tiện.

## Bước 2 — Tạo database và tài khoản ứng dụng

Trong SQL Editor, thay `CHANGE_ME_STRONG_PASSWORD` bằng mật khẩu riêng rồi chạy từng câu bằng Ctrl+Enter:

```sql
CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'school_app'@'localhost'
  IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON school_management.* TO 'school_app'@'localhost';

SHOW DATABASES LIKE 'school_management';
```

**Kết quả:** thấy database school_management, user school_app được tạo. Tài khoản ứng dụng chỉ có quyền đọc/ghi dữ liệu trong database này; tạo bảng sau này dùng tài khoản quản trị.

Nếu user đã tồn tại, không chạy lại CREATE USER hoặc xóa user. Dùng user đã có và mật khẩu đúng, kiểm tra quyền trước khi tiếp tục. Không lưu mật khẩu thật vào file SQL trong Git.

## Bước 3 — Cài driver backend

Driver mysql2 đã được thêm vào package.json. Người tải project chạy tại gốc repository:

```powershell
cd backend
npm ci
npm ls mysql2
```

**Kết quả:** danh sách có mysql2, không báo thiếu gói. Khi khởi tạo, driver được cài bằng `npm install mysql2`; không cần cài lại bằng lệnh đó sau khi clone.

## Bước 4 — Điền backend/.env

Giữ nguyên PORT và CLIENT_ORIGIN, thêm các dòng sau. Không copy đè file .env đang có:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=school_app
DB_PASSWORD="mat_khau_da_dat_o_buoc_2"
DB_NAME=school_management
```

**Kết quả:** backend/.env có cấu hình thật; .env.example chỉ chứa giá trị mẫu. Đặt mật khẩu trong dấu nháy kép nếu có ký tự #. Không gửi mật khẩu qua chat, không đưa vào frontend.

## Bước 5 — Test kết nối

Trong terminal backend:

```powershell
npm run db:check
```

**Kết quả:** in `MySQL connection successful` và dữ liệu có `connected: 1`, `database_name: 'school_management'`.

Script chỉ chạy SELECT, không tạo hoặc sửa dữ liệu, tự đóng kết nối. Không cần khởi động frontend/backend HTTP để chạy script.

| Lỗi | Kiểm tra |
| --- | --- |
| Missing DB_... | Thêm biến tương ứng vào backend/.env |
| ECONNREFUSED | MySQL có chạy không, host và port đúng chưa |
| ER_ACCESS_DENIED_ERROR | Username, mật khẩu và host của tài khoản |
| ER_BAD_DB_ERROR | Đã tạo school_management chưa |
| ETIMEDOUT | Host, port và khả năng truy cập MySQL |

## Bước 6 — Chạy lại ứng dụng

Chạy backend và frontend như [start.md](../start.md). Health API vẫn chỉ kiểm tra HTTP server; kết nối database được kiểm tra riêng bằng db:check.

Cấu hình pool nằm ở backend/src/config/database.js. Các API nghiệp vụ sau này có thể gọi getPool().execute(...) để truy vấn; chưa thêm API hoặc bảng nghiệp vụ trong bước này.

Tài liệu driver: [MySQL2 Promise pool](https://sidorares.github.io/node-mysql2/docs/examples/connections/create-pool).
