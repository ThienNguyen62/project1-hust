# Note 5 · Khởi chạy, MySQL và dữ liệu mẫu

## Chạy và kiểm tra

- Từ root chạy `.\start.ps1`. Launcher kiểm tra MySQL, API và frontend trước khi mở web. `-NoBrowser` tắt mở trình duyệt. `-Seed` nạp seed. Server đã chạy có thể được dùng lại.
- Chạy thủ công trong hai terminal: ở `backend` chạy `npm.cmd start`; ở `frontend` chạy `npm.cmd run dev -- --port 5173 --strictPort`. Mặc định backend dùng 3000 và CORS cho `http://localhost:5173`.
- Backend chạy bằng `npm.cmd start` cần khởi động lại sau khi sửa server. Nếu API lớp hoặc học kỳ trả `404 Route not found` nhưng route đã có trong [app.js](../../backend/src/app.js), kiểm tra tiến trình cũ trước.
- Dùng `npm.cmd run db:check` trong backend để kiểm tra kết nối MySQL. Dùng `GET /api/academic-years` để kiểm tra dữ liệu mà màn hình năm học và lớp học phụ thuộc. Frontend có `npm.cmd run lint` và `npm.cmd run build`.

## Schema và seed

- [schema.sql](../../database/schema.sql) dựng schema mới. [setup-user.sql](../../database/setup-user.sql) cấp quyền cho tài khoản ứng dụng. Database cũ báo thiếu `NAM_HOC.GhiChu` thì áp dụng [migration 001](../../database/migrations/001_academic_year_note.sql) bằng tài khoản quản trị.
- `npm.cmd run db:seed` trong backend chạy [seed-database.js](../../backend/src/scripts/seed-database.js). Script đọc [seed.sql](../../database/seed.sql), tách theo dòng `-- seed:statement`, gửi từng câu trên cùng kết nối và rollback khi lỗi.
- Seed chạy theo thứ tự cha → con. Hiện năm học đã có được bỏ qua cùng học kỳ/lớp mẫu đi kèm. Khi thêm seed, đặt câu lệnh trước `COMMIT` và giữ dấu phân cách.
- Dùng seed trên database phát triển. Xóa hoặc sửa file seed chỉ ảnh hưởng các lần nạp sau. Bản ghi đã lưu vẫn nằm trong MySQL.
