import { Card, CardContent, Typography, Box, useTheme } from '@mui/material'; // 🌟 Import useTheme
import type { XitecLog } from '../../../types/vehicle';

interface CameraInfoProps {
  data: XitecLog;
}

export default function CameraInfo({ data }: CameraInfoProps) {
  const theme = useTheme(); // 🌟 Kích hoạt bộ theo dõi Theme động của hệ thống

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2, 
        width: '100%',
        height: '100%',
        alignItems: 'stretch' 
      }}
    >
      {/* CỘT 2: KHỐI ẢNH XE & BIỂN SỐ XE */}
      <Box
        sx={{
          flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 8px)' },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'auto', lg: '100%' } 
        }}
      >
        <Card 
          sx={{ 
            // 🌟 Thay đổi màu nền và màu viền động theo theme hệ thống
            bgcolor: theme.palette.customBg.card, 
            border: `1px solid ${theme.palette.customBg.border}`, 
            borderRadius: 2, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column' 
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Màu chữ tiêu đề ăn theo màu Primary (Cam đậm / Vàng cam) */}
            <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
              📸 2. ẢNH XE & BIỂN SỐ LPR
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mb: 2,
                // Giữ nền trắng chữ đen cho biển số dễ đọc, hoặc giảm nhẹ độ chói khi ở Light mode
                bgcolor: theme.palette.mode === 'dark' ? '#ffffff' : '#f0f0f0',
                color: '#000000',
                textAlign: 'center',
                py: 1,
                borderRadius: 1,
                fontWeight: 'bold',
                letterSpacing: 2,
                border: `2px solid ${theme.palette.customBg.border}`
              }}
            >
              {data.licensePlate}
            </Typography>

            <Box sx={{ mt: 1, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Màu chữ mô tả phụ ăn theo màu text phụ của theme */}
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 1 }}>
                Hình ảnh toàn cảnh phương tiện:
              </Typography>
              <Box
                component="img"
                src={data.licensePlateImage}
                alt="Toàn cảnh xe bồn"
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.customBg.border}`,
                  flexGrow: 1
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* CỘT 3: KHỐI ẢNH MẶT TÀI XẾ */}
      <Box
        sx={{
          flex: { xs: '1 1 100%', lg: '1 1 calc(50% - 8px)' },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'auto', lg: '100%' } 
        }}
      >
        <Card 
          sx={{ 
            // 🌟 Tương tự, đổi màu nền và màu viền động theo theme
            bgcolor: theme.palette.customBg.card, 
            border: `1px solid ${theme.palette.customBg.border}`, 
            borderRadius: 2, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column' 
          }}
        >
          <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', width: '100%', flex: 1 }}>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 3, textAlign: 'left' }}>
              👤 3. Ảnh mặt tài xế:
            </Typography>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Box
                component="img"
                src={data.driverFaceImage}
                alt="Khuôn mặt tài xế"
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 300,
                  objectFit: 'cover',
                  // Viền của ảnh sẽ đổi theo màu Primary động
                  border: `3px solid ${theme.palette.primary.main}`,
                  // Chỉ bật bóng đổ (glow) khi ở chế độ Dark mode để trông ngầu hơn, Light mode thì ẩn đi cho sạch
                  boxShadow: theme.palette.mode === 'dark' ? '0px 0px 15px rgba(255, 153, 0, 0.4)' : 'none',
                  borderRadius: 1
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}