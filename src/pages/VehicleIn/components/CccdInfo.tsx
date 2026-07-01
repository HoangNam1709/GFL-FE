import { Card, CardContent, Typography, Box, TextField, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid'; // Sử dụng Grid để phân bổ layout phẳng
import type { ChangeEvent } from 'react';
import type { XitecLog } from '../../../types/vehicle';

interface CccdInfoProps {
  data: XitecLog;
  onUpdateField: (field: keyof XitecLog, value: string) => void;
}

export default function CccdInfo({ data, onUpdateField }: CccdInfoProps) {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.background.paper, 
        border: `1px solid ${theme.palette.divider}`, 
        borderRadius: '8px', 
        height: '100%', 
        boxShadow: 'none',
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2.5 }}>
        {/* Tiêu đề nghiệp vụ */}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: theme.palette.primary.main, 
            fontWeight: 'bold', 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🪪 1. DỮ LIỆU OCR CCCD ĐỒNG BỘ
        </Typography>

        {/* Khối hiển thị ảnh chân dung */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            bgcolor: theme.palette.action.hover,
            borderRadius: '6px',
            p: 1.5,
            mb: 2.5,
            border: `1px dashed ${theme.palette.divider}`
          }}
        >
          <Box
            component="img"
            src={data.nationalIdImage}
            alt="Mat CCCD"
            sx={{
              width: '100%',
              maxWidth: 220,
              height: 140, // Tỷ lệ chuẩn của ảnh thẻ cắt từ CCCD
              borderRadius: '4px',
              objectFit: 'cover',
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>

        {/* Lưới nhập liệu thông tin phân tích hệ thống */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Số CCCD"
              variant="outlined"
              value={data.nationalId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateField('nationalId', e.target.value)}
              slotProps={{
                input: { 
                  sx: { 
                    fontWeight: '500',
                    bgcolor: theme.palette.action.hover
                  } 
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Ngày sinh"
              variant="outlined"
              value={data.birth || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateField('birth', e.target.value)}
              slotProps={{
                input: { 
                  sx: { bgcolor: theme.palette.action.hover } 
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="Họ và Tên tài xế"
              variant="outlined"
              value={data.driverName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateField('driverName', e.target.value.toUpperCase())}
              slotProps={{
                input: { 
                  sx: { 
                    color: theme.palette.primary.main, 
                    fontWeight: 'bold', 
                    bgcolor: theme.palette.action.hover 
                  } 
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="Nơi cấp / Nơi đăng ký thường trú"
              variant="outlined"
              multiline
              rows={2}
              value={data.place || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateField('place', e.target.value)}
              slotProps={{
                input: { 
                  sx: { bgcolor: theme.palette.action.hover } 
                }
              }}
            />
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}