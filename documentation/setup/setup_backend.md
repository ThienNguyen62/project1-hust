# Cài đặt và chạy backend lần đầu (Windows)

Mục tiêu: chạy API Node.js + Express trong `backend/`. Chưa cần SQL Server, SSMS hoặc chạy frontend để kiểm tra API health.

## Bước 1 — Cài công cụ trên máy

Nếu đã cài theo [setup_frontend.md](./setup_frontend.md), chỉ cần kiểm tra phiên bản, không cài lại.

### Node.js và npm

1. Mở [trang tải Node.js](https://nodejs.org/en/download).
2. Chọn **Node.js 24.x**, **Windows Installer (.msi)** phù hợp kiến trúc máy, thường là x64.
3. Chạy bộ cài, giữ thành phần npm và tùy chọn thêm vào PATH.
4. Hoàn tất cài đặt, đóng rồi mở lại VS Code/terminal.

**Kết quả cần đạt:** chạy được `node --version` và `npm --version`. npm đi kèm Node.js, không cần cài riêng.

### Git và VS Code

1. Tải và cài [Git for Windows](https://git-scm.com/install/windows), cho phép dùng Git từ command line.
2. Tải và cài [VS Code User Installer](https://code.visualstudio.com/docs/setup/windows), bật Add to PATH nếu có.
3. Mở lại terminal sau khi cài.

**Kết quả cần đạt:** mở được VS Code và chạy được các lệnh sau trong PowerShell:

```powershell
node --version
npm --version
git --version
```

Môi trường đã kiểm tra: Node.js `v24.19.0`, npm `11.17.0`, Git `2.51.2.windows.1`. npm và Git không cần trùng chính xác các số này.

## Bước 2 — Tải và mở project

Nếu chưa có project, mở terminal tại nơi muốn lưu rồi chạy:

```powershell
git clone https://github.com/ThienNguyen62/project1-hust.git
cd project1-hust
code .
```

Hoặc tải ZIP, giải nén và mở bằng **VS Code → File → Open Folder**. Nếu đã có project thì mở thư mục đó, không clone lại.

**Kết quả cần đạt:** VS Code hiển thị thư mục gốc chứa `frontend/`, `backend/`, `documentation/`.

## Bước 3 — Cài các package backend

Chọn **Terminal → New Terminal** tại gốc project:

```powershell
cd backend
npm ci
npm ls --depth=0
```

Nếu terminal đã ở `backend`, bỏ qua `cd backend`. Không chạy lệnh cài đặt ở `frontend`.

**Kết quả cần đạt:** có `backend/node_modules/`; danh sách package có:

| Package | Phiên bản đã kiểm tra | Vai trò |
| --- | --- | --- |
| express | 5.3.0 | Tạo HTTP API và middleware |
| cors | 2.8.6 | Cấu hình quyền truy cập API từ trình duyệt khác origin |
| dotenv | 18.0.10 | Đọc cấu hình từ file .env |

`npm ci` tự cài các package theo `package-lock.json`; cần Internet khi tải gói chưa có cache. Không cần cài Express toàn cục hoặc chạy lại `npm init`.

Lệnh cài package thủ công khi tạo một backend mới là `npm install express@5 cors dotenv`. Người clone project này chỉ cần `npm ci`, không cần chạy thêm lệnh đó.

## Bước 4 — Tạo cấu hình môi trường

Trong terminal đang ở `backend`, kiểm tra file trước:

```powershell
Test-Path .env
```

Nếu kết quả là `False`, tạo từ file mẫu:

```powershell
Copy-Item .env.example .env
```

Nếu là `True`, mở file có sẵn, không copy đè. Kiểm tra nội dung:

```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

**Kết quả cần đạt:** có file `backend/.env`, đúng tên `.env` (không phải `.env.txt`).

- PORT: cổng chạy backend.
- CLIENT_ORIGIN: địa chỉ frontend được trình duyệt cho phép đọc API; không thêm dấu `/` ở cuối.
- Nếu Vite chạy cổng khác, cập nhật CLIENT_ORIGIN theo địa chỉ thực tế.
- `.env` không commit; `.env.example` là cấu hình mẫu để chia sẻ.

## Bước 5 — Khởi động backend

Trong `backend/`, chạy:

```powershell
npm run dev
```

**Kết quả cần đạt:** terminal hiển thị:

```text
School Management API is running at http://localhost:3000
```

Giữ terminal mở. Node watch mode tự khởi động lại khi sửa source; sau khi sửa `.env`, dừng bằng Ctrl+C và chạy lại.

Để chạy thông thường, dùng `npm start` thay cho `npm run dev`. Không chạy cả hai cùng lúc trên cùng cổng.

## Bước 6 — Kiểm tra API

Mở trình duyệt tới `http://localhost:3000/api/health`, hoặc mở terminal thứ hai và chạy:

```powershell
$response = Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/health
$response.StatusCode
$response.Content
```

**Kết quả cần đạt:** HTTP `200` và nội dung:

```json
{ "status": "ok", "message": "School Management API is running" }
```

Có thể dùng Postman nếu đã cài: chọn GET, nhập URL trên và nhấn Send. Postman không bắt buộc cho bước này.

Mở `http://localhost:3000/api/khong-ton-tai` để thử route lạ.

**Kết quả cần đạt:** HTTP 404 và JSON có `message` là `Route not found`. Truy cập `/` cũng trả 404 vì đây là API, chưa có trang chủ backend.

## Bước 7 — Dừng và chạy lại lần sau

Nhấn Ctrl+C trong terminal đang chạy backend.

**Kết quả cần đạt:** terminal trở về dấu nhắc nhập lệnh.

Lần sau mở VS Code, từ gốc project chỉ cần:

```powershell
cd backend
npm run dev
```

Không cần cài lại Node.js hoặc dependencies. Chỉ chạy lại `npm ci` khi mới tải project, mất node_modules hoặc dependencies thay đổi.

## Cấu trúc source code

| File/thư mục trong backend | Vai trò |
| --- | --- |
| src/app.js | Nạp .env, cấu hình Express, JSON, CORS, routes và xử lý lỗi |
| src/server.js | Đọc PORT và khởi động HTTP server |
| src/routes/ | Định nghĩa phương thức HTTP và đường dẫn API |
| src/controllers/ | Xử lý request và trả response |
| package.json | Dependencies, ES Modules và scripts dev/start |
| package-lock.json | Khóa phiên bản dependencies; cần commit |
| .env.example | Cấu hình mẫu; cần commit |
| .env, node_modules/ | Cấu hình cá nhân và dependencies; không commit |

## Lỗi thường gặp

| Hiện tượng | Cách xử lý | Kết quả cần đạt |
| --- | --- | --- |
| Không tìm thấy node/npm/git | Kiểm tra cài đặt, PATH; mở lại terminal | Lệnh phiên bản chạy được |
| PowerShell chặn npm.ps1 | Dùng `npm.cmd ci` hoặc `npm.cmd run dev` | Chạy được, không cần đổi chính sách hệ thống |
| Không tìm thấy package.json | Chuyển vào backend; chạy `dir` để kiểm tra | Nhìn thấy package.json |
| Cannot find package express | Chạy `npm ci` trong backend | Cài đủ dependencies |
| ENOTCACHED do offline | Có mạng rồi chạy `npm ci --offline=false` | Cài dependencies thành công |
| EADDRINUSE / cổng 3000 bận | Dừng backend cũ của bạn, hoặc đổi PORT trong .env rồi chạy lại | Server mở được cổng đã chọn |
| Trình duyệt không kết nối được API | Kiểm tra server còn chạy và URL đúng PORT | Health trả 200 |
| Frontend báo CORS | Đặt CLIENT_ORIGIN trùng origin frontend, khởi động lại backend | Frontend đọc được response |

CORS chỉ kiểm soát quyền đọc response trong trình duyệt, không thay thế authentication. Chưa cần cài thư viện SQL Server hay tạo tài khoản database ở bước này.
