import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid'; // Sử dụng Grid thay cho Flex wrap thủ công để chuẩn hóa layout
import type { XitecLog } from '../../../types/vehicle';
import { alpha } from '@mui/material/styles';

interface CameraInfoProps {
  data: XitecLog;
}

export default function CameraInfo({ data }: CameraInfoProps) {
  const theme = useTheme();

  return (
    <Grid container spacing={2.5} sx={{ height: '100%', alignItems: 'stretch' }}>

      {/* KHỐI 2: ẢNH XE & BIỂN SỐ LPR */}
      <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex' }}>
        <Card
          sx={{
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            boxShadow: 'none',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
              📸 2. DỮ LIỆU CAMERA & BIỂN SỐ LPR
            </Typography>

            {/* Giả lập biển số xe chuẩn phản quang Enterprise */}
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
                color: theme.palette.mode === 'dark' ? '#38bdf8' : '#0369a1', // Màu xanh LPR chuyên dụng
                textAlign: 'center',
                py: 1,
                borderRadius: '6px',
                fontWeight: 800,
                letterSpacing: 3,
                border: `1px solid ${theme.palette.divider}`,
                fontFamily: '"Roboto Mono", monospace',
                boxShadow: `inset 0px 2px 4px ${theme.palette.action.hover}`
              }}
            >
              {data.licensePlate}
            </Typography>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 1, fontWeight: '500' }}>
                Hình ảnh toàn cảnh phương tiện từ camera bốt:
              </Typography>
              <Box
                component="img"
                src={data.licensePlateImage}
                alt="Toan canh phuong tien"
                sx={{
                  width: '100%',
                  height: 200, // Thu nhỏ chiều cao dọc để vừa vặn viewport điều khiển không cần cuộn
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: `1px solid ${theme.palette.divider}`,
                  flexGrow: 1
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* KHỐI 3: KHỐI NHẬN DIỆN KHUÔN MẶT CẬP BỐT */}
      <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex' }}>
        <Card
          sx={{
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            boxShadow: 'none',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
              👤 3. NHẬN DIỆN MẶT TÀI XẾ (LIVE)
            </Typography>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 1, fontWeight: '500' }}>
                Khuôn mặt chụp thực tế tại làn vào:
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.action.hover,
                  borderRadius: '4px',
                  border: `1px solid ${theme.palette.divider}`,
                  p: 2
                }}
              >
                <Box
                  component="img"
                  src={data.driverFaceImage}
                  alt="Khuon mat live"
                  sx={{
                    width: '100%',
                    maxWidth: 180,
                    height: 180, // Khóa cố định khung tỉ lệ 1:1 cho ảnh chân dung thực tế
                    objectFit: 'cover',
                    borderRadius: '50%', // Chuyển sang dạng hình tròn (Avatar profile) chuẩn xác thực sinh trắc học
                    border: `2px solid ${theme.palette.primary.main}`,
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0px 0px 12px ${alpha(theme.palette.primary.main, 0.4)}`
                      : 'none',
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}