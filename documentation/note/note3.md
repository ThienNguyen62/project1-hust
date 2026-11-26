# Note 3 · F2.2 Quản lý học kỳ

**Điểm vào:** Quản lý năm học → nút **Học kỳ** trên dòng cần chỉnh.

## Theo luồng

- [Semesters.jsx](../../frontend/src/components/Semesters.jsx) khai báo các trường số học kỳ, bắt đầu và kết thúc. [SchoolRecords.jsx](../../frontend/src/components/SchoolRecords.jsx) xử lý modal, danh sách và tải lại sau CRUD.
- [school-records.js](../../frontend/src/api/school-records.js) gọi `GET/POST /api/academic-years/:yearId/semesters` và `PUT/DELETE` cùng đường dẫn có thêm `/:id`.
- [Router](../../backend/src/routes/school-record.routes.js) → [SemesterService](../../backend/src/services/semester.service.js) → [SemesterRepository](../../backend/src/repositories/semester.repository.js) → `NAM_HOC`, `HOC_KY`.
- Payload gồm `number` là số 1 hoặc 2 và `startDate, endDate` ở dạng `YYYY-MM-DD`. Danh sách trả thêm `id`, sắp theo số học kỳ. Khi đóng hộp thoại học kỳ, danh sách năm học tải lại số học kỳ.

## Quy tắc và kiểm tra

- Ngày bắt đầu có thể bằng ngày kết thúc. Toàn bộ khoảng ngày phải nằm trong năm học. Học kỳ I phải kết thúc trước ngày bắt đầu học kỳ II.
- MySQL bảo đảm duy nhất `(NamHocID, SoHocKy)`. Repository khóa dòng năm học bằng `FOR UPDATE` trong giao dịch để tránh hai phép ghi học kỳ đồng thời vượt qua kiểm tra.
- Thử sửa học kỳ tự tạo, thêm số trùng, nhập ngày nằm ngoài năm học và hai khoảng chạm cùng một ngày. Lỗi nhập hoặc ngoài năm trả `400`. Trùng hoặc sai thứ tự khoảng trả `409`.
- Nếu bổ sung ràng buộc từ điểm danh hoặc báo cáo, kiểm tra lại tác động của đổi ngày và xóa học kỳ. Hiện các chức năng đó chưa nối vào luồng này.
