# Note 2 · F2.1 Quản lý năm học

**Điểm vào:** Tác vụ → Quản lý năm học, `#/tac-vu/1`.

## Theo luồng

1. [AcademicYearsPage.jsx](../../frontend/src/components/AcademicYearsPage.jsx) sinh mã từ năm bắt đầu, mở modal thêm/sửa/xóa, tính trạng thái theo ngày Việt Nam và lọc danh sách.
2. [academic-years.js](../../frontend/src/api/academic-years.js) gọi `GET/POST /api/academic-years` hoặc `PUT/DELETE /api/academic-years/:id`.
3. [Route](../../backend/src/routes/academic-year.routes.js) → [Controller](../../backend/src/controllers/academic-year.controller.js) → [Service](../../backend/src/services/academic-year.service.js) → [Repository](../../backend/src/repositories/academic-year.repository.js).
4. Repository thao tác bảng `NAM_HOC`, đọc số học kỳ từ `HOC_KY` và trả `id, code, startDate, endDate, note, semesterCount`. Ngày qua API ở dạng `YYYY-MM-DD`.

## Quy tắc và kiểm tra

- Service kiểm tra định dạng mã, ngày bắt đầu trước ngày kết thúc, ghi chú tối đa 500 ký tự. MySQL bảo đảm mã duy nhất.
- Khi tạo với `createSemesters: true`, lưu hai học kỳ chia gần đều khoảng ngày trong cùng giao dịch. Giao diện bật mặc định, API mặc định tắt khi không gửi trường này.
- Đã có học kỳ hoặc lớp thì vẫn sửa được mã và ghi chú, nhưng giữ nguyên khoảng ngày. Xóa năm học sẽ xóa học kỳ cùng giao dịch. Nếu lớp tham chiếu, rollback và trả `409`.
- Trạng thái theo ngày khác với cờ `HienHanh`. Schema đã có ràng buộc tối đa một năm hiện hành. UI và API đặt năm hiện hành chưa có.
- Thử tạo với tùy chọn học kỳ bật/tắt, mã trùng, ngày sai, sửa ghi chú rồi tải lại và xóa năm có lớp. Nếu gặp lỗi cột `GhiChu`, xem [Note 5](note5.md).
