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
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Sử dụng Grid thế hệ mới ổn định
import { alpha } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import CustomButton from '../../components/CustomButton';
import ToastNotification, { type ToastState } from '../../components/ToastNotification';

const USER_TYPES = [
  { value: 'Khach', label: 'Khách vãng lai / Đối tác' },
  { value: 'NhanVien', label: 'Nhân viên tòa nhà / Công ty' },
  { value: 'CuDan', label: 'Cư dân / Chủ căn hộ' }
];

export default function UserRegistrationPage() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'success' });

  const showToast = (message: string, severity: ToastState['severity'] = 'success') => {
    setToast({ open: true, message, severity });
  };

  const [formData, setFormData] = useState({
    fullName: '',
    idCard: '',
    phoneNumber: '',
    userType: 'Khach',
    companyDepartment: '',
    notes: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    idCard: '',
    phoneNumber: ''
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: field === 'fullName' ? e.target.value.toUpperCase() : e.target.value
    });

    if (e.target.value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: '' })); 
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { fullName: '', idCard: '', phoneNumber: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống!';
      valid = false;
    }
    if (!formData.idCard.trim()) {
      newErrors.idCard = 'Số CCCD / Hộ chiếu không được để trống!';
      valid = false;
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống!';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Giả lập xử lý lưu trữ dữ liệu nghiệp vụ
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Đăng ký thành công thông tin khách: ${formData.fullName}`, 'success');
      setFormData({
        fullName: '',
        idCard: '',
        phoneNumber: '',
        userType: 'Khach',
        companyDepartment: '',
        notes: ''
      });
    }, 1500);
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', p: { xs: 2, sm: 3 } }}>

      {/* HEADER HỆ THỐNG */}
      <Box sx={{ mb: 3, pb: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 2 }}>
        <GroupAddIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', lineHeight: 1.2 }}>
            HỆ THỐNG ĐĂNG KÝ & QUẢN LÝ THÔNG TIN KHÁCH RA VÀO
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Cấp phát thông tin định danh điều khiển cho khách hàng, đối tác hoặc nhân viên mới tại bốt.
          </Typography>
        </Box>
      </Box>

      {/* KHU VỰC FORM TRUNG TÂM */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2.5}>

          {/* BLOCK TRÁI: THÔNG TIN CÁ NHÂN */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" /> Thông Tin Cá Nhân Bắt Buộc
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Họ và Tên Người Đăng Ký"
                      placeholder="VÍ DỤ: NGUYỄN VĂN A"
                      value={formData.fullName}
                      onChange={handleChange('fullName')}
                      error={Boolean(errors.fullName)}
                      helperText={errors.fullName}
                      slotProps={{
                        input: {
                          style: { textTransform: 'uppercase', fontWeight: '500' },
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Số CCCD / Hộ Chiếu"
                      placeholder="Nhập 12 số định danh cá nhân"
                      value={formData.idCard}
                      onChange={handleChange('idCard')}
                      error={Boolean(errors.idCard)}
                      helperText={errors.idCard}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* BLOCK PHẢI: PHÂN LOẠI & ĐIỀU HÀNH */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BadgeIcon fontSize="small" /> Phân Loại Định Danh & Liên Hệ
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Số Điện Thoại"
                      placeholder="Ví dụ: 0987xxxxxx"
                      value={formData.phoneNumber}
                      onChange={handleChange('phoneNumber')}
                      error={Boolean(errors.phoneNumber)}
                      helperText={errors.phoneNumber}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Nhóm Đối Tượng"
                      value={formData.userType}
                      onChange={handleChange('userType')}
                    >
                      {USER_TYPES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Công ty / Khối phòng ban"
                      placeholder="Nếu có..."
                      value={formData.companyDepartment}
                      onChange={handleChange('companyDepartment')}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* HÀNG CUỐI: GHI CHÚ & HÀNH ĐỘNG HỆ THỐNG */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              label="Mục đích vào bốt / Ghi chú lịch trình di chuyển..."
              value={formData.notes}
              onChange={handleChange('notes')}
              sx={{ bgcolor: theme.palette.background.paper, borderRadius: '4px' }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'stretch' }}>
            <CustomButton
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              isLoading={isLoading}
              sx={{
                fontWeight: 'bold',
                width: '100%',
                height: '100%',
                minHeight: '48px', // Bảo toàn độ cao cân bằng với ô ghi chú kế bên
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText, // Chữ tự động tương phản chuẩn xác
                boxShadow: `0px 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }}
            >
              LƯU & CẤP QUYỀN TRUY CẬP
            </CustomButton>
          </Grid>

        </Grid>
      </Box>

      <ToastNotification
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}