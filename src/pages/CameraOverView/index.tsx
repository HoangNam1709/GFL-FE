// src/pages/CameraOverview/index.tsx

import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  useTheme, 
  CardActionArea, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

// 🌟 Cập nhật Interface: Thêm thuộc tính phân loại loại cổng 'IN' hoặc 'OUT'
interface CameraItem {
  id: string;
  name: string;
  airport: 'HAN' | 'SGN' | 'DAD' | 'CXR' | 'HPH' | 'PQC';
  type: 'IN' | 'OUT'; // 🌟 'IN' là Cổng Vào, 'OUT' là Cổng Ra
  streamUrl: string;
}

// 🌟 Cập nhật danh sách Camera phân định rõ ràng cổng vào / cổng ra cho từng Sân bay
const CAMERA_LIST: CameraItem[] = [
  // Sân bay Nội Bài - HAN
  { id: 'han-in-1', name: 'HAN - Cổng Vào Làn 01', airport: 'HAN', type: 'IN', streamUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=500' },
  { id: 'han-in-2', name: 'HAN - Cổng Vào Làn 02', airport: 'HAN', type: 'IN', streamUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500' },
  { id: 'han-in-3', name: 'HAN - Cổng Vào Làn 03', airport: 'HAN', type: 'IN', streamUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=500' },
  { id: 'han-out-1', name: 'HAN - Cổng Ra Làn 01', airport: 'HAN', type: 'OUT', streamUrl: 'https://images.unsplash.com/photo-1516594709406-e8a17a1537e6?q=80&w=500' },
  { id: 'han-out-2', name: 'HAN - Cổng Ra Làn 02', airport: 'HAN', type: 'OUT', streamUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=500' },
  { id: 'han-out-3', name: 'HAN - Cổng Ra Làn 03', airport: 'HAN', type: 'OUT', streamUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=500' },
  // Sân bay Tân Sơn Nhất - SGN
  { id: 'sgn-in-1', name: 'SGN - Cổng Vào Làn 01', airport: 'SGN', type: 'IN', streamUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=500' },
  { id: 'sgn-out-1', name: 'SGN - Cổng Ra Làn 01', airport: 'SGN', type: 'OUT', streamUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=500' },

  // Sân bay Đà Nẵng - DAD
  { id: 'dad-in-1', name: 'DAD - Cổng Vào Làn 01', airport: 'DAD', type: 'IN', streamUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=500' },
  { id: 'dad-out-1', name: 'DAD - Cổng Ra Làn 01', airport: 'DAD', type: 'OUT', streamUrl: 'https://images.unsplash.com/photo-1516594709406-e8a17a1537e6?q=80&w=500' },

  // Sân bay Cam Ranh - CXR
  { id: 'cxr-out-1', name: 'CXR - Cổng Ra Giám Sát', airport: 'CXR', type: 'OUT', streamUrl: 'https://images.unsplash.com/photo-1516594709406-e8a17a1537e6?q=80&w=500' },

  // Sân bay Cát Bi - HPH
  { id: 'hph-in-1', name: 'HPH - Cổng Vào Xe Khách', airport: 'HPH', type: 'IN', streamUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=500' },

  // Sân bay Phú Quốc - PQC
  { id: 'pqc-in-1', name: 'PQC - Cổng Vào An Ninh', airport: 'PQC', type: 'IN', streamUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=500' },
];

export default function CameraOverviewPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  // State lọc Sân bay
  const [selectedAirport, setSelectedAirport] = useState<string>('HAN');
  
  // 🌟 State lọc Loại cổng: 'IN' (Mặc định hiển thị cổng vào) hoặc 'OUT' (Cổng ra)
  const [gateType, setGateType] = useState<'IN' | 'OUT'>('IN');

  // 🌟 Hàm xử lý điều hướng thông minh dựa vào loại camera được cấu hình
  const handleSelectCamera = (cam: CameraItem) => {
    console.log(`Truy cập giám sát [${cam.type}] chi tiết cổng: ${cam.id}`);
    
    if (cam.type === 'IN') {
      // Nếu chọn camera luồng vào -> chuyển hướng tới trang checkin
      navigate('/vehicle-in', { state: { gateId: cam.id, airport: selectedAirport } });
    } else {
      // Nếu chọn camera luồng ra -> chuyển hướng tới trang checkout vừa dựng
      navigate('/vehicle-out', { state: { gateId: cam.id, airport: selectedAirport } });
    }
  };

  // 🌟 Logic lọc song song: Khớp Sân bay AND Khớp Loại cổng (Vào/Ra)
  const filteredCameras = useMemo(() => {
    return CAMERA_LIST.filter(cam => cam.airport === selectedAirport && cam.type === gateType);
  }, [selectedAirport, gateType]);

  return (
    <Box sx={{ p: 1 }}>

      {/* KHU VỰC TIÊU ĐỀ & THANH SELECT CHỌN SÂN BAY */}
      <Box
        sx={{
          mb: 2,
          pb: 2,
          borderBottom: `2px solid ${theme.palette.customBg.border}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: { xs: 3, md: 2 }
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' }
            }}
          >
            <VideocamIcon /> TRUNG TÂM GIÁM SÁT STREAM CAMERA REAL-TIME
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.5 }}>
            Chọn luồng camera thích hợp để quản lý vận hành Checkin (Cổng Vào) hoặc Checkout (Cổng Ra) của phương tiện.
          </Typography>
        </Box>

        <FormControl
          size="small"
          sx={{
            width: { xs: '100%', md: 'auto' },
            minWidth: { xs: '100%', md: 240 },
            alignSelf: { xs: 'stretch', md: 'center' }
          }}
        >
          <InputLabel
            id="airport-select-label"
            sx={{
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#f9f9f9',
              paddingRight: '6px',
              top: '-2px'
            }}
          >
            <FlightTakeoffIcon fontSize="small" /> Chọn Sân Bay
          </InputLabel>
          <Select
            labelId="airport-select-label"
            value={selectedAirport}
            label="Chọn Sân Bay"
            onChange={(e) => setSelectedAirport(e.target.value)}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.mode === 'dark' ? '#222' : '#f9f9f9',
              fontWeight: 'bold',
              '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
            }}
          >
            <MenuItem value="HAN">Nội Bài (HAN)</MenuItem>
            <MenuItem value="SGN">Tân Sơn Nhất (SGN)</MenuItem>
            <MenuItem value="DAD">Đà Nẵng (DAD)</MenuItem>
            <MenuItem value="CXR">Cam Ranh (CXR)</MenuItem>
            <MenuItem value="HPH">Cát Bi (HPH)</MenuItem>
            <MenuItem value="PQC">Phú Quốc (PQC)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 🌟 THANH TABS PHÂN LOẠI CHỨC NĂNG CỔNG VÀO / CỔNG RA */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={gateType} 
          onChange={(_, newValue) => setGateType(newValue)} 
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab 
            icon={<LoginIcon fontSize="small" />} 
            iconPosition="start" 
            label="QUẢN LÝ CỔNG VÀO (CHECKIN)" 
            value="IN" 
            sx={{ fontWeight: 'bold', fontSize: '14px' }}
          />
          <Tab 
            icon={<LogoutIcon fontSize="small" />} 
            iconPosition="start" 
            label="QUẢN LÝ CỔNG RA (CHECKOUT)" 
            value="OUT" 
            sx={{ fontWeight: 'bold', fontSize: '14px' }}
          />
        </Tabs>
      </Box>

      {/* LƯỚI HIỂN THỊ CAMERA SAU KHI LỌC ĐỒNG THỜI SÂN BAY & CỔNG VÀO/RA */}
      {filteredCameras.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: 2 }}>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Hiện tại chưa cấu hình hệ thống Camera {gateType === 'IN' ? 'CỔNG VÀO' : 'CỔNG RA'} nào tại khu vực này.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredCameras.map((cam) => (
            <Grid size={{xs:12, sm:6 , md:4}} key={cam.id}> {/* Sửa lại cú pháp Grid item kế thừa MUI v5 chuẩn xác */}
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
                <CardActionArea onClick={() => handleSelectCamera(cam)}>

                  {/* Luồng hình ảnh Live Camera */}
                  <Box
                    component="img"
                    src={cam.streamUrl}
                    alt={cam.name}
                    sx={{
                      width: '100%',
                      height: '240px',
                      objectFit: 'cover',
                      backgroundColor: '#000',
                      display: 'block'
                    }}
                  />

                  {/* Thanh thông tin dưới chân camera */}
                  <CardContent sx={{ p: 1.5, bgcolor: theme.palette.mode === 'dark' ? '#222' : '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                      {cam.name}
                    </Typography>

                    {/* Trạng thái LIVE nhấp nháy */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 8, height: 8, borderRadius: '50%',
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
      )}
    </Box>
  );
}