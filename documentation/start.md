# Chạy và kiểm tra frontend

Phần đầu hướng dẫn frontend; phần Backend bên dưới hướng dẫn kiểm tra API riêng, chưa cần SQL Server.

Điều kiện: đã hoàn thành [setup_frontend.md](./setup/setup_frontend.md). Đây là kiểm tra thủ công, lint và build; project hiện chưa có script `npm test`.

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

Nếu gặp lỗi cài đặt, xem [setup_frontend.md](./setup/setup_frontend.md). Không cần chạy backend hoặc SQL Server cho các bước trên.

# Chạy và kiểm tra backend

Điều kiện: đã hoàn thành [setup_backend.md](./setup/setup_backend.md), có dependencies và `backend/.env`.

## Bước 1 — Kiểm tra công nghệ

Mở terminal tại gốc project:

```powershell
cd backend
node --version
npm --version
npm ls --depth=0
```

Nếu đã ở backend thì bỏ qua `cd backend`.

**Kết quả cần đạt:** có phiên bản Node/npm và các package sau, không báo thiếu gói:

| Công nghệ | Phiên bản đã kiểm tra | Vai trò |
| --- | --- | --- |
| Node.js | v24.19.0 | Chạy JavaScript backend và watch mode |
| npm | 11.17.0 | Quản lý dependencies và scripts |
| express | 5.3.0 | Tạo API và middleware |
| cors | 2.8.6 | Cấu hình quyền đọc API theo origin của trình duyệt |
| dotenv | 18.0.10 | Đọc cấu hình .env |

Source dùng JavaScript ES Modules. Không cần nodemon vì dùng watch mode của Node. Nếu thiếu dependencies, chạy `npm ci` trong backend.

## Bước 2 — Chạy backend

Kiểm tra `backend/.env`:

```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

Trong terminal backend:

```powershell
npm run dev
```

**Kết quả cần đạt:** thấy `School Management API is running at http://localhost:3000`. Giữ terminal mở.

Có thể dùng `npm start` để chạy thường thay cho dev. Không chạy cả hai cùng lúc trên cùng cổng.

## Bước 3 — Test health

Mở trình duyệt tới `http://localhost:3000/api/health`, hoặc dùng Postman: chọn GET, nhập URL và nhấn Send.

**Kết quả cần đạt:** HTTP 200 và JSON:

```json
{ "status": "ok", "message": "School Management API is running" }
```

Để xem HTTP status bằng PowerShell, mở terminal thứ hai:

```powershell
$response = Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/health
$response.StatusCode
$response.Content
```

**Kết quả cần đạt:** in ra 200 và JSON trên. Nếu PORT khác, thay 3000 trong các URL. Không cần chạy frontend cho bước này.

## Bước 4 — Test lỗi bằng Postman

| Thao tác | Kết quả cần đạt |
| --- | --- |
| GET `http://localhost:3000/api/khong-ton-tai` | HTTP 404, JSON có message `Route not found` |
| POST tới `http://localhost:3000/api/health`, Body → raw → JSON, nhập một dấu `{` rồi Send | HTTP 400, JSON có message `Invalid request` |

POST chỉ dùng thử middleware đọc JSON, không phải chức năng health. Health chỉ có GET. Truy cập `/` trả 404 là đúng vì chưa có trang chủ backend.

## Bước 5 — Test CORS

Trong terminal thứ hai:

```powershell
$response = Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/health -Headers @{ Origin = 'http://localhost:5173' }
$response.Headers['Access-Control-Allow-Origin']
```

**Kết quả cần đạt:** in ra `http://localhost:5173`, trùng CLIENT_ORIGIN. Nếu Vite chạy cổng khác, sửa CLIENT_ORIGIN và khởi động lại backend.

Để kiểm tra thực tế trên trình duyệt, mở frontend development, nhấn F12 → Console và tự nhập:

```javascript
fetch('http://localhost:3000/api/health')
  .then(response => response.json())
  .then(console.log)
  .catch(console.error)
```

**Kết quả cần đạt:** Console hiển thị object có status `ok`, không báo lỗi CORS. Không cần sửa source frontend.

CORS không chặn Postman/PowerShell gửi request; trình duyệt mới kiểm soát quyền đọc response.

## Bước 6 — Dừng và chạy lại

Nhấn Ctrl+C trong terminal backend. Lần sau chỉ cần vào backend và chạy `npm run dev`; không cần cài lại. Sau khi đổi .env, dừng và khởi động lại.

## Checklist backend

- [ ] Node/npm và ba package được nhận diện, không thiếu dependencies.
- [ ] Backend khởi động thành công.
- [ ] GET health trả 200 và JSON đúng.
- [ ] Route lạ trả 404.
- [ ] JSON sai trả 400.
- [ ] CORS trả origin đúng, frontend development đọc được API.
- [ ] Đã dừng server sau khi test.

Kiểm tra ngày 14/11/2026: package, health 200, JSON response, dotenv, CORS, route 404 và JSON sai 400 đều đạt bằng Node fetch/assert trên cổng tạm; server thử nghiệm đã đóng. Kiểm tra browser CORS ở trên dành cho người dùng thực hiện. Backend chưa có script npm test và chưa kết nối SQL Server.
