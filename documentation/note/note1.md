# Note 1 · Kiến trúc và điểm vào

## Luồng chung

React/Vite → lớp gọi Fetch → Express → handler HTTP → Service → Repository → MySQL qua pool mysql2 → JSON → cập nhật React.

- [navigation.js](../../frontend/src/navigation.js) khai báo menu và URL hash. [App.jsx](../../frontend/src/App.jsx) đọc hash và chọn màn hình.
- [app.js](../../backend/src/app.js) đăng ký CORS, JSON và route dưới `/api`. [server.js](../../backend/src/server.js) lắng nghe cổng backend.
- Năm học có Controller riêng. Học kỳ và lớp dùng handler HTTP trong [school-record.routes.js](../../backend/src/routes/school-record.routes.js). Router này chuẩn hóa ID dương và chuyển lỗi nghiệp vụ thành HTTP với JSON `{ message }`.
- [database.js](../../backend/src/config/database.js) khởi tạo pool khi truy vấn lần đầu. `GET /api/health` kiểm tra HTTP và có thể thành công dù DB chưa sẵn sàng.

## Phạm vi hiện tại

- MySQL là database đang kết nối. SQL Server từng được nhắc trong yêu cầu, nhưng repo chưa có driver hoặc Repository SQL Server.
- MVP dự kiến Admin và GVCN. Schema có danh mục vai trò. API hiện chưa xác thực hoặc phân quyền.
- Học sinh, xếp lớp, GVCN, điểm danh và báo cáo mới có thiết kế hoặc bảng nền. Các màn hình chưa triển khai dùng phần giữ chỗ.
- Khi thêm màn hình quản lý, kiểm tra khả năng dùng lại [SchoolRecords.jsx](../../frontend/src/components/SchoolRecords.jsx) cho danh sách, modal và tải lại sau CRUD. Đặt kiểm tra nghiệp vụ ở Service, truy vấn có tham số ở Repository và các ràng buộc dữ liệu ở schema.
