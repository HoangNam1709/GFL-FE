import { Card, CardContent, Typography, Box, TextField, useTheme } from '@mui/material'; // 🌟 Import useTheme
import type { ChangeEvent } from 'react';
import type { XitecLog } from '../../../types/vehicle';

interface CccdInfoProps {
  data: XitecLog;
  onUpdateField: (field: keyof XitecLog, value: string) => void;
}

export default function CccdInfo({ data, onUpdateField }: CccdInfoProps) {
  const theme = useTheme(); // 🌟 Kích hoạt bộ theo dõi Theme động của hệ thống

  return (
    <Card 
      sx={{ 
        // 🌟 Đồng bộ màu nền Card và viền động theo theme
        bgcolor: theme.palette.customBg.card, 
        border: `1px solid ${theme.palette.customBg.border}`, 
        borderRadius: 2, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
          🪪 1. DỮ LIỆU OCR CCCD
        </Typography>

        {/* Ảnh chân dung quét từ CCCD */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Ảnh mặt trên CCCD:
          </Typography>
          <Box
            component="img"
            src={data.nationalIdImage}
            alt="Mat CCCD"
            sx={{
              width: 250,
              height: 250,
              borderRadius: 1,
              objectFit: 'cover',
              border: `2px solid ${theme.palette.primary.main}`, // Viền đổi theo màu primary
            }}
          />
        </Box>

        {/* Ô NHẬP LIỆU: Số CCCD */}
        <TextField
          fullWidth
          label="Số CCCD"
          variant="outlined"
          value={data.nationalId}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateField('nationalId', e.target.value)}
          slotProps={{
            input: { 
              sx: { 
                // 🌟 Động hóa màu chữ và nền ô nhập
                color: theme.palette.text.primary, 
                bgcolor: theme.palette.mode === 'dark' ? '#222222' : '#f0f0f0' 
              } 
            },
            inputLabel: { 
              sx: { 
                color: theme.palette.primary.main,
                // Giúp màu label khi focus không bị lỗi màu trắng ở light mode
                '&.Mui-focused': { color: theme.palette.primary.main } 
              } 
            }
          }}
          sx={{ mb: 2 }}
        />

        {/* Ô NHẬP LIỆU: Họ và Tên tài xế */}
        <TextField
          fullWidth
          label="Họ và Tên tài xế"
          variant="outlined"
          value={data.driverName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateField('driverName', e.target.value.toUpperCase())}
          slotProps={{
            input: { 
              sx: { 
                color: theme.palette.primary.main, 
                fontWeight: 'bold', 
                bgcolor: theme.palette.mode === 'dark' ? '#222222' : '#f0f0f0' 
              } 
            },
            inputLabel: { 
              sx: { 
                color: theme.palette.primary.main,
                '&.Mui-focused': { color: theme.palette.primary.main }
              } 
            }
          }}
        />
      </CardContent>
    </Card>
  );
}