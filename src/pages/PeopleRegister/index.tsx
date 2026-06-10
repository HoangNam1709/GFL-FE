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
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SaveIcon from '@mui/icons-material/Save';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

// Import CustomButton từ dự án của bạn
import CustomButton from '../../components/CustomButton';

// Định nghĩa các loại đối tượng ra vào bốt
const USER_TYPES = [
  { value: 'Khach', label: 'Khách vãng lai / Đối tác' },
  { value: 'NhanVien', label: 'Nhân viên tòa nhà / Công ty' },
  { value: 'CuDan', label: 'Cư dân / Chủ căn hộ' }
];

export default function UserRegistrationPage() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. State quản lý dữ liệu nhập vào của người đăng ký
  const [formData, setFormData] = useState({
    fullName: '',
    idCard: '',
    phoneNumber: '',
    userType: 'Khach',
    companyDepartment: '',
    notes: ''
  });

  // 2. State quản lý thông báo lỗi đỏ dưới chân input
  const [errors, setErrors] = useState({
    fullName: '',
    idCard: '',
    phoneNumber: ''
  });

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: field === 'fullName' ? e.target.value.toUpperCase() : e.target.value
    });

    // Nếu người dùng bắt đầu nhập, lập tức xóa vết lỗi đỏ của ô đó
    if (e.target.value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: '' })); 
    }
  };

  // 3. Trạm kiểm soát an ninh (Validate Form)
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
    
    // Nếu có ô trống, chặn đứng luồng xử lý lại
    if (!validateForm()) return;

    setIsLoading(true);
    console.log("Dữ liệu đăng ký người gửi lên Backend:", formData);

    // Giả lập gọi API
    setTimeout(() => {
      setIsLoading(false);
      alert(`Đăng ký thành công thông tin khách: ${formData.fullName}`);
      // Reset form sau khi thành công
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
    <Box sx={{ bgcolor: theme.palette.customBg.main, minHeight: '100vh', p: { xs: 2, sm: 4 } }}>

      {/* HEADER CỦA TRANG */}
      <Box sx={{ mb: 4, pb: 2, borderBottom: `2px solid ${theme.palette.customBg.border}`, display: 'flex', alignItems: 'center', gap: 2 }}>
        <GroupAddIcon sx={{ color: theme.palette.primary.main, fontSize: 35 }} />
        <Box>
          <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            HỆ THỐNG ĐĂNG KÝ & QUẢN LÝ THÔNG TIN KHÁCH RA VÀO
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Cấp phát thông tin định danh cho khách hàng, đối tác hoặc nhân viên mới.
          </Typography>
        </Box>
      </Box>

      {/* FORM CHÍNH */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>

          {/* PHÂN KHU 1: THÔNG TIN CÁ NHÂN BẮT BUỘC */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: '12px', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" /> Thông Tin Cá Nhân
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
                      label="Họ và Tên Người Đăng Ký"
                      placeholder="Ví dụ: NGUYỄN VĂN B"
                      value={formData.fullName}
                      onChange={handleChange('fullName')}
                      error={Boolean(errors.fullName)}
                      helperText={errors.fullName}
                      slotProps={{
                        input: {
                          style: { textTransform: 'uppercase' }, // Tự động viết hoa chữ trong ô nhập
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
                      label="Số CCCD / Hộ Chiếu"
                      placeholder="Nhập 12 số định danh"
                      value={formData.idCard}
                      onChange={handleChange('idCard')}
                      error={Boolean(errors.idCard)}
                      helperText={errors.idCard}
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
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* PHÂN KHU 2: PHÂN LOẠI & THÔNG TIN LIÊN HỆ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: '12px', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIndIcon color="primary" /> Phân Loại & Liên Hệ
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
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
                              <PhoneIcon />
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
                      label="Công ty / Phòng ban (Nếu có)"
                      placeholder="Ví dụ: Phòng IT, Cty A"
                      value={formData.companyDepartment}
                      onChange={handleChange('companyDepartment')}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon />
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

          {/* KHU VỰC GHI CHÚ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Lý do vào bốt / Ghi chú thêm thông tin đi kèm..."
              value={formData.notes}
              onChange={handleChange('notes')}
              sx={{ bgcolor: theme.palette.customBg.card, borderRadius: '8px' }}
            />
          </Grid>

          {/* NÚT HOÀN TẤT */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, alignItems: 'flex-end' }}>
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
              HOÀN TẤT ĐĂNG KÝ NGƯỜI
            </CustomButton>
          </Grid>

        </Grid>
      </Box>

    </Box>
  );
}