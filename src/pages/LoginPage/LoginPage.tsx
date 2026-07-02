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
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

export default function LoginPage() {
  const theme = useTheme();
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

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/dev-login`,
        { username, password }
      );

      if (response.data?.access_token) {
        const apiUser = response.data.user;
        const apiCamera = response.data.camera;

        login(response.data.access_token, {
          username: apiUser?.username || apiUser?.email || username,
          role: apiUser?.roles ? apiUser.roles[0] : "guard",
          organizationId: apiUser?.organization_id || "",
        });

        if (apiCamera?.camera_token) {
          localStorage.setItem("camera_token", apiCamera.camera_token);
        }

        window.location.href = "/vehicle-in";
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : detail?.message || "Đăng nhập thất bại");
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
        p: 2,
        // 🌟 GIỮ LẠI ẢNH NỀN CỦA BẠN TẠI ĐÂY
        backgroundImage: 'url("https://mianco.com.vn/wp-content/uploads/2020/02/Background-login-1024x547.jpg")', // Thay đường dẫn ảnh của bạn vào đây
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card
        sx={{ 
          maxWidth: 400, 
          width: "100%", 
          boxShadow: 8, 
          borderRadius: 3,
          // Bọc nền Card màu tối và hơi trong suốt (mờ mờ) để nhìn xuyên thấu ra ảnh nền phía sau rất đẹp
          bgcolor: "rgba(26, 26, 26, 0.26)", 
          backdropFilter: "blur(8px)", // Tạo hiệu ứng kính mờ (Glassmorphism)
          border: `1px solid rgba(255, 255, 255, 0.1)`,
        }}
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
            <LockOutlinedIcon sx={{ fontSize: 32, color: "#ffffff" }} />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            sx={{ 
              fontWeight: 800, 
              mb: 1, 
              mt: 1.5, 
              color: "#ffffff",
              letterSpacing: "0.5px",
              fontFamily: theme.typography.fontFamily
            }}
          >
            ĐĂNG NHẬP HỆ THỐNG
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "rgba(255, 255, 255, 0.6)", fontWeight: 500 }}>
            Hệ thống quản lý & đối sánh xe ra vào
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3, borderRadius: "8px" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              required
              fullWidth
              label="Username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              variant="outlined"
              sx={{
                marginBottom: "20px",
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)", borderRadius: "8px" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.6)" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "15px"
                },
                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
                // 🌟 FIX AUTOFILL: Đổ bóng khớp với màu đặc của ruột Card (#1a1a1a) để nuốt chửng màu trắng của Chrome
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #1a1a1a11 inset !important",
                  WebkitTextFillColor: "#ffffff !important",
                  transition: "background-color 5000s ease-in-out 0s",
                  borderRadius: "8px",
                },
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
              variant="outlined"
              sx={{
                marginBottom: "15px",
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)", borderRadius: "8px" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.6)" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "15px"
                },
                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px #1a1a1a11 inset !important",
                  WebkitTextFillColor: "#ffffff !important",
                  transition: "background-color 5000s ease-in-out 0s",
                  borderRadius: "8px",
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
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
                borderRadius: "8px",
                color: "#fff !important",
                fontSize: "16px",
                letterSpacing: "0.5px"
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