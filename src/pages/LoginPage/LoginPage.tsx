import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password)
      return setError("Vui lòng điền đầy đủ tài khoản và mật khẩu!");

    try {
      setError(null);
      setLoading(true);

      // Sử dụng axios thuần, hoàn toàn cô lập với mọi interceptor hệ thống
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/dev-login",
        {
          username,
          password,
        },
      );

      console.log(">>> [DEBUG API LOGIN] Response từ Backend:", response.data);

      if (response.data?.access_token) {
        const apiUser = response.data.user;
        const apiCamera = response.data.camera;

        // 1. Lưu thông tin User vào Context & Local Storage (Ứng dụng token thông thường)
        login(response.data.access_token, {
          username: apiUser?.username || apiUser?.email || username,
          role: apiUser?.roles ? apiUser.roles[0] : "guard",
          organizationId: apiUser?.organization_id || "",
        });

        // 2. CÔ LẬP CAMERA TOKEN: Lưu riêng biệt hoàn toàn để dùng cho bốt xe
        if (apiCamera?.camera_token) {
          localStorage.setItem("camera_token", apiCamera.camera_token);
        } else {
          console.warn(
            "⚠️ Không tìm thấy camera_token trong phản hồi của Backend!",
          );
        }

        // Chuyển hướng sang trang nghiệp vụ bốt xe
        window.location.href = "/vehicle-in";
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : detail?.message || "Đăng nhập thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: 2,
      }}
    >
      <Card
        sx={{ maxWidth: 400, width: "100%", boxShadow: 4, borderRadius: 2 }}
      >
        <CardContent
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 1, mt: 1 }}
          >
            ĐĂNG NHẬP HỆ THỐNG
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 500 }}>
            Hệ thống quản lý & đối sánh xe ra vào
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              required
              fullWidth
              label="Username" // Nhãn mặc định hiển thị bên trong ô nhập
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              variant="outlined"
              sx={{
                // Thiết lập màu chữ và khung viền bao quanh
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff', // Chữ gõ vào hiển thị màu trắng rõ nét trên nền tối
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '8px' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.7)' },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                },
                // Thiết lập hiệu ứng chuyển động cho Nhãn (Label)
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '15px'
                },
                // Khi click vào (Focus) hoặc khi có text (Shrink), nhãn tự nảy lên trên viền
                '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink': {
                  color: '#ffffff',
                  fontWeight: 'bold',
                  padding: '0 6px',
                  // Tạo nền mờ tối ngay dưới chữ nhãn để không bị đường viền đâm xuyên qua chữ
                  backgroundColor: '#27436b00',
                  borderRadius: '4px',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #1a1a1a2c inset !important',borderRadius: '8px', // Thay #1a1a1a bằng màu nền card/form login của bạn
                  WebkitTextFillColor: '#ffffff !important', // Giữ màu chữ trắng khi autofill
                  transition: 'background-color 5000s ease-in-out 0s',
                },
                marginBottom: '10px',
              }}
            />

            <TextField
              required
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 1,
                fontWeight: "bold",
                height: 48,
                color: "#fff !important",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ĐĂNG NHẬP"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
