# Thiết lập MySQL

Project dùng MySQL để lưu dữ liệu. Frontend gọi API Express, còn backend kết nối MySQL qua `mysql2`.

Làm theo [hướng dẫn chuẩn bị MySQL sau khi clone](../../database/README.md) để mở Workbench, chạy các file SQL, cấu hình `backend/.env` và kiểm tra kết nối bằng `npm run db:check`.

Sau khi kiểm tra kết nối thành công, [chạy frontend và backend](../start.md) như bình thường. API `/api/health` kiểm tra HTTP server. Lệnh `npm run db:check` kiểm tra kết nối tới MySQL.
