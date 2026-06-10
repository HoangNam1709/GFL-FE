import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { Box, Typography, CircularProgress, useTheme, IconButton } from '@mui/material'; // 🌟 Import thêm useTheme
import PrintIcon from '@mui/icons-material/Print';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import type { XitecLog } from '../../types/vehicle';

import CccdInfo from './components/CccdInfo';
import CameraInfo from './components/CameraInfo';
import HistoryLog from './components/HistoryLog';
import CustomButton from '../../components/CustomButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://127.0.0.1:8000/ocr/cccd";

export default function VehicleInPage() {
  const [vehicleData, setVehicleData] = useState<XitecLog | null>(null);
  const [printHistory, setPrintHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme(); // 🌟 Kích hoạt bộ theo dõi Theme động của hệ thống
  const Navigate = useNavigate();
  useEffect(() => {
    console.log("Hệ thống OCR sẵn sàng tiếp nhận file ảnh từ bốt bảo vệ.");
  }, []);

  const handleUpdateVehicleField = (field: keyof XitecLog, value: string) => {
    if (vehicleData) {
      setVehicleData({ ...vehicleData, [field]: value });
    }
  };

  const handleUploadImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log("Đang tải file ảnh lên Backend để xử lý OCR...");
      setIsLoading(true);
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.status === "SUCCESS") {
        const cccdApiData = response.data.data;

        setVehicleData({
          id: cccdApiData?.id || "Không rõ",
          name: cccdApiData?.name || "Không rõ",
          birth: cccdApiData?.birth || "",
          place: cccdApiData?.place || "",
          nationalId: cccdApiData?.id || "",
          driverName: cccdApiData?.name || "",
          nationalIdImage: imageUrl,
          licensePlate: "29C-777.77",
          licensePlateImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=400",
          driverFaceImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
          entryTime: new Date().toLocaleString('vi-VN')
        });

        console.log("Xử lý OCR dữ liệu CCCD thành công!");
      }
    } catch (error) {
      console.error("❌ Lỗi thực tế xuất hiện trong khối try hoặc catch:", error);
      if (axios.isAxiosError(error)) {
        console.error("Chi tiết lỗi phản hồi từ mạng:", error.response?.data || error.message);
      }
      alert("Hệ thống gặp lỗi xử lý dữ liệu. Hãy mở tab Console (F12) để xem chi tiết lỗi!");
    } finally {
      if (fileInputRef && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsLoading(false);
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

    setVehicleData(null);
  };

  return (
    // 🌟 Đổi Box ngoài cùng ăn theo nền tổng thể của Theme (Trắng xám nhạt <-> Đen sẫm)
    <Box sx={{ bgcolor: theme.palette.customBg.main, minHeight: '100vh', p: { xs: 2, sm: 3 } }}>

      {/* CẤU TRÚC HEADER CHỨA TIÊU ĐỀ & NÚT BẤM TẢI ẢNH */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          // 🌟 Viền dưới đổi màu linh hoạt động theo cấu hình theme
          borderBottom: `2px solid ${theme.palette.customBg.border}`,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            {/* 🌟 NÚT QUAY LẠI MÀN HÌNH TỔNG QUÂN 6 CAM */}
            <IconButton
              onClick={() => Navigate("/camera-overview")}
              sx={{ color: theme.palette.primary.main, border: `1px solid ${theme.palette.customBg.border}` }}
            >
              <ArrowBackIcon />
            </IconButton>

            {/* 🌟 Màu chữ tiêu đề tự động đổi (Cam công nghiệp <-> Vàng cam Real Madrid) */}
            <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
              CỔNG VÀO: GIÁM SÁT HÌNH ẢNH REAl-TIME từ CAMERA & CCCD
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, ml:6 , justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <CircularProgress size={14} color="primary" />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Hệ thống sẵn sàng nhận diện xử lý qua tệp hình ảnh...
            </Typography>
          </Box>
        </Box>

        <Box>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <CustomButton
            variant="contained"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={handleUploadImageClick}
            isLoading={isLoading}
          >
            Thêm CCCD
          </CustomButton>
        </Box>
      </Box>

      {/* KHU VỰC HIỂN THỊ CHÍNH */}
      {!vehicleData ? (
        // 🌟 Chữ thông báo chờ đổi màu linh hoạt tránh bị chìm nền
        <Box sx={{ textAlign: 'center', py: { xs: 6, md: 12 }, color: theme.palette.text.secondary }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Chờ tải tệp hình ảnh hoặc tín hiệu quét CCCD từ bốt bảo vệ...
          </Typography>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 3,
              alignItems: 'stretch',
            }}
          >
            {/* CỘT 1: Thông tin CCCD */}
            <Box
              sx={{
                flex: { xs: '1 1 100%', lg: '0 0 calc(33.33% - 16px)' },
                width: '100%',
              }}
            >
              <CccdInfo data={vehicleData} onUpdateField={handleUpdateVehicleField} />
            </Box>

            {/* CỘT 2 & 3: Các khung hình Camera */}
            <Box
              sx={{
                flex: { xs: '1 1 100%', lg: '1 1 calc(66.66% - 16px)' },
                width: '100%'
              }}
            >
              <CameraInfo data={vehicleData} />
            </Box>
          </Box>

          {/* NÚT BẤM XÁC NHẬN IN THẺ KHÁCH VÀO */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 2 }}>
            <CustomButton
              variant="contained"
              size="large"
              startIcon={<PrintIcon />}
              onClick={handlePrintCard}
              sx={{
                fontWeight: 'bold',
                px: 4, py: 1.8, fontSize: '16px',
                // 🌟 Động hóa nút xác nhận: Light theme dùng màu xanh lá tươi, Dark theme dùng xanh lá sẫm
                bgcolor: theme.palette.mode === 'light' ? '#4caf50' : '#2e7d32',
                boxShadow: theme.palette.mode === 'light'
                  ? '0px 4px 20px rgba(76, 175, 80, 0.2)'
                  : '0px 4px 20px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'light' ? '#388e3c' : '#1b5e20'
                },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              XÁC NHẬN & IN THẺ VÀO
            </CustomButton>
          </Box>
        </Box>
      )}

      {/* 3. LỊCH SỬ LOG */}
      <Box sx={{ mt: 2 }}>
        <HistoryLog history={printHistory} />
      </Box>
    </Box>
  );
}