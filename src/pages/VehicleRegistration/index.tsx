import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  useTheme,
  InputAdornment,
  Divider,
  Grid,
  IconButton
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CancelIcon from '@mui/icons-material/Cancel';
import { CheckCircleOutlined as CheckCircleOutlineIcon } from '@mui/icons-material';
import axios from 'axios';

import CustomButton from '../../components/CustomButton';

export default function VehicleRegistrationPage() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🌟 State mới để lưu và hiển thị data trả về từ API Backend
  const [apiResponse, setApiResponse] = useState<any | null>(null);

  // 1. State quản lý dữ liệu nhập vào
  const [formData, setFormData] = useState({
    licensePlate: '',
    ticketType: 'Thang',
    ownerName: '',
    ownerId: '',
    ownerPhone: '',
    notes: ''
  });

  // State quản lý file ảnh và url preview
  const [images, setImages] = useState<{
    plate: { file: File | null; preview: string };
    vehicle: { file: File | null; preview: string };
    face: { file: File | null; preview: string };
  }>({
    plate: { file: null, preview: '' },
    vehicle: { file: null, preview: '' },
    face: { file: null, preview: '' }
  });

  const plateInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);

  // 2. State quản lý thông báo lỗi của từng trường
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

    if (e.target.value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (type: 'plate' | 'vehicle' | 'face') => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (images[type].preview) {
        URL.revokeObjectURL(images[type].preview);
      }
      setImages(prev => ({
        ...prev,
        [type]: {
          file: file,
          preview: URL.createObjectURL(file)
        }
      }));
    }
  };

  const handleRemoveImage = (type: 'plate' | 'vehicle' | 'face') => {
    if (images[type].preview) {
      URL.revokeObjectURL(images[type].preview);
    }
    setImages(prev => ({
      ...prev,
      [type]: { file: null, preview: '' }
    }));

    if (type === 'plate' && plateInputRef.current) plateInputRef.current.value = '';
    if (type === 'vehicle' && vehicleInputRef.current) vehicleInputRef.current.value = '';
    if (type === 'face' && faceInputRef.current) faceInputRef.current.value = '';
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { licensePlate: '', ownerName: '', ownerId: '', ownerPhone: '' };

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Biển số xe không được để trống!';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const missingImages = [];
    if (!images.plate.file) missingImages.push('Ảnh Biển Số');
    if (!images.vehicle.file) missingImages.push('Ảnh Toàn Xe');

    if (missingImages.length > 0) {
      alert(`Vui lòng tải lên các file bắt buộc: ${missingImages.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setApiResponse(null);

    const formDataToSend = new FormData();
    formDataToSend.append('plate_number', formData.licensePlate);
    formDataToSend.append('plate_image', images.plate.file!);
    formDataToSend.append('frame_image', images.vehicle.file!);
    if (images.face.file) {
      formDataToSend.append('driver_face_image', images.face.file);
    }
    if (formData.ownerName) formDataToSend.append('owner_name', formData.ownerName);
    if (formData.ownerId) formDataToSend.append('owner_id', formData.ownerId);
    if (formData.ownerPhone) formDataToSend.append('owner_phone', formData.ownerPhone);
    if (formData.notes) formDataToSend.append('notes', formData.notes);

    try {
      const response = await axios.post("http://127.0.0.1:8000/mock/aibox/lpr-event", formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.status === "SUCCESS" || response.status === 200) {
        const receivedData = response.data?.data || response.data;
        setApiResponse(receivedData);

        alert(`Đăng ký thành công phương tiện có biển số: ${formData.licensePlate}`);

        setFormData({
          licensePlate: '',
          ticketType: 'Thang',
          ownerName: '',
          ownerId: '',
          ownerPhone: '',
          notes: ''
        });
        handleRemoveImage('plate');
        handleRemoveImage('vehicle');
        handleRemoveImage('face');
      } else {
        alert(response.data?.message || "Đăng ký thất bại, vui lòng kiểm tra lại hệ thống.");
      }
    } catch (error: any) {
      console.error("Lỗi khi gửi yêu cầu đăng ký lên DB:", error);
      if (error.response?.status === 422) {
        alert(`Vẫn lỗi cấu trúc (422): ${JSON.stringify(error.response.data?.detail)}`);
      } else {
        alert(error.response?.data?.message || "Không thể kết nối đến máy chủ API!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderUploadBox = (
    label: string,
    type: 'plate' | 'vehicle' | 'face',
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    const currentImg = images[type];
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>
          {label}
        </Typography>
        <Box
          onClick={() => !currentImg.preview && inputRef.current?.click()}
          sx={{
            width: '100%',
            height: '130px',
            border: currentImg.preview ? `1px solid ${theme.palette.divider}` : `2px dashed ${theme.palette.primary.main}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: currentImg.preview ? 'default' : 'pointer',
            bgcolor: 'action.hover',
            overflow: 'hidden'
          }}
        >
          {currentImg.preview ? (
            <>
              <img src={currentImg.preview} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); handleRemoveImage(type); }}
                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <AddAPhotoIcon color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '11px' }}>
                Tải ảnh lên
              </Typography>
            </Box>
          )}
        </Box>
        <input type="file" accept="image/*" ref={inputRef} style={{ display: 'none' }} onChange={handleImageChange(type)} />
      </Box>
    );
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
            Đăng ký thông tin tài xế và hình ảnh phương tiện ra vào bốt bảo vệ dài hạn.
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

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Số CCCD / Định danh"
                      value={formData.ownerId}
                      onChange={handleChange('ownerId')}
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

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Số Điện Thoại"
                      value={formData.ownerPhone}
                      onChange={handleChange('ownerPhone')}
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

          {/* PHÂN KHU 2: THÔNG TIN PHƯƠNG TIỆN & HÌNH ẢNH */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: '12px', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCarIcon color="primary" /> Thông Tin Phương Tiện & Hình Ảnh Đăng Ký
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
                      label="Biển Số Xe"
                      placeholder="Ví dụ: 29C-777.77"
                      value={formData.licensePlate}
                      onChange={handleChange('licensePlate')}
                      error={Boolean(errors.licensePlate)}
                      helperText={errors.licensePlate}
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

                  <Grid size={12} sx={{ mt: 1 }}>
                    <Grid container spacing={1.5}>
                      <Grid size={4}>
                        {renderUploadBox("Ảnh Biển Số", 'plate', plateInputRef)}
                      </Grid>
                      <Grid size={4}>
                        {renderUploadBox("Ảnh Toàn Xe", 'vehicle', vehicleInputRef)}
                      </Grid>
                      <Grid size={4}>
                        {renderUploadBox("Ảnh Mặt Tài Xế", 'face', faceInputRef)}
                      </Grid>
                    </Grid>
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
              HOÀN TẤT ĐĂNG KÝ XE
            </CustomButton>
          </Grid>

          {/* 🌟 VÙNG HIỂN THỊ DỮ LIỆU BACKEND TRẢ VỀ SAU KHI SUBMIT THÀNH CÔNG */}
          {apiResponse && (
            <Grid size={12} sx={{ mt: 2 }}>
              <Card sx={{
                bgcolor: theme.palette.mode === 'light' ? '#f0f9ff' : alpha(theme.palette.primary.main, 0.05),
                border: `2px solid ${theme.palette.mode === 'light' ? '#0288d1' : theme.palette.primary.main}`,
                borderRadius: '12px'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? '#0288d1' : theme.palette.primary.main, fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon /> KẾT QUẢ NHẬN DIỆN HỆ THỐNG
                  </Typography>

                  {/* Hiển thị thông báo (message) từ API */}
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}>
                    {apiResponse.message || "Đã giả lập camera phát hiện xe thành công."}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>Mã sự kiện (Event UID):</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', fontFamily: 'monospace' }}>
                        {apiResponse.data?.event_uid || apiResponse.event_uid || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>Phiên làm việc (Session ID):</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        {apiResponse.data?.session_id || apiResponse.session_id || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>Biển số xe nhận diện:</Typography>
                      <Typography variant="body1" sx={{ College: 'bold', fontWeight: 'bold', color: 'error.main', fontSize: '1.1rem' }}>
                        {apiResponse.data?.plate_number || apiResponse.plate_number || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>Trạng thái phiên:</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <span style={{
                          backgroundColor: '#fff3e0',
                          color: '#e65100',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          {apiResponse.data?.session_status || apiResponse.session_status || 'WAITING_PERSON'}
                        </span>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

        </Grid>
      </Box>
    </Box>
  );
}