import { createContext, useContext, useState, type ReactNode } from "react";

interface UserInfo {
  username: string;
  role: string;
  organizationId: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserInfo | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<UserInfo | null>(() => {
    const savedUser = localStorage.getItem("user_info");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // SỬA TẠI ĐÂY: Nhận userInfo là any để xử lý map dữ liệu từ Backend mock
  const login = (jwtToken: string, userInfo: any) => {
    // Tạo một object chuẩn theo đúng Interface UserInfo của Frontend
    console.log(">>> [DEBUG LOGIN] Cục userInfo gốc từ Backend:", userInfo);
    const normalizedUser: UserInfo = {
      username: userInfo.username || userInfo.email || "",
      role: userInfo.role || (userInfo.roles ? userInfo.roles[0] : "guard"),

      // CẦU NỐI: Nếu backend trả về org_id thì gán vào organizationId
      organizationId: userInfo.organizationId || userInfo.org_id || "",
    };

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user_info", JSON.stringify(normalizedUser));
    setToken(jwtToken);
    setUser(normalizedUser);
  };

  const logout = () => {
    // 1. Xóa key "token" tiêu chuẩn
    localStorage.removeItem("token");

    // 2. Xóa sạch các key liên quan đến hệ thống camera mà bạn đã liệt kê
    localStorage.removeItem("camera_token");
    localStorage.removeItem("dev-camera-token");
    localStorage.removeItem("theme_mode"); // Xóa nếu muốn reset giao diện khi logout
    // 4. Xóa thông tin user thông thường
    localStorage.removeItem("user_info");

    // 5. Xóa id_token gốc của Keycloak (nếu đăng nhập qua SSO) — chỉ dọn state
    // cục bộ ở đây. Việc đăng xuất KHỎI KEYCLOAK (RP-Initiated Logout) được
    // thực hiện riêng ở nơi gọi logout() (xem Sidebar.tsx: performFullLogout),
    // vì cần đọc giá trị này TRƯỚC khi xóa để redirect đúng.
    localStorage.removeItem("sso_id_token");

    // 6. Cập nhật State về null để ép React re-render, bảo vệ Private Route ngay lập tức
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
