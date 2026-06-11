import { useState, useMemo } from 'react'; // 🌟 Thêm useState và useMemo để xử lý lọc
import { Box, Typography, Card, CardContent, Grid, useTheme, CardActionArea, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'; // Icon máy bay cho phần chọn sân bay

// 🌟 Định nghĩa Interface cho cấu trúc dữ liệu Camera
interface CameraItem {
  id: string;
  name: string;
  airport: 'HAN' | 'SGN' | 'DAD' | 'CXR' | 'HPH' | 'PQC';
  streamUrl: string;
}

// 🌟 Cập nhật danh sách Camera có phân loại theo từng Sân bay
const CAMERA_LIST: CameraItem[] = [
  // Sân bay Nội Bài - HAN
  { id: 'han-gate-1', name: 'HAN - Camera Cổng Vào Làn 01', airport: 'HAN', streamUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=500' },
  { id: 'han-gate-2', name: 'HAN - Camera Khu Vực Hậu Cần', airport: 'HAN', streamUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500' },
  { id: 'han-gate-3', name: 'HAN - Camera Cổng Vào Làn 02', airport: 'HAN', streamUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500' },

  // Sân bay Tân Sơn Nhất - SGN
  { id: 'sgn-gate-1', name: 'SGN - Camera Cổng Vào Làn 01', airport: 'SGN', streamUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=500' },
  { id: 'sgn-gate-2', name: 'SGN - Camera Bãi Xe Xitéc A', airport: 'SGN', streamUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=500' },

  // Sân bay Đà Nẵng - DAD
  { id: 'dad-gate-1', name: 'DAD - Camera Cổng Vào Làn 02', airport: 'DAD', streamUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=500' },

  // Sân bay Cam Ranh - CXR
  { id: 'cxr-gate-1', name: 'CXR - Camera Giám Sát Cổng Ra', airport: 'CXR', streamUrl: 'https://images.unsplash.com/photo-1516594709406-e8a17a1537e6?q=80&w=500' },

  // Sân bay Cát Bi - HPH
  { id: 'hph-gate-1', name: 'HPH - Camera Làn Xe Khách', airport: 'HPH', streamUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=500' },

  // Sân bay Phú Quốc - PQC
  { id: 'pqc-gate-1', name: 'PQC - Camera Kiểm Soát An Ninh', airport: 'PQC', streamUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=500' },
];

export default function CameraOverviewPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  // 🌟 State lưu trữ sân bay đang chọn (Mặc định ban đầu hiển thị Sân bay Nội Bài - HAN)
  const [selectedAirport, setSelectedAirport] = useState<string>('HAN');

  const handleSelectCamera = (gateId: string) => {
    console.log(`Đang truy cập giám sát chi tiết cổng: ${gateId}`);
    navigate('/vehicle-in', { state: { gateId, airport: selectedAirport } });
  };

  // 🌟 Logic lọc danh sách Camera theo sân bay được chọn
  const filteredCameras = useMemo(() => {
    return CAMERA_LIST.filter(cam => cam.airport === selectedAirport);
  }, [selectedAirport]);

  return (
    <Box sx={{ p: 1 }}>

      {/* KHU VỰC TIÊU ĐỀ & THANH SELECT CHỌN SÂN BAY */}
      <Box
        sx={{
          mb: 4,
          pb: 2,
          borderBottom: `2px solid ${theme.palette.customBg.border}`,
          display: 'flex',
          // 🌟 Từ Tablet ngang đổ xuống (md trở xuống): Xếp dọc (column)
          // 🌟 Từ Laptop/PC lớn trở lên (md trở lên): Xếp ngang (row)
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          // 🌟 Từ tablet đổ xuống: Kéo giãn full chiều rộng (stretch)
          alignItems: { xs: 'stretch', md: 'center' },
          // 🌟 Khoảng cách giữa cụm Text và cụm Select khi xuống hàng
          gap: { xs: 3, md: 2 }
        }}
      >
        {/* KHỐI TEXT TIÊU ĐỀ: Sẽ tự động chiếm 100% width khi ở dạng flex-direction: column */}
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              // 🌟 Tinh chỉnh size chữ mượt mà: Mobile nhỏ (1.15rem) -> Tablet (1.35rem) -> PC (1.5rem)
              fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' }
            }}
          >
            <VideocamIcon /> TRUNG TÂM GIÁM SÁT STREAM CAMERA REAL-TIME
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              display: 'block',
              mt: 0.5
            }}
          >
            Chọn một luồng Camera bất kỳ để tiến hành kiểm soát vào ra và quét OCR CCCD của tài xế.
          </Typography>
        </Box>

        {/* 🌟 THANH SELECT: TỰ ĐỘNG XUỐNG DÒNG VÀ CĂN THEO THIẾT BỊ */}
        <FormControl
          size="small"
          sx={{
            // 🌟 Từ Tablet đổ xuống: Chiếm full 100% bề ngang màn hình để dễ bấm
            // 🌟 Trên PC lớn (md trở lên): Tự co lại rộng tối thiểu 240px
            width: { xs: '100%', md: 'auto' },
            minWidth: { xs: '100%', md: 240 },
            // 🌟 Định vị flex-end để trên màn hình lớn nó nằm sát lề bên phải
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
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center'
              }
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

      {/* LƯỚI HIỂN THỊ CAMERA SAU KHI LỌC */}
      {filteredCameras.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: 2 }}>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Hiện tại chưa cấu hình luồng Camera nào cho sân bay này.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredCameras.map((cam) => (
            <Grid size={{ xs: 4, md: 4, sm: 12 }} key={cam.id}>
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
                <CardActionArea onClick={() => handleSelectCamera(cam.id)}>

                  {/* Luồng hình ảnh Live Camera */}
                  <Box
                    component="img"
                    src={cam.streamUrl}
                    alt={cam.name}
                    sx={{
                      width: '100%',
                      height: '240px', // Đặt lại 240px để tỷ lệ hiển thị lưới 3 cột cân đối, không bị quá dài
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
      )}
    </Box>
  );
}