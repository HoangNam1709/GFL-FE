
# 🚀 Hệ Thống Kiểm Soát Xe Ra Vào (KSXRV) - Phân Hệ Frontend Terminal

Phân hệ giao diện quản lý và đối soát thời gian thực dành cho trạm kiểm soát ra vào cảng/bến xe. Hệ thống tích hợp công nghệ nhận diện biển số (OCR), định danh thẻ căn cước công dân (CCCD), đối soát khuôn mặt bằng AI (Face Match) và quét mã vé (QR Code/Barcode) giúp tự động hóa quy trình xuất nhập bến.

---

## 🛠️ Công Nghệ Sử Dụng

* **Framework:** React.js (v18+) với TypeScript (Strict Mode)
* **Bundler:** Vite (Tối ưu hóa tốc độ Hot Reload)
* **UI Library:** Material-UI (MUI v6) & `@mui/icons-material`
* **HTTP Client:** Axios (Cấu hình Interceptors tập trung)
* **Định tuyến:** React Router DOM v6

---

## 📁 Cấu Trúc Thư Mục Chuẩn Hóa (Feature-Based)

Dự án được tổ chức theo cấu trúc module hóa, tách biệt rõ ràng giữa giao diện (UI) và tầng xử lý dữ liệu (Services):

```text
src/
├── assets/             # Tài nguyên tĩnh (Hình ảnh, logo Petrolimex/Skypec, icons...)
├── components/         # Toàn cục: Các UI Component dùng chung (CardTemplate, CustomButton...)
├── config/             # Cấu hình hệ thống trung tâm (Axios Instance, Interceptors)
│   └── axios.ts
├── constants/          # Hằng số cố định (Danh sách hãng xăng dầu, phân loại xe, mã cổng)
├── layouts/            # Khung giao diện chính (SecurityLayout gồm Sidebar, Header bốt bảo vệ)
├── pages/              # QUẢN LÝ CÁC MÀN HÌNH CHÍNH (UI/UX)
│   ├── Dashboard/      # Màn hình tổng quan, theo dõi mật độ xe
│   ├── VehicleIn/      # Màn hình Check-in (Quét CCCD, chọn Hãng vận tải)
│   ├── VehicleOut/     # Màn hình Check-out (Xử lý xe xuất bến)
│   └── HistoryLog/     # Màn hình Lịch sử đối soát (Phân hệ đã tối ưu)
│       ├── components/ # Các component con được tách nhỏ để trị
│       │   ├── VehicleGateInfo.tsx    # Khu vực 1: Giao diện ảnh camera OCR và cổng
│       │   ├── DriverIdentityInfo.tsx # Khu vực 2: Giao diện thông tin tài xế & AI Face
│       │   └── TicketMatchInfo.tsx    # Khu vực 3: Giao diện thông tin vé, QR & Barcode
│       ├── HistoryCard.tsx            # Component điều phối tổng quan Card & Dialog Popup
│       ├── types.ts                   # Type/Interface cục bộ của HistoryLog
│       └── index.tsx                  # Giao diện bộ lọc và danh sách lịch sử chính
├── routes/             # Cấu hình định tuyến đường dẫn (React Router)
├── services/           # TẦNG GỌI API (ỦY QUYỀN TỪ PAGES)
│   ├── historyService.ts # Quản lý gọi API lịch sử đối soát
│   └── vehicleService.ts
├── theme/              # Cấu hình cấu trúc màu sắc Dark/Light Mode của MUI Theme
├── types/              # Định nghĩa các kiểu dữ liệu toàn cục (Global Interfaces)
├── App.tsx             # Component gốc thiết lập Router & Theme Providers
└── main.tsx            # File entry point nạp React vào DOM
```


## 💻 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống

* Đã cài đặt **Node.js** (Khuyến nghị phiên bản LTS `v18` hoặc `v20` trở lên).
* Trình quản lý gói **npm** đi kèm.

### 2. Cấu hình biến môi trường (`Environment Variables`)

Hệ thống sử dụng cơ chế quản lý môi trường tích hợp sẵn của Vite. 

Bạn cần tạo một file tên là **`.env.development`** nằm tại **thư mục gốc** của dự án (ngang hàng với `package.json`) và cấu hình cổng chạy của Backend:

**Đoạn mã**

```
# URL kết nối đến API Gateway / Server Backend
VITE_API_BASE_URL=http://127.0.0.1:8000
```

*Lưu ý: Mọi biến môi trường trong Vite bắt buộc phải có tiền tố `VITE_` ở đầu.*

### 3. Các lệnh khởi chạy

Mở Terminal tại thư mục dự án và chạy chuỗi lệnh sau:

**Bash**

```
# 1. Cài đặt các thư viện phụ thuộc (Dependencies)
npm install

# 2. Khởi chạy dự án ở môi trường Phát triển (Development)
npm run dev
```

Sau khi Terminal hiển thị thông báo thành công, truy cập hệ thống qua địa chỉ local mặc định: `http://localhost:5173/`

## 🔄 Luồng Vận Hành Dữ Liệu Thực Tế (Data Flow)

1. **Trigger:** Bảo vệ thực hiện lọc dữ liệu hoặc tìm kiếm biển số xe tại `pages/HistoryLog/index.tsx`.
2. **Debounce:** Hệ thống delay `500ms` để gom hành vi gõ phím, tránh spam request.
3. **Service Call:** Page gọi hàm `historyService.getHistoryLogs(queryParams)`.
4. **Axios Central:** Lớp `config/axios.ts` tự động bắt lấy request, đính kèm `Authorization: Bearer [token]` lấy từ `localStorage` và gửi lên cổng `VITE_API_BASE_URL`.
5. **Interceptor Handling:** * Nếu thành công (`200 OK`), dữ liệu bóc tách gọn gàng gửi thẳng về giao diện.
   * Nếu thất bại (`401 Unauthorized`), interceptor tự động xóa token nhiễm độc và đá hướng người dùng về trang `/login`.

## 🛠️ Xử Lý Sự Cố Nhanh (Troubleshooting)

| **Lỗi gặp phải**                                          | **Nguyên nhân**                                                                    | **Cách khắc phục**                                                                                                                                                                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`ERR_CONNECTION_REFUSED`**hoặc lỗi kết nối mạng màu đỏ | Cấu hình sai cổng API hoặc chưa bật server Backend.                                  | 1. Kiểm tra file `.env.development`đã đúng cổng Backend chưa (Ví dụ:`8000`).``2. Đảm bảo server Backend đang chạy.``3. Tắt Frontend đi chạy lại lệnh `npm run dev`để nạp lại file `.env`. |
| Lỗi chữ hoa / chữ thường khi import component con             | Bộ nhớ đệm của Windows không phân biệt `VehicleGateInfo`và `vehicleGateInfo`. | 1. Đổi tên file tạm thời thành `abc.tsx`, sau đó đổi lại thành đúng chuẩn chữ viết hoa.``2. Nhấn `Ctrl + Shift + P`gõ `TypeScript: Restart TS Server`.                                                 |
| Lỗi `verbatimModuleSyntax`khi biên dịch                       | Ép kiểu nghiêm ngặt của TypeScript bắt phân biệt import Type và Data.             | Thêm từ khóa `type`khi import interface. Ví dụ:`import type { HistoryLogItem } from './types'`.                                                                                                                               |
