import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Avatar, Alert, CircularProgress, InputAdornment, IconButton,
  useTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setError('Vui lòng điền đầy đủ tài khoản và mật khẩu!');

    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', {
        username,
        password
      });

      if (response.data?.access_token) {
        login(response.data.access_token, {
          username: response.data.username || username,
          role: response.data.role || 'operator'
        });
        window.location.href = '/vehicle-in';
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("https://mianco.com.vn/wp-content/uploads/2020/02/Background-login.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 32, 67, 0.5)', // Phủ lớp tối để làm nổi bật form kính
          zIndex: 1
        }
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          zIndex: 2,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.3)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <Avatar sx={{ m: 1, bgcolor: '#ffffff', width: 50, height: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <LockOutlinedIcon sx={{ color: '#0f2043', fontSize: 26 }} />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ fontWeight: 800, color: '#ffffff', mt: 1.5, letterSpacing: '0.5px', fontFamily: theme.typography.fontFamily }}>
            ĐĂNG NHẬP HỆ THỐNG
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 500 }}>
            Hệ thống quản lý & đối sánh xe ra vào
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: '8px' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>

            {/* INPUT USERNAME */}
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

            {/* INPUT PASSWORD */}
            <TextField
              required
              fullWidth
              label="Password" // Nhãn mặc định hiển thị bên trong ô nhập
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '8px' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.7)' },
                  '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '15px'
                },
                '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink': {
                  color: '#ffffff',
                  fontWeight: 'bold',
                  padding: '0 6px',
                  backgroundColor: '#27436b00',
                  borderRadius: '4px',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #1a1a1a2c inset !important', borderRadius: '8px',
                  WebkitTextFillColor: '#ffffff !important', // Giữ màu chữ trắng khi autofill
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            {/* NÚT ĐĂNG NHẬP */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                fontWeight: 700,
                height: 48,
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#0f2043 !important',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                letterSpacing: '0.5px',
                '&:hover': {
                  backgroundColor: 'rgba(223, 215, 215, 0.49)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG NHẬP'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}