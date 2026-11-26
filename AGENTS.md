# AGENTS.md

## Bối cảnh

- Khi làm một chức năng đã có, tra mục lục `documentation/note/README.md` trước. Đối chiếu các file liên quan trực tiếp và cập nhật note khi hành vi thay đổi.

- Project I xây dựng website quản lý trường THPT. MVP có hai tác nhân là Admin và GVCN.
- Đọc `documentation/requirements.md` để hiểu nghiệp vụ và `.agents/progress.md` để xác định bước đang làm nếu file có trên máy.
- Khi đề cương, mã nguồn và tiến độ khác nhau, nêu khác biệt và bằng chứng. Phạm vi tác nhân MVP theo xác nhận của người học.

## Cách hướng dẫn

- Đọc thêm `.agents/rules.md` nếu có, gồm quy tắc CRUD và hộp thoại cho màn hình danh sách.

- Mặc định chỉ đọc và phân tích. Người học tự dán code vào VS Code.
- Mỗi lượt triển khai một bước nhỏ. Nêu mục tiêu, file cần tạo hoặc sửa, vị trí và trách nhiệm của từng file.
- Cung cấp code đầy đủ cho bước hiện tại. Giải thích đầu vào, đầu ra và luồng xử lý.
- Ghi rõ thư mục chạy lệnh, dữ liệu thử, kết quả mong đợi và cách nhận biết lỗi.
- Chờ người học xác nhận đã hiểu và chạy thành công trước khi chuyển bước.
- Chỉ sửa file hoặc chạy lệnh thay đổi dự án khi người học yêu cầu. Trước khi thêm thư viện, giải thích lý do và chờ người học đồng ý.
- Giữ các thay đổi đang làm dở của người học. Không tự commit, push, deploy hoặc reset dữ liệu.

## Kiến trúc

- Frontend dùng React và Vite. Backend dùng Express và truy cập MySQL qua `mysql2`.
- Tổ chức nghiệp vụ backend theo Route → Controller → Service → Repository. Dùng class khi cần đóng gói hành vi hoặc truyền dependency.
- Tách lớp gọi API và logic nghiệp vụ khỏi phần trình bày React. Ưu tiên UI tiếng Việt, tối giản, có phản hồi khi tải, lưu hoặc lỗi.
- Dùng truy vấn có tham số. Đọc thông tin kết nối từ biến môi trường. Giữ mật khẩu thật ngoài code và tài liệu.

## Bàn giao

- Ghi phần đã kiểm tra, bằng chứng, phần chưa xác minh và bước tiếp theo.
- Chỉ đánh dấu hoàn thành sau khi có kết quả kiểm thử.
