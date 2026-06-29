import { useState } from 'react';
import { 
  Box, Card, CardContent, TextField, Button, Typography, 
  Avatar, Alert, CircularProgress, InputAdornment, IconButton 
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 1, mt: 1 }}>
            ĐĂNG NHẬP HỆ THỐNG
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hệ thống quản lý & đối sánh xe xitec
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Tài khoản (Username)"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
              disabled={loading}
              // FIX: Sử dụng cấu trúc slotProps chuẩn chỉnh thay cho InputProps đời cũ
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 1, fontWeight: 'bold', height: 48, color: '#fff !important' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG NHẬP'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}