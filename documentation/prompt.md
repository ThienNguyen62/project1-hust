Hãy tạo giao diện frontend cho trang chủ Dashboard của website quản lý trường THPT.

Trước khi làm
- Đọc AGENTS.md và các hướng dẫn trong repo.
- Kiểm tra cấu trúc frontend, framework, router, thư viện giao diện và cách tổ chức component hiện tại.
- Tận dụng công nghệ sẵn có. Không tự cài thư viện mới nếu chưa cần.
- Nếu cấu trúc dự án khác với giả định trong yêu cầu, hãy làm theo dự án hiện có và nêu ngắn gọn điều chỉnh đó.

Thiết kế cần có
- Trang chủ Dashboard bằng tiếng Việt, giao diện chỉn chu, có màu sắc và tạo cảm giác tích cực, phù hợp với website quản lý trường học.
- Thanh điều hướng dọc bên trái có thể thu gọn và mở rộng.
- Khi mở rộng, hiển thị icon và tên mục. Khi thu gọn, chỉ hiển thị icon và có tooltip hoặc cách nhận biết tên mục.
- Có mục “Trang chủ”.
- Có nhóm “Tác vụ” có thể mở rộng/thu gọn, bên trong gồm “Chức năng 1”, “Chức năng 2”, “Chức năng 3”, “Chức năng 4” và “Chức năng 5”.
- Có mục “Tiện ích”.
- Các mục chưa có chức năng thật thì chỉ cần hiển thị trang thông báo “Chức năng đang được phát triển” khi bấm vào. Không tạo dữ liệu hoặc nghiệp vụ giả.
- Trang chủ có tiêu đề chào mừng, lời giới thiệu ngắn tạo động lực và các khu vực trống hợp lý để sau này bổ sung số liệu, hoạt động gần đây hoặc thông báo từ API.
- Không hiển thị số liệu thống kê giả. Trạng thái trống phải nói rõ rằng hiện chưa có dữ liệu.
- Bố cục phải sử dụng tốt trên desktop và màn hình nhỏ. Trên màn hình nhỏ, thanh điều hướng có thể đóng/mở dễ thao tác.

Tổ chức code
- Tận dụng cấu trúc OOP/component của dự án để dễ bảo trì và mở rộng.
- Nếu dự án dùng React, chia giao diện thành các component có trách nhiệm rõ ràng, ví dụ `Sidebar`, `NavigationItem`, `DashboardLayout`, `HomePage` và `PlaceholderPage`. Đặt tên và vị trí file theo quy ước hiện tại của repo.
- Tách cấu hình các mục điều hướng khỏi phần render giao diện để sau này thêm hoặc đổi mục thuận tiện.
- Đóng gói trạng thái mở/thu gọn của sidebar và nhóm tác vụ ở nơi phù hợp. Tránh tạo class, abstraction hoặc component chỉ để làm code phức tạp hơn.
- Giữ nguyên quy ước định dạng, đặt tên, routing và style đang có.

Giới hạn phạm vi
- Chỉ chỉnh sửa frontend cần thiết để tạo Dashboard và điều hướng giữa các trang mẫu.
- Chưa làm đăng nhập, đăng xuất, phân quyền, backend, database, Prisma hay gọi API.
- Không thay đổi cấu hình dự án hoặc các chức năng không liên quan.
- Không tự thêm các mục menu khác ngoài “Trang chủ”, nhóm “Tác vụ” gồm 5 chức năng và “Tiện ích”.

Tiêu chí hoàn thành
- Dashboard mở được qua route phù hợp với router hiện có.
- Sidebar thu gọn/mở rộng được, nhóm Tác vụ mở/đóng được và các trang mẫu điều hướng được.
- Giao diện rõ ràng, đẹp, responsive, không tràn hoặc vỡ bố cục.
- Không có dữ liệu thống kê giả.
- Frontend chạy được bằng script hiện có trong `package.json`.

Sau khi làm
- Chạy lệnh kiểm tra phù hợp đã có sẵn trong dự án.
- Xem lại diff, bảo đảm mọi chỉnh sửa đều nằm trong phạm vi.
- Báo các file đã sửa, cách chạy giao diện và kết quả kiểm tra.