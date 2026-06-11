import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  useTheme,
  InputAdornment,
  Divider,
  Grid
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

// Import CustomButton từ dự án của bạn
import CustomButton from '../../components/CustomButton';

const VEHICLE_TYPES = [
  { value: 'Oto', label: 'Xe Ô tô (Con/Tải/Xitec)' },
  { value: 'XeMay', label: 'Xe Máy / Mô tô' },
  { value: 'XeDien', label: 'Xe Đạp Điện / Máy Điện' }
];



export default function VehicleRegistrationPage() { 
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. State quản lý dữ liệu nhập vào
  const [formData, setFormData] = useState({
    licensePlate: '',
    vehicleType: 'Oto',
    ticketType: 'Thang',
    ownerName: '',
    ownerId: '',
    ownerPhone: '',
    notes: ''
  });

  // 🌟 2. State quản lý thông báo lỗi của từng trường (Trống nghĩa là không có lỗi)
  const [errors, setErrors] = useState({
    licensePlate: '',
    ownerName: '',
    ownerId: '',
    ownerPhone: ''
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: field === 'licensePlate' ? e.target.value.toUpperCase() : e.target.value
    });

    // 💡 Khi người dùng bắt đầu gõ chữ vào, lập tức xóa vết lỗi đỏ của ô đó đi
    if (e.target.value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 🌟 3. Hàm kiểm tra toàn bộ form trước khi submit
  const validateForm = () => {
    let valid = true;
    const newErrors = { licensePlate: '', ownerName: '', ownerId: '', ownerPhone: '' };

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Biển số xe không được để trống!';
      valid = false;
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Họ và tên chủ xe không được để trống!';
      valid = false;
    }
    if (!formData.ownerId.trim()) {
      newErrors.ownerId = 'Số CCCD không được để trống!';
      valid = false;
    }
    if (!formData.ownerPhone.trim()) {
      newErrors.ownerPhone = 'Số điện thoại không được để trống!';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🌟 Nếu form không hợp lệ thì chặn ngay tại đây, không cho chạy tiếp xuống Backend
    if (!validateForm()) return;

    setIsLoading(true);
    console.log("Dữ liệu hợp lệ gửi lên Backend:", formData);

    setTimeout(() => {
      setIsLoading(false);
      alert(`Đăng ký thành công biển số: ${formData.licensePlate}`);
      setFormData({
        licensePlate: '',
        vehicleType: 'Oto',
        ticketType: 'Thang',
        ownerName: '',
        ownerId: '',
        ownerPhone: '',
        notes: ''
      });
    }, 1500);
  };

  return (
    <Box sx={{ bgcolor: theme.palette.customBg.main, minHeight: '100vh', p: { xs: 2, sm: 4 } }}>

      {/* HEADER */}
      <Box sx={{ mb: 4, pb: 2, borderBottom: `2px solid ${theme.palette.customBg.border}`, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppRegistrationIcon sx={{ color: theme.palette.primary.main, fontSize: 35 }} />
        <Box>
          <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            HỆ THỐNG CẤP PHÁT & ĐĂNG KÝ VÉ XE ĐỊNH KỲ
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Đăng ký thông tin tài xế và phương tiện ra vào bốt bảo vệ dài hạn.
          </Typography>
        </Box>
      </Box>

      {/* FORM CHÍNH */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {/* PHÂN KHU 1: THÔNG TIN CHỦ XE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: '12px', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" /> Thông Tin Chủ Xe / Tài Xế
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
                      label="Họ và Tên Chủ Xe"
                      placeholder="Ví dụ: NGUYỄN VĂN A"
                      value={formData.ownerName}
                      onChange={handleChange('ownerName')}

                      // 🌟 CÚ PHÁP BÁO LỖI ĐỎ CỦA MUI:
                      error={Boolean(errors.ownerName)}
                      helperText={errors.ownerName}

                      slotProps={{
                        input: {
                          style: { textTransform: 'uppercase' },
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Số CCCD / Định danh"
                      value={formData.ownerId}
                      onChange={handleChange('ownerId')}

                      // 🌟 CÚ PHÁP BÁO LỖI ĐỎ CỦA MUI:
                      error={Boolean(errors.ownerId)}
                      helperText={errors.ownerId}

                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Số Điện Thoại"
                      value={formData.ownerPhone}
                      onChange={handleChange('ownerPhone')}

                      // 🌟 CÚ PHÁP BÁO LỖI ĐỎ CỦA MUI:
                      error={Boolean(errors.ownerPhone)}
                      helperText={errors.ownerPhone}

                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* PHÂN KHU 2: THÔNG TIN PHƯƠNG TIỆN */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: '12px', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCarIcon color="primary" /> Thông Tin Phương Tiện
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Biển Số Xe"
                      placeholder="Ví dụ: 29C-777.77"
                      value={formData.licensePlate}
                      onChange={handleChange('licensePlate')}

                      // 🌟 CÚ PHÁP BÁO LỖI ĐỎ CỦA MUI:
                      error={Boolean(errors.licensePlate)} // Đổi sang true nếu có chuỗi lỗi
                      helperText={errors.licensePlate}      // Hiển thị nội dung lỗi bên dưới

                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 6, md: 12 }}>
                    <TextField
                      required
                      select
                      fullWidth
                      label="Loại Phương Tiện"
                      value={formData.vehicleType}
                      onChange={handleChange('vehicleType')}
                    >
                      {VEHICLE_TYPES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>



          {/* GHI CHÚ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Ghi chú thêm thông tin (Màu xe, thông tin công ty, phòng ban...)"
              value={formData.notes}
              onChange={handleChange('notes')}
              sx={{ bgcolor: theme.palette.customBg.card, borderRadius: '8px' }}
            />
          </Grid>

          {/* NÚT ĐĂNG KÝ */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <CustomButton
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              isLoading={isLoading}
              sx={{
                fontWeight: 'bold',
                px: 5, py: 1.8, fontSize: '16px',
                bgcolor: theme.palette.mode === 'light' ? '#1976d2' : theme.palette.primary.main,
                color: theme.palette.mode === 'light' ? '#fff' : '#000',
                boxShadow: theme.palette.mode === 'light'
                  ? `0px 4px 20px ${alpha('#1976d2', 0.2)}`
                  : `0px 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? '#115293' : '#e68a00'
                },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              HOÀN TẤT ĐĂNG KÝ XE
            </CustomButton>
          </Grid>

        </Grid>
      </Box>

    </Box>
  );
}