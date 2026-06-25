// VehicleInPage.tsx
import { useState, useRef } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { Box, Typography, CircularProgress, useTheme, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import type { XitecLog } from '../../types/vehicle';
import CccdInfo from './components/CccdInfo';
import CameraInfo from './components/CameraInfo';
import HistoryLog from './components/HistoryLog';
import FaceCompareModal from '../../components/FaceCompareModal';
import CustomButton from '../../components/CustomButton';

const API_URL = "http://127.0.0.1:8000/ocr/cccd";

export default function VehicleInPage() {
  const [vehicleData, setVehicleData] = useState<XitecLog | null>(null);
  const [eventUid, setEventUid] = useState<string>("");
  const [printHistory, setPrintHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionStatus, setSessionStatus] = useState<string>("");
  const [isOpenCompareModal, setIsOpenCompareModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const Navigate = useNavigate();

  const handleUpdateVehicleField = (field: keyof XitecLog, value: string) => {
    if (vehicleData) setVehicleData({ ...vehicleData, [field]: value });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsLoading(true);
      const response = await axios.post(API_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (response.data?.status === "SUCCESS") {
        const ocrData = response.data.data;
        const linkedSession = response.data.linked_session;
        setEventUid(linkedSession?.event_uid || response.data.event_uid || "");
        setSessionStatus(linkedSession?.status || "ONLY_PERSON_REGISTERED");

        setVehicleData({
          id: ocrData?.id || "Không rõ",
          name: ocrData?.name || "Không rõ",
          birth: ocrData?.birth || "",
          place: ocrData?.place || "",
          nationalId: ocrData?.id || "",
          driverName: ocrData?.name || "Không rõ",
          nationalIdImage: imageUrl,
          licensePlate: linkedSession?.expected_plate_number || "CHƯA GẮN XE",
          licensePlateImage: "http://127.0.0.1:8000/static/media/live_plate.jpg",
          driverFaceImage: ocrData?.cccd_face_image_url || "data:image/png;base64,...",
          entryTime: linkedSession?.created_at ? new Date(linkedSession.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')
        });
        alert("Đăng ký thông tin tài xế thành công!");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ khi xử lý OCR.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsLoading(false);
    }
  };

  const handlePrintCard = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!vehicleData) return;

    // Giao diện HTML In ấn giữ nguyên (Có thể đưa vào helper function nếu muốn tối ưu sâu thêm)
    const printHtml = `<html>...</html>`; 
    const w = window.open('', '_blank');
    if (w) { w.document.write(printHtml); w.document.close(); setTimeout(() => w.print(), 300); }

    setPrintHistory([`[IN THẺ] Xe: ${vehicleData.licensePlate} - Tài xế: ${vehicleData.name}`, ...printHistory]);
    setVehicleData(null); setEventUid(""); setSessionStatus("");
  };

  return (
    <Box sx={{ bgcolor: theme.palette.customBg.main, minHeight: '100vh', p: { xs: 2, sm: 3 } }}>
      {/* HEADER */}
      <Box sx={{ mb: 4, p: 2, borderBottom: `2px solid ${theme.palette.customBg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => Navigate("/camera-overview")} sx={{ color: theme.palette.primary.main, border: `1px solid ${theme.palette.customBg.border}` }}><ArrowBackIcon /></IconButton>
            <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>CỔNG VÀO: ĐỊNH DANH TÀI XẾ</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, ml: 6 }}>
            <CircularProgress size={14} /><Typography variant="caption">{sessionStatus ? `Trạng thái: ${sessionStatus}` : "Đang chờ tải ảnh CCCD..."}</Typography>
          </Box>
        </Box>
        <Box>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <CustomButton variant="contained" startIcon={<AddPhotoAlternateIcon />} onClick={() => fileInputRef.current?.click()} isLoading={isLoading}>ĐĂNG KÝ NGƯỜI (CCCD)</CustomButton>
        </Box>
      </Box>

      {/* BODY DISPLAY */}
      {!vehicleData ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}><Typography variant="h6">Vui lòng bấm nút "Đăng ký người (CCCD)" để tải tệp ảnh.</Typography></Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(33.33% - 16px)' } }}><CccdInfo data={vehicleData} onUpdateField={handleUpdateVehicleField} /></Box>
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.66% - 16px)' } }}><CameraInfo data={vehicleData} /></Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <CustomButton variant="contained" size="large" startIcon={<VerifiedUserIcon />} onClick={() => setIsOpenCompareModal(true)} disabled={!eventUid}>XÁC THỰC KHUÔN MẶT</CustomButton>
            <CustomButton variant="contained" size="large" startIcon={<PrintIcon />} onClick={handlePrintCard} disabled={sessionStatus !== "SUCCESS_MATCH"}>XÁC NHẬN & IN THẺ VÀO</CustomButton>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 2 }}><HistoryLog history={printHistory} /></Box>

      {/* MODAL ĐỐI SÁNH ĐÃ ĐƯỢC TÁCH */}
      <FaceCompareModal 
        open={isOpenCompareModal} 
        onClose={() => setIsOpenCompareModal(false)} 
        vehicleData={vehicleData} 
        eventUid={eventUid} 
        onCompareSuccess={() => setSessionStatus("SUCCESS_MATCH")} 
      />
    </Box>
  );
}