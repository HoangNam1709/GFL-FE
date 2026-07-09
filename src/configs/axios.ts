// src/config/axios.ts

import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 0,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken =
      localStorage.getItem("access_token") || localStorage.getItem("token");

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Chỉ gọi hàm này khi chắc chắn cần logout thật sự
const forceLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token");
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Không thể kết nối tới Backend.");
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Không refresh với chính API refresh hoặc đã retry rồi
    if (
      status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      switch (status) {
        case 403:
          console.error("Bạn không có quyền truy cập.");
          break;
        case 500:
          console.error("Lỗi máy chủ.");
          break;
        case 401:
          // 401 sau khi đã retry → access token thật sự không dùng được
          // Nếu đây là từ /auth/refresh → logout
          // Nếu là retry request gốc thất bại → trả lỗi về caller, KHÔNG logout
          if (originalRequest.url?.includes("/auth/refresh")) {
            forceLogout();
          }
          break;
        default:
          console.error(
            `API Error (${status})`,
            error.response.data?.detail ||
              error.response.data?.message ||
              error.message,
          );
      }
      return Promise.reject(error);
    }

    // Đang refresh → đưa vào hàng chờ
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        // Không có refresh token → trả lỗi về caller hiển thị toast
        // KHÔNG redirect login — có thể user chưa login lần nào hoặc token chưa được lưu
        isRefreshing = false;
        processQueue(error);
        return Promise.reject(error);
      }

      const form = new FormData();
      form.append("refresh_token", refreshToken);

      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/refresh`,
        form,
      );

      const { access_token, refresh_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;

      processQueue(null, access_token);

      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return axiosInstance(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError);

      // Chỉ logout khi server xác nhận token thật sự không hợp lệ (401/403)
      // Không logout khi lỗi network, timeout, server 500...
      const refreshStatus = refreshError?.response?.status;
      if (refreshStatus === 401 || refreshStatus === 403) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
