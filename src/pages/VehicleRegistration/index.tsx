import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  useTheme,
  InputAdornment,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PrintIcon from '@mui/icons-material/Print';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CheckCircleOutlined as CheckCircleOutlineIcon } from '@mui/icons-material';
import axios from 'axios';

import CustomButton from '../../components/CustomButton';
import CccdInfo from '../VehicleIn/components/CccdInfo';
import CameraInfo from '../VehicleIn/components/CameraInfo';
import type { XitecLog } from '../../types/vehicle';

const API_COMPARE_URL = "http://127.0.0.1:8000/api/v1/face/compare";

interface ImageState {
  file: File | null;
  preview: string;
}

export default function VehicleRegistrationPage() {
  const theme = useTheme();
  
  // State quản lý hiển thị dữ liệu đồng bộ xuống UI chính sau khi OCR thành công
  const [vehicleData, setVehicleData] = useState<XitecLog | null>(null);
  const [eventUid, setEventUid] = useState<string>("");
  const [sessionStatus, setSessionStatus] = useState<string>("");

  // ĐỐI SOÁT KHUÔN MẶT POPUP
  const [isOpenCompareModal, setIsOpenCompareModal] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [liveFaceFile, setLiveFaceFile] = useState<File | null>(null);
  const [liveFacePreview, setLiveFacePreview] = useState<string>("");
  const [compareResult, setCompareResult] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [personLoading, setPersonLoading] = useState<boolean>(false);

  // Quản lý Đóng/Mở Popup thêm CCCD
  const [isOpenPersonModal, setIsOpenPersonModal] = useState<boolean>(false);

  // State quản lý dữ liệu trong popup CCCD
  const [personData, setPersonData] = useState({
    eventId: '',
    barcode: '',
    cccdNumber: '',
    fullName: ''
  });

  const [cccdFile, setCccdFile] = useState<File | null>(null);
  const [cccdPreview, setCccdPreview] = useState<string>('');
  
  const cccdInputRef = useRef<HTMLInputElement>(null);
  const plateInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);
  const liveFaceInputRef = useRef<HTMLInputElement>(null);

  // State quản lý dữ liệu nhập vào phương tiện
  const [formData, setFormData] = useState({
    licensePlate: '',
    ticketType: 'Thang',
    ownerName: '',
    ownerId: '',
    ownerPhone: '',
    notes: ''
  });

  // State quản lý file ảnh xe
  const [images, setImages] = useState<{
    plate: ImageState;
    vehicle: ImageState;
    face: ImageState;
  }>({
    plate: { file: null, preview: '' },
    vehicle: { file: null, preview: '' },
    face: { file: null, preview: '' }
  });

  const [errors, setErrors] = useState({
    licensePlate: '',
    ownerName: '',
    ownerId: '',
    ownerPhone: ''
  });

  // Cleanup ObjectURLs tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      if (images.plate.preview) URL.revokeObjectURL(images.plate.preview);
      if (images.vehicle.preview) URL.revokeObjectURL(images.vehicle.preview);
      if (images.face.preview) URL.revokeObjectURL(images.face.preview);
      if (cccdPreview) URL.revokeObjectURL(cccdPreview);
      if (liveFacePreview) URL.revokeObjectURL(liveFacePreview);
    };
  }, [images.plate.preview, images.vehicle.preview, images.face.preview, cccdPreview, liveFacePreview]);

  const handleUpdateVehicleField = (field: keyof XitecLog, value: string) => {
    if (vehicleData) {
      setVehicleData({ ...vehicleData, [field]: value });
    }
  };

  const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
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
      if (images[type].preview) URL.revokeObjectURL(images[type].preview);
      setImages(prev => ({
        ...prev,
        [type]: { file: file, preview: URL.createObjectURL(file) }
      }));
    }
  };

  const handleRemoveImage = (type: 'plate' | 'vehicle' | 'face') => {
    if (images[type].preview) URL.revokeObjectURL(images[type].preview);
    setImages(prev => ({ ...prev, [type]: { file: null, preview: '' } }));
  };

  const handleCccdFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (cccdPreview) URL.revokeObjectURL(cccdPreview);
      setCccdFile(file);
      setCccdPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveCccdFile = () => {
    if (cccdPreview) URL.revokeObjectURL(cccdPreview);
    setCccdFile(null);
    setCccdPreview('');
  };

  const handleLiveFaceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (liveFacePreview) URL.revokeObjectURL(liveFacePreview);
      setLiveFaceFile(file);
      setLiveFacePreview(URL.createObjectURL(file));
    }
  };

  // Hàm click nút Back để quay lại màn hình Đăng ký
  const handleBackToRegistration = () => {
    setVehicleData(null);
    setCompareResult(null);
    setLiveFaceFile(null);
    setLiveFacePreview("");
    setSessionStatus("");
  };

  const renderUploadBox = (label: string, type: 'plate' | 'vehicle' | 'face', inputRef: React.RefObject<HTMLInputElement | null>) => {
    const imgState = images[type];
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.secondary' }}>{label}</Typography>
        <Box
          onClick={() => !imgState.preview && inputRef.current?.click()}
          sx={{
            width: '100%', height: '100px',
            border: imgState.preview ? `1px solid ${theme.palette.divider}` : `1px dashed ${theme.palette.primary.main}`,
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', cursor: imgState.preview ? 'default' : 'pointer', bgcolor: 'action.hover', overflow: 'hidden'
          }}
        >
          {imgState.preview ? (
            <>
              <img src={imgState.preview} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); handleRemoveImage(type); }}
                sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <AddAPhotoIcon color="primary" sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography variant="caption" sx={{ display: 'block', fontSize: '10px', color: 'text.secondary' }}>Tải ảnh</Typography>
            </Box>
          )}
        </Box>
        <input type="file" accept="image/*" ref={inputRef} style={{ display: 'none' }} onChange={handleImageChange(type)} />
      </Box>
    );
  };

  // Bước 1: Gửi thông tin xe
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.licensePlate.trim()) {
      setErrors(prev => ({ ...prev, licensePlate: 'Biển số xe không được để trống!' }));
      return;
    }
    if (!images.plate.file || !images.vehicle.file) {
      alert("Vui lòng tải lên Ảnh Biển Số và Ảnh Toàn Xe!");
      return;
    }

    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('event_uid', ''); 
    formDataToSend.append('plate_number', formData.licensePlate);
    formDataToSend.append('plate_image', images.plate.file!);
    formDataToSend.append('frame_image', images.vehicle.file!);

    try {
      const response = await axios.post("http://127.0.0.1:8000/mock/aibox/lpr-event", formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.data?.status === "SUCCESS") {
        const receivedData = response.data?.data || response.data;
        const extractedEventId = receivedData.event_uid || response.data?.event_uid || '';

        setEventUid(extractedEventId);
        setPersonData({
          eventId: extractedEventId,
          barcode: '',
          cccdNumber: formData.ownerId || '',
          fullName: formData.ownerName || ''
        });

        setIsOpenPersonModal(true);
      } else {
        alert(response.data?.message || "Đăng ký xe thất bại.");
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ API bốt xe!");
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 2: OCR CCCD liên kết xe + người
  const handlePersonSubmit = async () => {
    if (!cccdFile) {
      alert("Vui lòng tải lên file ảnh CCCD tài xế!");
      return;
    }

    setPersonLoading(true);
    const ocrFormData = new FormData();
    ocrFormData.append('image', cccdFile);
    if (personData.eventId) ocrFormData.append('event_uid', personData.eventId);
    ocrFormData.append('plate_number', formData.licensePlate);

    try {
      const response = await axios.post("http://127.0.0.1:8000/ocr/cccd", ocrFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.status === "SUCCESS") {
        const ocrData = response.data.data;
        const linkedSession = response.data.linked_session;

        setEventUid(linkedSession?.event_uid || response.data.event_uid || personData.eventId || "");
        setSessionStatus(linkedSession?.status || "READY_TO_COMPARE");

        setVehicleData({
          id: ocrData?.id || "Không rõ",
          name: ocrData?.name || "Không rõ",
          birth: ocrData?.birth || "",
          place: ocrData?.place || "",
          nationalId: ocrData?.id || "",
          driverName: ocrData?.name || "Không rõ",
          nationalIdImage: ocrData?.cccd_image_url || cccdPreview,
          licensePlate: formData.licensePlate || linkedSession?.expected_plate_number || "ĐÃ GẮN XE",
          licensePlateImage: images.plate.preview || "http://127.0.0.1:8000/static/media/live_plate.jpg",
          driverFaceImage: ocrData?.cccd_face_image_url || "data:image/png;base64,...",
          entryTime: linkedSession?.created_at ? new Date(linkedSession.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')
        });

        if (images.face.file) {
          setLiveFaceFile(images.face.file);
          setLiveFacePreview(images.face.preview);
        }

        alert("Liên kết định danh sinh trắc CCCD và thông tin xe thành công!");
        setIsOpenPersonModal(false);
      } else {
        alert(response.data?.message || "Không thể trích xuất dữ liệu OCR CCCD.");
      }
    } catch (err) {
      alert("Thất bại khi kết nối đến máy chủ xử lý dữ liệu sinh trắc OCR.");
    } finally {
      setPersonLoading(false);
    }
  };

  // API Đối sánh khuôn mặt
  const handleCompareFaces = async () => {
    if (!liveFaceFile || !eventUid) return;

    const compareFormData = new FormData();
    compareFormData.append('live_face_image', liveFaceFile);
    compareFormData.append('event_uid', eventUid);

    try {
      setIsComparing(true);
      const response = await axios.post(API_COMPARE_URL, compareFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCompareResult(response.data);
      const compareInfo = response.data?.data?.compare || response.data?.compare;

      if (compareInfo?.result === "MATCH" || response.data?.status === "SUCCESS") {
        setSessionStatus("SUCCESS_MATCH");
        alert("Xác thực khuôn mặt trùng khớp thành công!");
      } else {
        alert(`Đối sánh hoàn tất! Kết quả: ${compareInfo?.result || 'Không khớp'}`);
      }
    } catch (error) {
      alert("Không thể kết nối đến API đối sánh khuôn mặt.");
    } finally {
      setIsComparing(false);
    }
  };

  const handlePrintCard = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!vehicleData) return;
  };

  return (
    <Box sx={{ bgcolor: theme.palette.customBg?.main || 'background.default', minHeight: '100vh', p: { xs: 2, sm: 4 } }}>

      {/* HEADER */}
      <Box sx={{ mb: 4, pb: 2, borderBottom: `2px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppRegistrationIcon sx={{ color: theme.palette.primary.main, fontSize: 35 }} />
        <Box>
          <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            HỆ THỐNG CẤP PHÁT & ĐĂNG KÝ VÉ XE ĐỊNH KỲ
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {vehicleData ? `Trạng thái phiên kết nối hiện tại: ${sessionStatus}` : "Đăng ký thông tin tài xế và hình ảnh phương tiện ra vào bốt bảo vệ dài hạn."}
          </Typography>
        </Box>
      </Box>

      {/* Form Đăng ký xe ban đầu (Ẩn khi đã kết nối xe + người thành công) */}
      {!vehicleData ? (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {/* Cột 1: Thông tin chủ xe */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '12px', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" /> Thông Tin Chủ Xe / Tài Xế
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField fullWidth label="Họ và Tên Chủ Xe" value={formData.ownerName} onChange={handleChange('ownerName')} slotProps={{ htmlInput: { style: { textTransform: 'uppercase' } } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth 
                        label="Số CCCD / Định danh" 
                        value={formData.ownerId} 
                        onChange={handleChange('ownerId')}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <BadgeIcon color="action" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth 
                        label="Số Điện Thoại" 
                        value={formData.ownerPhone} 
                        onChange={handleChange('ownerPhone')}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="action" />
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

            {/* Cột 2: Hình ảnh xe */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '12px', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon color="primary" /> Thông Tin Phương Tiện & Hình Ảnh
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField required fullWidth label="Biển Số Xe" value={formData.licensePlate} onChange={handleChange('licensePlate')} error={Boolean(errors.licensePlate)} helperText={errors.licensePlate} />
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 4 }}>{renderUploadBox("Ảnh Biển Số", 'plate', plateInputRef)}</Grid>
                        <Grid size={{ xs: 4 }}>{renderUploadBox("Ảnh Toàn Xe", 'vehicle', vehicleInputRef)}</Grid>
                        <Grid size={{ xs: 4 }}>{renderUploadBox("Ảnh Mặt Tài Xế", 'face', faceInputRef)}</Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth multiline rows={3} label="Ghi chú thêm thông tin..." value={formData.notes} onChange={handleChange('notes')} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <CustomButton type="submit" variant="contained" size="large" startIcon={<SaveIcon />} isLoading={isLoading} sx={{ fontWeight: 'bold', px: 5, py: 1.8 }}>
                HOÀN TẤT ĐĂNG KÝ XE
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      ) : (
        /* Giao diện hiển thị kết quả từ API + Nút Back */
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            
            <Button 
              variant="outlined" 
              color="inherit" 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBackToRegistration}
              sx={{ fontWeight: 'bold', border: `1px solid ${theme.palette.divider}` }}
            >
              QUAY LẠI FORM ĐĂNG KÝ
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <CustomButton
                variant="contained" size="large" startIcon={<VerifiedUserIcon />} onClick={() => setIsOpenCompareModal(true)} disabled={!eventUid}
                sx={{ fontWeight: 'bold', px: 3, py: 1.5, bgcolor: theme.palette.primary.main, color: '#ffffff !important' }}
              >
                XÁC THỰC KHUÔN MẶT
              </CustomButton>

              <CustomButton
                variant="contained" size="large" startIcon={<PrintIcon />} onClick={handlePrintCard} disabled={sessionStatus !== "SUCCESS_MATCH"}
                sx={{ fontWeight: 'bold', px: 4, py: 1.5, bgcolor: theme.palette.mode === 'light' ? '#4caf50' : '#2e7d32', color: '#ffffff' }}
              >
                XÁC NHẬN & IN THẺ VÀO
              </CustomButton>
            </Box>
          </Box>

          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CheckCircleOutlineIcon color="success"/> KẾT QUẢ ĐỒNG BỘ DỮ LIỆU TỪ HỆ THỐNG OCR & BIOMETRIC
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3, alignItems: 'stretch' }}>
            <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(33.33% - 16px)' }, width: '100%', display: 'flex' }}>
              <Box sx={{ width: '100%', height: '100%', display: 'flex', '& > *': { height: '100% !important', width: '100%' } }}>
                <CccdInfo data={vehicleData} onUpdateField={handleUpdateVehicleField} />
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.66% - 16px)' }, width: '100%', display: 'flex' }}>
              <Box sx={{ width: '100%', height: '100%', display: 'flex', '& > *': { height: '100% !important', width: '100%' } }}>
                <CameraInfo data={vehicleData} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* POPUP BƯỚC 2: LIÊN KẾT ĐỊNH DANH CCCD */}
      <Dialog open={isOpenPersonModal} onClose={() => setIsOpenPersonModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FingerprintIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>BƯỚC 2: ĐỊNH DANH SINH TRẮC TÀI XẾ & ĐỒNG BỘ HỒ SƠ</Typography>
          </Box>
          <IconButton onClick={() => setIsOpenPersonModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Event UID tự động" fullWidth disabled value={personData.eventId} />
          <TextField label="Mã số Vé giấy / Số Barcode" fullWidth value={personData.barcode} onChange={(e) => setPersonData({ ...personData, barcode: e.target.value })} slotProps={{ input: { startAdornment: <InputAdornment position="start"><QrCodeScannerIcon color="primary" /></InputAdornment> } }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box onClick={() => !cccdPreview && cccdInputRef.current?.click()} sx={{ width: '100%', height: '140px', border: cccdPreview ? '1px solid #ccc' : `2px dashed ${theme.palette.primary.main}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', bgcolor: 'action.hover', overflow: 'hidden' }}>
              {cccdPreview ? (
                <>
                  <img src={cccdPreview} alt="CCCD" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRemoveCccdFile(); }} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }}><CancelIcon /></IconButton>
                </>
              ) : (
                <Box sx={{ textAlign: 'center' }}><AddAPhotoIcon color="primary" sx={{ fontSize: 32 }} /><Typography variant="caption" sx={{ display: 'block' }}>Tải ảnh chụp CCCD</Typography></Box>
              )}
            </Box>
            <input type="file" accept="image/*" ref={cccdInputRef} style={{ display: 'none' }} onChange={handleCccdFileChange} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsOpenPersonModal(false)} variant="outlined" color="inherit">Hủy</Button>
          <Button variant="contained" color="primary" onClick={handlePersonSubmit} disabled={personLoading} sx={{ fontWeight: 'bold', color: '#fff !important' }}>
            {personLoading ? "ĐANG XỬ LÝ OCR..." : "LIÊN KẾT ĐỊNH DANH HỆ THỐNG"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* POPUP ĐỐI SÁNH XÁC THỰC KHUÔN MẶT */}
      <Dialog open={isOpenCompareModal} onClose={() => setIsOpenCompareModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>HỆ THỐNG ĐỐI SÁNH XÁC THỰC KHUÔN MẶT</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 1 }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Số CCCD" fullWidth value={vehicleData?.id || ''} slotProps={{ input: { readOnly: true } }} />
              <TextField label="Họ và Tên tài xế" fullWidth value={vehicleData?.name || ''} slotProps={{ input: { readOnly: true } }} />
              {compareResult && (
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, border: '1px solid #ccc' }}>
                  <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold' }}>Kết quả đối sánh:</Typography>
                  <Typography variant="body2">Tỷ lệ khớp: {compareResult?.data?.compare?.score ? `${(compareResult.data.compare.score * 100).toFixed(1)}%` : 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: compareResult?.data?.compare?.result === 'MATCH' ? '#4caf50' : '#f44336' }}>Kết luận: {compareResult?.data?.compare?.result || "Chờ duyệt"}</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ width: { xs: '100%', md: '280px' }, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <img src={vehicleData?.driverFaceImage} alt="CCCD Face" style={{ width: '150px', height: '180px', objectFit: 'cover', borderRadius: '4px' }} />
              <Box onClick={() => liveFaceInputRef.current?.click()} sx={{ width: '150px', height: '180px', border: `2px dashed ${theme.palette.primary.main}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', bgcolor: 'action.hover' }}>
                {liveFacePreview ? <img src={liveFacePreview} alt="Live" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <CloudUploadIcon color="primary" />}
              </Box>
              <input type="file" accept="image/*" ref={liveFaceInputRef} style={{ display: 'none' }} onChange={handleLiveFaceChange} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" color="inherit" onClick={() => setIsOpenCompareModal(false)}>Đóng</Button>
          <Button variant="contained" color="primary" startIcon={isComparing ? <CircularProgress size={20} color="inherit" /> : <VerifiedUserIcon />} onClick={handleCompareFaces} disabled={isComparing} sx={{ color: '#fff !important' }}>
            {isComparing ? "ĐANG ĐỐI SÁNH..." : "COMPARE"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}