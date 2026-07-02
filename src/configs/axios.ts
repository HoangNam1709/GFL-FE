// src/config/axios.ts
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
// 1. Xác định URL Backend dựa trên giá trị từ file .env.development
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 0, // Thời gian chờ tối đa là 10 giây
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. REQUEST INTERCEPTOR: Chạy TRƯỚC khi yêu cầu được gửi lên máy chủ
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token đăng nhập từ LocalStorage (nếu có) để chứng thực phiên làm việc
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      // Tự động đính kèm Token vào mọi request gửi đi
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. RESPONSE INTERCEPTOR: Chạy NGAY KHI nhận được dữ liệu phản hồi từ máy chủ về
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Nếu API thành công, trả thẳng dữ liệu về cho service dùng luôn
    return response;
  },
  (error) => {
    // Xử lý lỗi tập trung tại đây
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Lỗi hết hạn phiên làm việc hoặc chưa đăng nhập
          console.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token"); // Xóa token cũ nhiễm độc

          // Tránh lỗi redirect vòng lặp nếu đang ở sẵn trang login
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          break;

        case 403:
          // Lỗi không có quyền truy cập vào tính năng (Bảo vệ cấp cao hơn)
          console.error("Bạn không có quyền truy cập vào tài nguyên này.");
          break;

        case 500:
          // Lỗi hệ thống Backend bị sập hoặc crash code
          console.error("Lỗi hệ thống từ máy chủ (Internal Server Error).");
          break;

        default:
          console.error(
            `Lỗi hệ thống (${status}):`,
            error.response.data?.message || error.message,
          );
      }
    } else if (error.request) {
      // Lỗi mạng, không kết nối được tới Server Backend
      console.error(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng hoặc khởi chạy Backend.",
      );
    } else {
      console.error("Lỗi cấu hình Request:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // console.log("TOKEN =", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log(config.headers);

  return config;
});
