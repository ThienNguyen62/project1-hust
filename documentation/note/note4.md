# Note 4 · F2.3 Quản lý lớp học

**Điểm vào:** Tác vụ → Quản lý lớp học, `#/tac-vu/2`.

## Theo luồng

1. [ClassroomsPage.jsx](../../frontend/src/components/ClassroomsPage.jsx) lấy danh sách năm học rồi chọn năm đầu tiên API trả về. Trang hiển thị thống kê theo năm, tìm mã/tên không phân biệt hoa thường và lọc khối 10–12 trên dữ liệu đã tải.
2. [SchoolRecords.jsx](../../frontend/src/components/SchoolRecords.jsx) hiển thị bảng, phân trang 4 lớp/trang và modal CRUD. [ClassroomsPage.css](../../frontend/src/components/ClassroomsPage.css) định dạng riêng màn hình lớp. Năm học trong modal lấy từ bộ lọc; thao tác sửa giữ năm học gốc.
3. [school-records.js](../../frontend/src/api/school-records.js) gọi `GET/POST /api/academic-years/:yearId/classes` hoặc `PUT/DELETE` cùng đường dẫn có thêm `/:id`. Payload ghi gồm `code, name, grade`, trong đó `grade` là số. Danh sách trả thêm `id`.
4. [Router](../../backend/src/routes/school-record.routes.js) → [ClassroomService](../../backend/src/services/classroom.service.js) → [ClassroomRepository](../../backend/src/repositories/classroom.repository.js) → `LOP_HOC`.

## Quy tắc và kiểm tra

- Mã và tên được trim, tối đa 20 và 60 ký tự. MySQL bảo đảm duy nhất `(NamHocID, MaLop)`. CRUD giới hạn theo năm học trong URL.
- Khi xóa, khóa ngoại từ xếp lớp, phân công và buổi điểm danh bảo vệ lớp. API trả `409` nếu đã có dữ liệu tham chiếu.
- Quy ước đề xuất là `<Khối><Chữ in hoa><Số thứ tự>`, ví dụ `10A1`. Code hiện chưa ép định dạng, chưa tự viết hoa hay so tiền tố với khối. Seed cũ có mã `10-MAU`. Nếu áp chuẩn, cần xét dữ liệu cũ và giữ `LopHocID` để bảo toàn quan hệ.
- Sĩ số và GVCN hiện hiển thị `—`. Khi kết nối hai nghiệp vụ này, trả dữ liệu từ API và thay cột tương ứng ở `ClassroomsPage.jsx`.
- Seed năm `2030-2031` có 24 lớp, mỗi khối 8 lớp. Năm `2029-2030` có ca `12A1` được buổi điểm danh mẫu tham chiếu nếu năm được tạo từ seed. Thử tìm theo mã/tên, lọc, phân trang, tạo mã trùng cùng năm và xóa lớp có liên kết.
