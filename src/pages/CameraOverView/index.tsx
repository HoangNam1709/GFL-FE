import { Box, Typography, Card, CardContent, Grid, useTheme, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';

// Giả lập danh sách 6 Camera tương ứng với các làn/cổng vào
const CAMERA_LIST = [
  { id: 'gate-1', name: 'Camera Cổng Vào Làn 01', streamUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=500' },
  { id: 'gate-2', name: 'Camera Cổng Vào Làn 02', streamUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=500' },
  { id: 'gate-3', name: 'Camera Cổng Vào Làn 03', streamUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=500' },
  { id: 'gate-4', name: 'Camera Khu Vực Hậu Cần 01', streamUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500' },
  { id: 'gate-5', name: 'Camera Bãi Đỗ Xe Xitéc A', streamUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=500' },
  { id: 'gate-6', name: 'Camera Bãi Đỗ Xe Xitéc B', streamUrl: 'https://images.unsplash.com/photo-1516594709406-e8a17a1537e6?q=80&w=500' },
];

export default function CameraOverviewPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSelectCamera = (gateId: string) => {
    console.log(`Đang truy cập giám sát chi tiết cổng: ${gateId}`);
    // Điều hướng sang màn hình thêm CCCD và xử lý OCR của bạn
    // Bạn có thể truyền kèm state nếu muốn trang sau biết đang xử lý cổng nào
    navigate('/vehicle-in', { state: { gateId } });
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Tiêu đề trang tổng quan */}
      <Box sx={{ mb: 4, pb: 1, borderBottom: `2px solid ${theme.palette.customBg.border}` }}>
        <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideocamIcon /> TRUNG TÂM GIÁM SÁT STREAM CAMERA REAL-TIME
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          Chọn một luồng Camera bất kỳ để tiến hành kiểm soát vào ra và quét OCR CCCD của tài xế.
        </Typography>
      </Box>

      {/* Lưới hiển thị 6 Camera */}
      <Grid container spacing={3}>
        {CAMERA_LIST.map((cam) => (
          // Màn hình lớn (md trở lên) chia 3 cột (12/4 = 3 cột), màn hình nhỏ chia 1 hoặc 2 cột
          <Grid size={{ xs: 12, md: 6, sm: 4 }} key={cam.id}>
            <Card 
              sx={{ 
                bgcolor: theme.palette.customBg.card,
                border: `1px solid ${theme.palette.customBg.border}`,
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0px 4px 20px ${theme.palette.mode === 'dark' ? 'rgba(255,153,0,0.15)' : 'rgba(0,0,0,0.1)'}`
                }
              }}
            >
              {/* Thẻ CardActionArea tạo hiệu ứng gợn sóng khi click giống một nút bấm lớn */}
              <CardActionArea onClick={() => handleSelectCamera(cam.id)}>
                
                {/* Giả lập Stream Live Camera bằng thẻ ảnh */}
                <Box 
                  component="img"
                  src={cam.streamUrl}
                  alt={cam.name}
                  sx={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    backgroundColor: '#000',
                    display: 'block'
                  }}
                />

                {/* Thanh trạng thái dưới chân camera */}
                <CardContent sx={{ p: 1.5, bgcolor: theme.palette.mode === 'dark' ? '#222' : '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {cam.name}
                  </Typography>
                  
                  {/* Chấm tròn báo trạng thái Live đang hoạt động */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#4caf50',
                        animation: 'pulse 1.5s infinite alternate',
                        '@keyframes pulse': {
                          '0%': { opacity: 0.4 },
                          '100%': { opacity: 1 }
                        }
                      }} 
                    />
                    <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: '10px' }}>
                      LIVE
                    </Typography>
                  </Box>
                </CardContent>

              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}