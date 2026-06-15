Cấu trúc thư mục:
src/
├── assets/             # Chứa tài nguyên tĩnh (Hình ảnh, logo Petrolimex/Skypec, icons...)
├── components/         # Các Component dùng chung, có tính tái sử dụng cao (Reusability)
│   ├── CardTemplate.tsx  # Component khung hình chữ nhật bo góc mô phỏng chiếc thẻ vật lý
│   └── CustomButton.tsx  # Nút bấm custom dựa trên Button của MUI
├── config/             # Cấu hình hệ thống (Biến môi trường, cấu hình Axios...)
├── constants/          # Định nghĩa các hằng số cố định (Danh sách hãng xăng dầu, các loại xe...)
├── layouts/            # Khung giao diện chính (MainLayout gồm Sidebar, Header, Bốt bảo vệ layout)
│   └── SecurityLayout.tsx
├── pages/              # Quản lý các màn hình/giao diện chính của ứng dụng
│   ├── Dashboard/      # Màn hình tổng quan, theo dõi lịch sử ra vào
│   ├── VehicleIn/      # Màn hình Check-in (Có Form quét CCCD, chọn Hãng)
│   └── VehicleOut/     # Màn hình Check-out (Chia 2 cột đối chiếu dữ liệu)
├── routes/             # Cấu hình định tuyến đường dẫn (React Router)
├── services/           # Nơi quản lý các hàm gọi API đến Backend
├── theme/              # Cấu hình giao diện, màu sắc chủ đạo của Material UI (MUI Theme)
│   └── index.ts
├── types/              # Nơi định nghĩa các kiểu dữ liệu (Interface/Type) của TypeScript
│   └── vehicle.ts      # Định nghĩa kiểu dữ liệu cho Xe, Tài xế, Lịch sử Log...
├── App.tsx             # Component gốc của ứng dụng
└── main.tsx            # File entry point để render React vào DOM


# 🚀 Hệ Thống Kiểm Soát Xe Ra Vào (KSXRV) - Frontend Terminal

Phân hệ giao diện quản lý và đối soát thời gian thực dành cho trạm kiểm soát ra vào cảng/bến xe. Hệ thống tích hợp công nghệ nhận diện biển số (OCR), định danh thẻ căn cước công dân (CCCD) và đối soát khuôn mặt bằng AI (Face Match), kết hợp quét mã vé (QR Code/Barcode) để tự động hóa quy trình xuất nhập bến.

---

## 🛠️ Công Nghệ Sử Dụng

* **Framework:** React.js (TypeScript)
* **Bundler:** Vite
* **UI Library:** Material-UI (MUI v5/v6)
* **Icons:** `@mui/icons-material`
* **State Management & HTTP Client:** Axios / React Context API

---

## 💻 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống

* Đã cài đặt **Node.js** (Khuyến nghị phiên bản LTS `v18` hoặc `v20` trở lên).
* Trình quản lý gói **npm** hoặc **yarn**.

### 2. Các bước cài đặt

Mở Terminal tại thư mục gốc của phân hệ `Frontend` và chạy các lệnh sau:

```bash
# 1. Cài đặt các thư viện phụ thuộc (Dependencies)
npm install

# 2. Khởi chạy dự án ở môi trường Phát triển (Development)
npm run dev
```
