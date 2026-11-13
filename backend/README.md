# School Management API

## 1. Cài đặt lần đầu

Cần Node.js 24 và npm. Từ thư mục gốc repository:

```powershell
cd backend
npm ci
Copy-Item .env.example .env
```

Nếu đã ở backend thì bỏ qua lệnh cd. Chỉ copy khi chưa có .env, không ghi đè cấu hình cá nhân.

Kết quả: có node_modules và .env chứa:

```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

## 2. Chạy

```powershell
npm run dev
```

Kết quả: API chạy ở http://localhost:3000. Node watch mode tự khởi động lại khi sửa source. Đổi .env thì dừng rồi chạy lại.

Chạy thông thường bằng `npm start`. Dừng bằng Ctrl+C. Không chạy dev và start cùng lúc trên cùng cổng.

## 3. Kiểm tra

Trong Postman hoặc trình duyệt, gửi GET tới http://localhost:3000/api/health.

Kết quả: HTTP 200 và JSON:

```json
{ "status": "ok", "message": "School Management API is running" }
```

Hoặc trong terminal thứ hai:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

Route không tồn tại trả 404 JSON, JSON request không hợp lệ trả 400, lỗi nội bộ trả 500 với thông báo chung.

CORS cho phép trình duyệt đọc API từ CLIENT_ORIGIN. Nếu Vite chạy cổng khác, sửa giá trị này và khởi động lại backend. CORS không phải authentication; Postman vẫn gọi được API.

## Cấu trúc

```text
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/health.routes.js
│   └── controllers/health.controller.js
├── .env                 # Cấu hình cá nhân, không commit
├── .env.example         # Cấu hình mẫu
├── package.json
└── package-lock.json
```

| Thành phần | Vai trò |
| --- | --- |
| app.js | Nạp môi trường, cấu hình Express, CORS, JSON, routes và lỗi |
| server.js | Đọc PORT và mở HTTP server |
| routes/ | Ghép phương thức HTTP và đường dẫn với controller |
| controllers/ | Xử lý request và tạo response |

Dependencies: express 5.3.0, cors 2.8.6, dotenv 18.0.10. Source sử dụng JavaScript ES Modules. Chưa kết nối SQL Server hoặc tạo authentication, nghiệp vụ học sinh.

## Nhật ký thiết lập và kiểm tra

- Kiểm tra repository, Node v24.19.0, npm 11.17.0; giữ nguyên frontend.
- Chạy npm init -y và npm install express@5 cors dotenv, kèm tùy chọn online, cache trong repository.
- npm pkg set tạo scripts; đối số type=module với --json gặp lỗi parse, đã sửa trực tiếp package.json thành ES Modules.
- Chuyển nội dung từ server/ sang backend/ theo yêu cầu, bỏ thư mục server rỗng.
- Chạy npm install --package-lock-only --offline --ignore-scripts để đồng bộ lockfile, audit báo 0 vulnerabilities.
- npm start khởi động thành công. Node fetch/assert kiểm tra: health 200 và JSON chính xác, CORS origin, preflight 204, route lạ 404, JSON sai 400 đều đạt.
- npm run dev ban đầu bị sandbox chặn tạo tiến trình con (spawn EPERM). Chạy ngoài giới hạn đó thành công; health trả 200 trong watch mode. Đã dừng server sau kiểm tra. Đây là giới hạn môi trường kiểm tra, không phải lỗi source.
- git check-ignore xác nhận .env và node_modules bị bỏ qua. Không sửa frontend, commit hoặc push.

Nếu cổng 3000 bận, dừng backend cũ của bạn hoặc đổi PORT trong .env; không tự dừng tiến trình không rõ nguồn gốc.
