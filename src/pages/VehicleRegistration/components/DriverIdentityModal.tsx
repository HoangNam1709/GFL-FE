import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import type { XitecLog } from '../../../types/vehicle';
import ToastNotification, { type ToastState } from '../../../components/ToastNotification';

interface DriverIdentityModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  licensePlate: string;
  ownerId: string;
  ownerName: string;
  onOcrSuccess: (data: XitecLog, sessionStatus: string) => void;
}

export default function DriverIdentityModal({
  open,
  onClose,
  eventId,
  licensePlate,
  onOcrSuccess
}: DriverIdentityModalProps) {
  const theme = useTheme();
  const cccdInputRef = useRef<HTMLInputElement>(null);

  const [personLoading, setPersonLoading] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>('');
  const [cccdFile, setCccdFile] = useState<File | null>(null);
  const [cccdPreview, setCccdPreview] = useState<string>('');
  // 🌟 KHỞI TẠO STATE CHO THÔNG BÁO DÙNG CHUNG
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Hàm tiện ích hiển thị nhanh thông báo
  const showToast = (message: string, severity: ToastState['severity'] = 'success') => {
    setToast({ open: true, message, severity });
  };

  useEffect(() => {
    return () => {
      if (cccdPreview) URL.revokeObjectURL(cccdPreview);
    };
  }, [cccdPreview]);

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

  const handlePersonSubmit = async () => {
    if (!cccdFile) return showToast("Vui lòng tải lên file ảnh CCCD tài xế!","warning");

    try {
      setPersonLoading(true);
      const ocrFormData = new FormData();
      ocrFormData.append('image', cccdFile);
      if (eventId) ocrFormData.append('event_uid', eventId);
      ocrFormData.append('plate_number', licensePlate);

      const response = await axios.post("http://127.0.0.1:8000/ocr/cccd", ocrFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.status === "SUCCESS") {
        const ocrData = response.data.data;
        const linkedSession = response.data.linked_session;

        const updatedVehicleData: XitecLog = {
          id: ocrData?.id || "Không rõ",
          name: ocrData?.name || "Không rõ",
          birth: ocrData?.birth || "",
          place: ocrData?.place || "",
          nationalId: ocrData?.id || "",
          driverName: ocrData?.name || "Không rõ",
          nationalIdImage: ocrData?.cccd_image_url || cccdPreview,
          licensePlate: licensePlate || linkedSession?.expected_plate_number || "ĐÃ GẮN XE",
          licensePlateImage: "http://127.0.0.1:8000/static/media/live_plate.jpg", // Có thể truyền động từ ngoài vào nếu cần
          driverFaceImage: ocrData?.cccd_face_image_url || "data:image/png;base64,...",
          entryTime: linkedSession?.created_at ? new Date(linkedSession.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')
        };

        showToast("Liên kết định danh sinh trắc CCCD và thông tin xe thành công!","success");
        onOcrSuccess(updatedVehicleData, linkedSession?.status || "READY_TO_COMPARE");
        onClose();
      } else {
        showToast(response.data?.message || "Không thể trích xuất dữ liệu OCR CCCD.","error");
      }
    } catch (err) {
      showToast("Thất bại khi kết nối đến máy chủ xử lý dữ liệu sinh trắc OCR.","error");
    } finally {
      setPersonLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FingerprintIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>BƯỚC 2: ĐỊNH DANH SINH TRẮC TÀI XẾ & ĐỒNG BỘ HỒ SƠ</Typography>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
        </Box>
        <TextField label="Event UID tự động" fullWidth disabled value={eventId} />
        <TextField
          label="Mã số Vé giấy / Số Barcode"
          fullWidth
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><QrCodeScannerIcon color="primary" /></InputAdornment> } }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Box
            onClick={() => !cccdPreview && cccdInputRef.current?.click()}
            sx={{ width: '100%', height: '140px', border: cccdPreview ? '1px solid #ccc' : `2px dashed ${theme.palette.primary.main}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', bgcolor: 'action.hover', overflow: 'hidden' }}
          >
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
        <Button onClick={onClose} variant="outlined" color="inherit">Hủy</Button>
        <Button variant="contained" color="primary" onClick={handlePersonSubmit} disabled={personLoading} sx={{ fontWeight: 'bold', color: '#fff !important' }}>
          {personLoading ? "ĐANG XỬ LÝ OCR..." : "LIÊN KẾT ĐỊNH DANH HỆ THỐNG"}
        </Button>
      </DialogActions>

      <ToastNotification
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Dialog>
  );
}