import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GppBadIcon from '@mui/icons-material/GppBad'; // Icon cảnh báo an ninh bảo mật

export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
        // Tự động đổi màu nền theo hệ thống (Dark/Light)
        bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#f8f9fa',
        color: theme.palette.text.primary,
      }}
    >
      {/* KHỐI ICON & MÃ LỖI 404 */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        <GppBadIcon 
          sx={{ 
            fontSize: 120, 
            color: 'error.main',
            opacity: 0.8 
          }} 
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', sm: '9rem' },
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.05em',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, #ff6b6b, #ff8787)' 
              : 'linear-gradient(45deg, #d32f2f, #ef5350)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Typography>
      </Box>

      {/* THÔNG BÁO LỖI */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 1, 
          textTransform: 'uppercase',
          fontFamily: '"Inter", "Roboto", sans-serif'
        }}
      >
        Không Tìm Thấy Trang Yêu Cầu
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: theme.palette.text.secondary, 
          maxWidth: 480, 
          mb: 4,
          fontFamily: '"Inter", "Roboto", sans-serif'
        }}
      >
        Đường dẫn bạn đang truy cập không tồn tại hoặc phân hệ an ninh này đã được thay đổi cấu trúc URL trên hệ thống terminal.
      </Typography>

      {/* NÚT QUAY LẠI TRANG CHỦ */}
      <Button
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/camera-overview')} // Điều hướng về trang tổng quan camera hoặc dashboard của bạn
        sx={{
          borderRadius: '8px',
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          }
        }}
      >
        Quay về Trang Chủ
      </Button>
    </Box>
  );
}