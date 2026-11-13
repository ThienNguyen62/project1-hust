# Cài đặt frontend lần đầu

Mục tiêu: cài React + Vite bằng JavaScript trong `frontend/`. Chưa cần backend hay SQL Server.

## Bước 1 — Cài công cụ trên máy mới (Windows)

Nếu đã có công cụ, kiểm tra phiên bản ở cuối bước này và bỏ qua phần cài tương ứng.

### 1.1. Cài Node.js và npm

1. Mở [trang tải Node.js chính thức](https://nodejs.org/en/download).
2. Chọn Node.js **24.x**, hệ điều hành **Windows**, bộ cài **Windows Installer (.msi)** phù hợp máy (thường là x64).
3. Chạy bộ cài, giữ thành phần **npm** và tùy chọn thêm vào **PATH**, hoàn tất cài đặt.
4. Đóng rồi mở lại terminal hoặc VS Code.

**Kết quả cần đạt:** chạy được `node --version` và `npm --version`. npm được cài cùng Node.js, không cần tải riêng. Xem thêm [hướng dẫn npm chính thức](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/).

### 1.2. Cài Git

1. Tải bộ cài từ [Git for Windows](https://git-scm.com/install/windows).
2. Chạy bộ cài; giữ tùy chọn cho phép dùng Git từ command line và các phần mềm khác.
3. Hoàn tất rồi mở lại terminal.

**Kết quả cần đạt:** chạy được `git --version`. Git dùng để clone và quản lý source code; không cần Git để chạy frontend nếu tải bằng ZIP.

### 1.3. Cài VS Code và chuẩn bị trình duyệt

1. Tải **Windows User Installer** từ [Visual Studio Code](https://code.visualstudio.com/docs/setup/windows).
2. Chạy bộ cài và bật **Add to PATH** nếu có; mở lại terminal sau khi cài.
3. Chuẩn bị trình duyệt như Edge, Chrome hoặc Firefox để mở ứng dụng.

**Kết quả cần đạt:** mở được VS Code và trình duyệt. Chạy `code --version` để kiểm tra lệnh VS Code; nếu lệnh chưa nhận, vẫn có thể mở project bằng **File → Open Folder**.

### 1.4. Kiểm tra tổng hợp

Mở PowerShell hoặc terminal VS Code:

```powershell
node --version
npm --version
git --version
```

**Kết quả cần đạt:** cả ba lệnh hiển thị phiên bản. Môi trường đã kiểm tra: Node.js `v24.19.0`, npm `11.17.0`, Git `2.51.2.windows.1`. Các số này là phiên bản đã kiểm tra, không bắt buộc npm/Git phải trùng chính xác.

Không cần cài Express, SQL Server, SSMS hoặc Postman để chạy frontend hiện tại. JavaScript, HTML và CSS không có bộ cài riêng cho project này.

## Bước 2 — Mở project

Nếu chưa có project, chạy:

```powershell
git clone https://github.com/ThienNguyen62/project1-hust.git
cd project1-hust
code .
```

Hoặc tải ZIP, giải nén rồi chọn **File → Open Folder** trong VS Code. Nếu đã mở project thì bỏ qua bước tải.

**Kết quả cần đạt:** mở đúng thư mục gốc có bố cục sau (tên thư mục gốc có thể khác):

```text
project1/
├── frontend/          # React + Vite
├── backend/           # Dành cho backend
├── database/          # Dành cho database
└── documentation/     # Tài liệu
```

Git không lưu thư mục rỗng nên backend/database có thể chưa xuất hiện sau khi clone; không ảnh hưởng frontend.

## Bước 3 — Cài dependencies

Chọn **Terminal → New Terminal** tại gốc project:

```powershell
cd frontend
npm ci
```

Nếu đường dẫn terminal đã kết thúc bằng `frontend`, chỉ chạy `npm ci`; không chạy `cd frontend` lần nữa để tránh tìm nhầm `frontend/frontend`.

**Kết quả cần đạt:** lệnh kết thúc không lỗi, có thư mục `frontend/node_modules/`.

`npm ci` cài theo `package-lock.json`, cần Internet khi tải gói chưa có cache. Chạy khi mới tải project hoặc dependencies thay đổi. Không cần tạo lại Vite hay cài Vite toàn cục.

### React và Vite được cài ở đâu?

Lệnh `npm ci` ở trên tự cài toàn bộ gói đã khai báo trong project:

| Gói | Vai trò |
| --- | --- |
| `react`, `react-dom` | Xây dựng và hiển thị giao diện React |
| `vite`, `@vitejs/plugin-react` | Chạy server phát triển và đóng gói React |
| `oxlint` | Kiểm tra mã nguồn |
| `@types/react`, `@types/react-dom` | Gợi ý mã trong trình soạn thảo; source vẫn là JavaScript |

Kiểm tra sau khi cài, ngay trong thư mục `frontend/`:

```powershell
npm ls --depth=0
```

**Kết quả cần đạt:** danh sách có React, React DOM, Vite và các gói trên, không báo thiếu dependencies.

Lệnh cài React riêng là `npm install react react-dom`, nhưng **người clone project này không cần chạy**, vì `npm ci` đã cài đúng phiên bản. Tương tự, không chạy lại `npm create vite` trong project đã có source.

## Bước 4 — Kiểm tra mã và build

Trong terminal đang ở `frontend/`, chạy lần lượt:

```powershell
npm run lint
npm run build
```

**Kết quả cần đạt:** lint không báo lỗi; build hiển thị `built in ...` và tạo `frontend/dist/`.

Hai lệnh này đã được kiểm tra thành công. Việc kiểm tra giao diện trên trình duyệt thực hiện ở bước tiếp theo.

## Bước 5 — Chạy thử

Làm theo [start.md](./start.md) để chạy server và kiểm tra giao diện.

**Kết quả cần đạt:** trang mẫu React/Vite mở được, nút đếm hoạt động và giao diện cập nhật khi sửa source.

## Các file cần biết

| File/thư mục trong frontend | Vai trò |
| --- | --- |
| `index.html` | Trang HTML đầu vào, chứa phần tử `#root` |
| `src/main.jsx` | Gắn React vào HTML và nạp App |
| `src/App.jsx` | Component giao diện chính, nơi bắt đầu sửa giao diện |
| `src/App.css`, `src/index.css` | CSS cho giao diện và CSS chung |
| `src/assets/` | Ảnh và SVG được import trong source |
| `public/` | Tài nguyên tĩnh được phục vụ trực tiếp |
| `package.json` | Dependencies và các lệnh npm |
| `package-lock.json` | Khóa phiên bản dependencies; cần commit |
| `vite.config.js` | Cấu hình Vite và plugin React |
| `.oxlintrc.json` | Cấu hình kiểm tra mã Oxlint |
| `node_modules/`, `dist/` | Dependencies và kết quả build; không commit |

Luồng mở trang: `index.html` → `src/main.jsx` → `src/App.jsx`. File `.jsx` là JavaScript có cú pháp viết giao diện; project không dùng TypeScript.

## Có cần .env không?

Hiện chưa cần. Khi kết nối API, có thể tạo `frontend/.env` với `VITE_API_URL` và đọc bằng `import.meta.env.VITE_API_URL`. Khởi động lại server sau khi sửa `.env`.

Không đặt mật khẩu database hoặc khóa bí mật trong frontend. Khi bắt đầu dùng cấu hình môi trường, thêm `.env.example` chứa giá trị mẫu.

## Lỗi thường gặp

| Lỗi | Cách xử lý | Kết quả cần đạt |
| --- | --- | --- |
| Không tìm thấy node/npm/git | Kiểm tra cài đặt và PATH, mở lại terminal | Hiển thị được phiên bản |
| Không tìm thấy package.json | Chuyển vào đúng `frontend/` | Chạy `dir` thấy package.json |
| ENOTCACHED do npm bật offline | Có mạng rồi chạy `npm ci --offline=false` | Cài dependencies thành công |
| PowerShell chặn npm.ps1 | Dùng `npm.cmd` thay `npm`, ví dụ `npm.cmd ci` | Chạy được lệnh, không đổi chính sách hệ thống |
| Không kết nối registry | Kiểm tra Internet và proxy rồi thử lại | Tải được dependencies |

Lần khởi tạo ban đầu gặp ENOTCACHED, sau đó tải dependencies thành công. Cache npm của phiên khởi tạo nằm trong repository; không sửa cấu hình npm toàn cục. Frontend đã được chuyển về đúng bố cục `frontend/`; backend và database giữ nguyên.
