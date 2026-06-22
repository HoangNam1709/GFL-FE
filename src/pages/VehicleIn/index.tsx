import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import type { XitecLog } from '../../types/vehicle';
import CccdInfo from './components/CccdInfo';
import CameraInfo from './components/CameraInfo';
import HistoryLog from './components/HistoryLog';
import CustomButton from '../../components/CustomButton';

const API_URL = "http://127.0.0.1:8000/ocr/cccd";
const API_COMPARE_URL = "http://127.0.0.1:8000/api/v1/face/compare";

export default function VehicleInPage() {
  const [vehicleData, setVehicleData] = useState<XitecLog | null>(null);
  const [eventUid, setEventUid] = useState<string>("");
  const [printHistory, setPrintHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Đối sánh khuôn mặt
  const [isOpenCompareModal, setIsOpenCompareModal] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [liveFaceFile, setLiveFaceFile] = useState<File | null>(null);
  const [liveFacePreview, setLiveFacePreview] = useState<string>("");
  const [compareResult, setCompareResult] = useState<any>(null);

  // Quản lý Modal gộp: Nhập thông tin xe & Tải ảnh CCCD nối dữ liệu
  const [isOpenInitModal, setIsOpenInitModal] = useState<boolean>(false);
  const [detectInput, setDetectInput] = useState({
    eventUid: '',
    plateNumber: ''
  });

  // Quản lý trạng thái phiên làm việc (Session) liên kết
  const [sessionStatus, setSessionStatus] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveFaceInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const Navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (liveFacePreview) URL.revokeObjectURL(liveFacePreview);
    };
  }, [liveFacePreview]);

  const handleUpdateVehicleField = (field: keyof XitecLog, value: string) => {
    if (vehicleData) {
      setVehicleData({ ...vehicleData, [field]: value });
    }
  };

  // Kích hoạt input file chọn ảnh CCCD ẩn
  const handleTriggerSelectCccd = () => {
    fileInputRef.current?.click();
  };

  // Xử lý tải ảnh CCCD lên (Hỗ trợ cả 2 trường hợp: Chỉ đăng ký người OR Gán xe theo người)
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append('image', file);

    // Kiểm tra xem người dùng có nhập thông tin xe để gán không (Trường hợp 2)
    const hasVehicleInfo = detectInput.eventUid.trim() || detectInput.plateNumber.trim();

    if (detectInput.eventUid.trim()) {
      formData.append('event_uid', detectInput.eventUid.trim());
    }
    if (detectInput.plateNumber.trim()) {
      formData.append('plate_number', detectInput.plateNumber.trim().toUpperCase());
    }

    try {
      setIsLoading(true);
      setIsOpenInitModal(false); // Đóng modal để hiển thị tiến trình load ở màn hình chính

      // Gửi dữ liệu sang API OCR
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("=== API RESPONSE DATA ===", response.data);

      if (response.data && response.data.status === "SUCCESS") {
        const ocrData = response.data.data;
        const linkedSession = response.data.linked_session;

        // Định danh Event UID nhận về từ hệ thống
        const receivedEventUid = linkedSession?.event_uid || response.data.event_uid || detectInput.eventUid || "";

        setEventUid(receivedEventUid);
        setSessionStatus(linkedSession?.status || (hasVehicleInfo ? "READY_TO_COMPARE" : "ONLY_PERSON_REGISTERED"));

        // Cập nhật State hiển thị thông tin lên UI
        setVehicleData({
          id: ocrData?.id || "Không rõ",
          // 🌟 SỬA TẠI ĐÂY: Đảm bảo mapping đúng từ key của Backend sang state của Frontend
          name: ocrData?.name || "Không rõ",
          birth: ocrData?.birth || "",
          place: ocrData?.place || "",

          nationalId: ocrData?.id || "",
          driverName: ocrData?.name || "Không rõ", // Dự phòng cho các component con dùng driverName
          nationalIdImage: imageUrl,

          // Nếu có thông tin xe đi kèm thì ưu tiên map từ session trả về, ngược lại để trống/mặc định
          licensePlate: linkedSession?.expected_plate_number || detectInput.plateNumber.trim().toUpperCase() || (hasVehicleInfo ? "30A-123.48" : "CHƯA GẮN XE"),
          licensePlateImage: "http://127.0.0.1:8000/static/media/live_plate.jpg",
          driverFaceImage: ocrData?.cccd_face_image_url || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAV1BMVEX6+vqPj4////+Li4u5ubn8/PyIiIiFhYWJiYnk5OShoaGnp6fT09Pn5+eRkZHu7u7Z2dn19fXCwsKamprHx8exsbHOzs7X19eurq6/v7+jo6Pe3t6WlpZaNtXmAAAE3UlEQVR4nO2d25aqOhBFsUIRbgqI4AX//zsP0fa0vUfbBoKm4ljzpfvROapIIGSFKAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIEWamG+P/vn/Owhi5Juu3XZHnp6Lblutm1PT9q5aDKRriVulEqZVBqUSr9pjxh0gyrWOlr273KL05Vh/gyDTkv+jdJIsscEemrNUP9K7oU0W+f6UD1Bz+9rs4xuEOrFSrR/15T7rJwiwjU/y8gF9l3IWoyHxKLAVHxS68AYej1qZDbyRFaIocbaYIjhNHHlajTqygIS2CUqRiquDYqHFAinS0H2S+0WUwijzYThP/KFahjDY8vUWvtIEUkeK5hkkYMz9X83rUoJsQ+pTy2YIrFcJ4ytn8EoZRRCocBEMoostVeFH0LfAUOs4dSK8kpfQ2pbOT4Gp1Et6mvHZr0vEOXPhYQ7vU0TCphRueHAXFj6bsKij95pSrOY9N/xQxktymPLgbJqKfobh3HWhGw0GyIW3d5vuLoeg5f/6j4TdpL9qwczdUoh+DYWhDuhPdpY5PFhdD2dfhboGxdC/ZkMsFZvxMtOH64+9pGnfDjWTBBR7xxT/ku08XqejpcGzTvWub6rXsLnW/EIVfhu7LGNIXMdxnRC16NjRw5FZD2as0F9xuTWU//l7hxmVNeCO/hKaI89dqdAAljBxe4wdxFRp4P7dPpc/2/zNnv5AhFT8X3uBonuE5FMG57/IT4e/VfkDldEU9hFPCyCx+T1XU+6AEzaw4TVH3gQmaZbcpisFV0DDlWkzD3K1Pa8ud0EnbBClotut3NmXUx9B2sd9B2fmZo86DjgVFTOXmr4d+fa4DLuAV4rJ9EF5TOg/fz2ACiBud/rRUiT5vPyF+eIWJ1v3hnGidGMY/566sPione00CR1U21HU9rCs2YWffP+kV8A3fPwQAAIAP7k/1WApJkwpTM/THeFmOfRYJuelhGgo13nYuTaJX3VqCI1W5awDhIUof/K+hzlkZneKY+F7Bmb4uOhXPq3DUv1rQ85t916CaHcrjtegSF51gePDWp1y/o4Q+X5y+p4RjETtPRVxiq6UlnmrovkvPFl9tusS2dTt87SNaInpgh68IBh3eJLhSWxjCcK7h265DX4afP9IsEDa0w1cUaomQkx2+olBLhJwsDT09IrqfEGFt6CkKxY17cNsOb3ujqX2Tobfj+N41mCbeUqVzT56bis+T6t4i6HN/+3va1Gde7z3zhdfd0e4H7jzHb5rN7fg5OzwfUjc3WmGPOvp9NeOW47Iy9P16jXavvf3W/o/+ovyVfeptufsO19Do34IiwmxLnO/1EP8vuQ30sttTJeWIjFcpihE0W/Jf0KhqI0fQbDmZeIz+c9JWxjV4g7lYtlN1LGGz0A+of/jBnOkoJTGMSM1iZdSdzNMhmYbzEiOObkVsZ/sVpv7PDJCdn+wcDfH+UQbIhiByQkzZQc8qpEqSWG5/3sMUlYVOJn5nRieHOpxPzfEoWXcbW0uT8oqHcPS+GH9wVXZ33wT81c18JzCP96F+DfGS5lrvt4d8oy65tTS9bJZOr/k1dc67XV1Foae8Lrv4uamqoS77frfd7nZ9X9ZZ1TQsbEe+E1+Zte+gARJsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJP/AAFSQ7wNy+LTAAAAAElFTkSuQmCC",
          entryTime: linkedSession?.created_at ? new Date(linkedSession.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')
        });

        // Reset form nhập liệu cho phiên làm việc tiếp theo
        setDetectInput({ eventUid: '', plateNumber: '' });

        if (hasVehicleInfo) {
          alert("Nối dữ liệu phương tiện và thông tin tài xế thành công!");
        } else {
          alert("Quét dữ liệu OCR và đăng ký thông tin người dùng thành công!");
        }
      } else {
        alert(`Không thể trích xuất dữ liệu liên kết. Trạng thái: ${response.data?.status || 'unknown'}`);
      }
    } catch (error: any) {
      console.error("❌ Lỗi chi tiết hệ thống:", error);
      if (error.response) {
        console.error("Dữ liệu lỗi từ Server trả về:", error.response.data);
        alert(`Server phản hồi lỗi (${error.response.status}): ${error.response.data?.detail || JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        alert("Không thể kết nối đến máy chủ Backend (Network Error / CORS).");
      } else {
        alert(`Lỗi cấu hình yêu cầu: ${error.message}`);
      }
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsLoading(false);
    }
  };

  const handleLiveFaceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (liveFacePreview) URL.revokeObjectURL(liveFacePreview);
      setLiveFaceFile(file);
      setLiveFacePreview(URL.createObjectURL(file));
    }
  };

  const handleCompareFaces = async () => {
    if (!liveFaceFile) {
      alert("Vui lòng chọn hoặc chụp ảnh thực tế của tài xế trước khi đối sánh!");
      return;
    }
    if (!eventUid) {
      alert("Không tìm thấy Event UID hợp lệ từ kết quả liên kết trước đó. Vui lòng thực hiện liên kết hoặc điền thông tin xe trước.");
      return;
    }

    const formData = new FormData();
    formData.append('live_face_image', liveFaceFile);
    formData.append('event_uid', eventUid);

    try {
      setIsComparing(true);

      console.log("=== ĐANG GỬI DỮ LIỆU ĐỐI SÁNH ===");
      const response = await axios.post(API_COMPARE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("=== KẾT QUẢ ĐỐI SÁNH TỪ SERVER ===", response.data);
      setCompareResult(response.data);

      const compareInfo = response.data?.data?.compare || response.data?.compare;

      if (compareInfo?.result === "MATCH" || response.data?.status === "SUCCESS") {
        setSessionStatus("SUCCESS_MATCH");
        alert("Xác thực khuôn mặt trùng khớp thành công!");
      } else {
        alert(`Đối sánh hoàn tất! Kết quả: ${compareInfo?.result || 'Không khớp'}`);
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi đối sánh khuôn mặt:", error);
      if (error.response) {
        alert(`Server phản hồi lỗi (${error.response.status}): ${error.response.data?.detail || JSON.stringify(error.response.data)}`);
      } else {
        alert("Không thể kết nối đến API đối sánh khuôn mặt.");
      }
    } finally {
      setIsComparing(false);
    }
  };

  const handlePrintCard = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!vehicleData) return;

    const printHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>In Thẻ Giấy Cổng Vào</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            .card { border: 2px solid #000; padding: 16px; width: 320px; display: flex; justify-content: space-between; }
            .value { font-weight: bold; font-size: 16px; margin-bottom: 6px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div>
              <div class="value">Số CCCD: ${vehicleData.id}</div>
              <div class="value">Tài xế: ${vehicleData.name}</div>
              <div class="value">Biển số: ${vehicleData.licensePlate}</div>
              <div class="value">Vào lúc: ${vehicleData.entryTime}</div>
            </div>
            <div style="width: 35%; text-align: center;">
              <img src="${vehicleData.driverFaceImage}" style="width: 100%; border: 1px solid #000;" />
            </div>
          </div>
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (w) {
      w.document.open(); w.document.write(printHtml); w.document.close(); w.focus();
      setTimeout(() => { w.print(); }, 300);
    }

    setPrintHistory([
      `[IN THẺ] Xe: ${vehicleData.licensePlate} - Tài xế: ${vehicleData.name} - Thời gian: ${vehicleData.entryTime}`,
      ...printHistory,
    ]);

    if (liveFacePreview) URL.revokeObjectURL(liveFacePreview);

    setVehicleData(null);
    setEventUid("");
    setCompareResult(null);
    setLiveFacePreview("");
    setLiveFaceFile(null);
    setSessionStatus("");
  };

  // Xác định trạng thái người dùng nhập thông tin xe hay không
  const isVehicleFormFilled = detectInput.eventUid.trim().length > 0 || detectInput.plateNumber.trim().length > 0;

  return (
    <Box sx={{ bgcolor: theme.palette.customBg.main, minHeight: '100vh', p: { xs: 2, sm: 3 } }}>

      {/* HEADER */}
      <Box
        sx={{
          mb: 4, p: 2, borderBottom: `2px solid ${theme.palette.customBg.border}`,
          display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center', justifyContent: 'space-between', gap: 2
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <IconButton
              onClick={() => Navigate("/camera-overview")}
              sx={{ color: theme.palette.primary.main, border: `1px solid ${theme.palette.customBg.border}` }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
              CỔNG VÀO: GIÁM SÁT HÌNH ẢNH REAL-TIME từ CAMERA & CCCD
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, ml: 6, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <CircularProgress size={14} color="primary" />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {sessionStatus ? `Trạng thái: ${sessionStatus}` : "Đang chờ thiết lập liên kết thông tin xe và người lái..."}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

          <CustomButton variant="contained" startIcon={<AddPhotoAlternateIcon />} onClick={() => setIsOpenInitModal(true)} isLoading={isLoading}>
            Thêm CCCD
          </CustomButton>
        </Box>
      </Box>

      {/* KHU VỰC HIỂN THỊ CHÍNH */}
      {!vehicleData ? (
        <Box sx={{ textAlign: 'center', py: { xs: 6, md: 12 }, color: theme.palette.text.secondary }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Vui lòng bấm nút "Thêm CCCD", điền thông tin định danh xe hoặc tải trực tiếp tệp ảnh CCCD để đăng ký.
          </Typography>
        </Box>
      ) : (
        <Box>
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 2, gap: 2 }}>
            <CustomButton
              variant="contained" size="large" startIcon={<VerifiedUserIcon />} onClick={() => setIsOpenCompareModal(true)}
              disabled={!eventUid} // Khóa đối sánh nếu không có mã sự kiện xe liên kết
              sx={{
                fontWeight: 'bold', px: 3, py: 1.8, fontSize: '16px',
                bgcolor: theme.palette.primary.main, color: '#ffffff !important',
                '&:hover': { bgcolor: theme.palette.primary.dark }, width: { xs: '100%', sm: 'auto' }
              }}
            >
              XÁC THỰC KHUÔN MẶT
            </CustomButton>

            <CustomButton
              variant="contained" size="large" startIcon={<PrintIcon />} onClick={handlePrintCard} disabled={sessionStatus !== "SUCCESS_MATCH"}
              sx={{
                fontWeight: 'bold', px: 4, py: 1.8, fontSize: '16px',
                bgcolor: theme.palette.mode === 'light' ? '#4caf50' : '#2e7d32', color: '#ffffff',
                '&:hover': { bgcolor: theme.palette.mode === 'light' ? '#388e3c' : '#1b5e20' }, width: { xs: '100%', sm: 'auto' }
              }}
            >
              XÁC NHẬN & IN THẺ VÀO
            </CustomButton>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <HistoryLog history={printHistory} />
      </Box>

      {/* FORM GỘP: HỖ TRỢ CẢ ĐĂNG KÝ NGƯỜI LẪN ĐỒNG BỘ XE */}
      <Dialog open={isOpenInitModal} onClose={() => setIsOpenInitModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          HỒ SƠ ĐỒNG BỘ (CỔNG VÀO)
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            TRƯỜNG HỢP A: ĐỊNH DANH PHƯƠNG TIỆN (GẮN XE VÀO NGƯỜI)
          </Typography>

          <TextField
            label="Mã sự kiện xe (Event UID)"
            variant="outlined"
            fullWidth
            placeholder="Ví dụ: LPR-9c02f1a27f6b"
            value={detectInput.eventUid}
            onChange={(e) => setDetectInput({ ...detectInput, eventUid: e.target.value })}
          />
          <TextField
            label="Biển số xe"
            variant="outlined"
            fullWidth
            placeholder="Ví dụ: 30A12348"
            value={detectInput.plateNumber}
            onChange={(e) => setDetectInput({ ...detectInput, plateNumber: e.target.value })}
            slotProps={{ input: { style: { textTransform: 'uppercase' } } }}
          />

          <Box sx={{ borderTop: `1px dashed ${theme.palette.divider}`, pt: 2, mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>
              TRƯỜNG HỢP B: ĐĂNG KÝ HỒ SƠ TÀI XẾ KHÔNG KÈM XE / HOẶC HOÀN TẤT ĐỒNG BỘ
            </Typography>
            <Button
              variant="contained"
              color={isVehicleFormFilled ? "primary" : "secondary"}
              fullWidth
              startIcon={<CloudUploadIcon />}
              onClick={handleTriggerSelectCccd}
              sx={{ py: 1.5, color: '#ffffff !important', fontWeight: 'bold' }}
            >
              {isVehicleFormFilled ? "CHỌN ẢNH CCCD & ĐỒNG BỘ XE" : "CHỌN ẢNH CCCD (CHỈ ĐĂNG KÝ NGƯỜI)"}
            </Button>

            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1, fontStyle: 'italic' }}>
              * Gợi ý: Hệ thống cho phép tải trực tiếp ảnh CCCD để lấy thông tin cá nhân mà không cần nhập các trường phương tiện ở trên.
            </Typography>
          </Box>

        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" color="inherit" onClick={() => setIsOpenInitModal(false)} fullWidth>
            HỦY BỎ
          </Button>
        </DialogActions>
      </Dialog>

      {/* POPUP FORM ĐỐI SÁNH XÁC THỰC */}
      <Dialog open={isOpenCompareModal} onClose={() => setIsOpenCompareModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          HỆ THỐNG ĐỐI SÁNH XÁC THỰC KHUÔN MẶT TÀI XẾ
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 1 }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Số CCCD" variant="outlined" fullWidth value={vehicleData?.id || ''} slotProps={{ input: { readOnly: true } }} />
              <TextField label="Họ và Tên tài xế" variant="outlined" fullWidth value={vehicleData?.name || ''} slotProps={{ input: { readOnly: true } }} />
              <TextField label="Ngày sinh" variant="outlined" fullWidth value={vehicleData?.birth || ''} slotProps={{ input: { readOnly: true } }} />
              <TextField label="Nơi thường trú" variant="outlined" fullWidth multiline rows={2} value={vehicleData?.place || ''} slotProps={{ input: { readOnly: true } }} />

              {compareResult && (
                <Box sx={{ p: 2, mt: 1, bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333', borderRadius: 1, border: '1px solid #ccc' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>Kết quả đối sánh từ Server:</Typography>
                  <Typography variant="body2">- Trạng thái: {compareResult?.status || "SUCCESS"}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>- Tỷ lệ trùng khớp: {compareResult?.data?.compare?.score ? `${(compareResult.data.compare.score * 100).toFixed(1)}%` : 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: compareResult?.data?.compare?.result === 'MATCH' ? '#4caf50' : '#f44336' }}>- Kết luận: {compareResult?.data?.compare?.result || "Chờ duyệt"}</Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ width: { xs: '100%', md: '280px' }, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>Ảnh chân dung CCCD</Typography>
                <img src={vehicleData?.driverFaceImage} alt="CCCD Face" style={{ width: '150px', height: '180px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />
              </Box>

              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>Ảnh thực tế (Live Face)</Typography>
                <Box
                  onClick={() => liveFaceInputRef.current?.click()}
                  sx={{
                    width: '150px', height: '180px', border: `2px dashed ${theme.palette.primary.main}`,
                    borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', margin: '0 auto', bgcolor: 'action.hover'
                  }}
                >
                  {liveFacePreview ? (
                    <img src={liveFacePreview} alt="Live Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <CloudUploadIcon color="primary" sx={{ fontSize: 32 }} />
                      <Typography variant="caption" sx={{ p: 1, textAlign: 'center' }}>Tải ảnh thực tế</Typography>
                    </>
                  )}
                </Box>
                <input type="file" accept="image/*" ref={liveFaceInputRef} style={{ display: 'none' }} onChange={handleLiveFaceChange} />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={() => setIsOpenCompareModal(false)}>ĐÓNG MÀN HÌNH</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={isComparing ? <CircularProgress size={20} color="inherit" /> : <VerifiedUserIcon />}
            onClick={handleCompareFaces}
            disabled={isComparing}
            sx={{ color: '#ffffff !important' }}
          >
            {isComparing ? "ĐANG ĐỐI SÁNH..." : "COMPARE (SO SÁNH)"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}