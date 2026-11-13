# Chạy và kiểm tra frontend

Điều kiện: đã hoàn thành [setup.md](./setup.md). Đây là kiểm tra thủ công, lint và build; project hiện chưa có script `npm test`.

## Bước 1 — Mở terminal

Trong VS Code chọn **Terminal → New Terminal**. Từ gốc project, chạy:

```powershell
cd frontend
```

Nếu terminal đã ở frontend thì bỏ qua lệnh cd.

**Kết quả cần đạt:** đường dẫn terminal kết thúc bằng `frontend`; chạy `dir` thấy `package.json`.

## Bước 2 — Khởi động server

```powershell
npm run dev
```

**Kết quả cần đạt:** terminal hiển thị địa chỉ Local, thường là `http://localhost:5173/`. Giữ terminal mở.

Nếu cổng bận, Vite có thể chọn cổng khác; dùng đúng địa chỉ terminal hiển thị.

## Bước 3 — Kiểm tra giao diện

Mở địa chỉ Local trong trình duyệt:

| Thao tác | Kết quả cần đạt |
| --- | --- |
| Mở trang | Thấy tiêu đề Get started, logo React/Vite và nút Count is 0 |
| Nhấn nút đếm 3 lần | Nút hiển thị Count is 3 |
| Tải lại trang | Trang vẫn mở được, bộ đếm về 0 vì chưa lưu dữ liệu |
| Nhấn F12 → Console | Không có lỗi JavaScript màu đỏ từ ứng dụng |

## Bước 4 — Kiểm tra cập nhật khi sửa mã

1. Mở `frontend/src/App.jsx`.
2. Đổi `<h1>Get started</h1>` thành `<h1>School Management System</h1>`.
3. Nhấn Ctrl+S rồi quan sát trình duyệt.
4. Sau khi thử, đổi tiêu đề về Get started và lưu để giữ giao diện mẫu.

**Kết quả cần đạt:** tiêu đề cập nhật sau khi lưu mà không cần tự khởi động lại server.

## Bước 5 — Kiểm tra lint và production build

Mở terminal thứ hai tại gốc project; giữ server ở terminal thứ nhất:

```powershell
cd frontend
npm run lint
npm run build
```

**Kết quả cần đạt:** cả hai lệnh kết thúc không lỗi; build báo `built in ...` và tạo `frontend/dist/`.

Tiếp tục trong terminal thứ hai:

```powershell
npm run preview
```

Mở địa chỉ hiển thị, thường là `http://localhost:4173/`, rồi thử nút đếm.

**Kết quả cần đạt:** bản build hiển thị và nút đếm hoạt động. Nếu sửa source, cần build lại để cập nhật preview. Preview chỉ dùng kiểm tra trên máy.

## Bước 6 — Dừng server

Nhấn Ctrl+C trong từng terminal đang chạy dev hoặc preview.

**Kết quả cần đạt:** terminal trở về dấu nhắc để nhập lệnh mới.

## Checklist hoàn thành

- [ ] Development server chạy được.
- [ ] Trang và ảnh hiển thị đầy đủ.
- [ ] Nút đếm hoạt động.
- [ ] Sửa và lưu tiêu đề làm giao diện cập nhật.
- [ ] Console không có lỗi ứng dụng.
- [ ] Lint và production build thành công.
- [ ] Preview của bản production hoạt động.
- [ ] Đã dừng các server sau khi kiểm tra.

Nếu gặp lỗi cài đặt, xem bảng lỗi trong [setup.md](./setup.md). Không cần chạy backend hoặc SQL Server cho các bước trên.
