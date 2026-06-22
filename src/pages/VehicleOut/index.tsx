// src/pages/VehicleOut/index.tsx

import { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CccdInfo from '../VehicleIn/components/CccdInfo';
import CameraInfo from '../VehicleIn/components/CameraInfo';
import HistoryLog from '../VehicleIn/components/HistoryLog';

// 🌟 ĐƯỜNG DẪN API CHECKOUT DUY NHẤT CỦA BẠN
const API_CHECKOUT_URL = "http://127.0.0.1:8000/api/v1/access/checkout";

export default function VehicleOutPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  // State lưu dữ liệu thật nhận từ BE để hiển thị lên màn hình đối soát
  const [vehicleData, setVehicleData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [printHistory, setPrintHistory] = useState<string[]>([]);

  const [isOpenInitModal, setIsOpenInitModal] = useState<boolean>(true);
  const [exitInput, setExitInput] = useState({
    eventUid: '',
    ticketCode: ''
  });

  // HÀM XỬ LÝ CHECKOUT CHÍNH: Cập nhật định dạng application/x-www-form-urlencoded
  const handleFinalCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitInput.eventUid.trim() && !exitInput.ticketCode.trim()) {
      alert("Vui lòng nhập Mã sự kiện hoặc quét mã vé!");
      return;
    }

    try {
      setIsLoading(true);

      // 🌟 GIẢI PHÁP: Sử dụng URLSearchParams để mã hóa dữ liệu chuẩn format của BE
      const params = new URLSearchParams();

      if (exitInput.eventUid.trim()) {
        params.append('event_uid', exitInput.eventUid.trim());
      }
      if (exitInput.ticketCode.trim()) {
        params.append('ticket_code', exitInput.ticketCode.trim());
      }

      // Thêm trường note mặc định nếu Backend yêu cầu bắt buộc (như trong Swagger hiển thị)
      params.append('note', 'Checkout qua ứng dụng Frontend');

      // Thực hiện gửi POST với Content-Type chuẩn
      const response = await axios.post(API_CHECKOUT_URL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data && response.data.status === "SUCCESS") {
        const resData = response.data.data;
        const sessionInfo = resData.session;
        const vehicleInfo = resData.detail?.vehicle;
        const personInfo = resData.detail?.person;

        // Map dữ liệu thật từ BE vào state hiển thị
        setVehicleData({
          id: personInfo?.cccd_number || sessionInfo?.cccd_number || "",
          name: personInfo?.full_name || sessionInfo?.full_name || "N/A",
          birth: personInfo?.birth || "",
          place: personInfo?.place || "",
          nationalId: personInfo?.cccd_number || "",
          driverName: personInfo?.full_name || "",
          licensePlate: vehicleInfo?.plate_number || sessionInfo?.expected_plate_number || "Không có xe (Chỉ có người)",
          driverFaceImage: personInfo?.live_face_image_url || personInfo?.cccd_face_image_url || "",
          licensePlateImage: vehicleInfo?.plate_image_url || vehicleInfo?.frame_image_url || "",
          entryTime: sessionInfo?.checked_in_at || ""
        });

        alert("Xác thực thông tin cổng ra THÀNH CÔNG! Mở barrier cho xe xuất bến.");

        const displayPlate = vehicleInfo?.plate_number || "Chỉ có người";
        const displayName = personInfo?.full_name || "N/A";
        setPrintHistory([
          `[CHECKOUT THÀNH CÔNG] Đối tượng: ${displayName} (${displayPlate}) - Xuất bến lúc: ${new Date().toLocaleTimeString()}`,
          ...printHistory
        ]);

        setIsOpenInitModal(false);
      } else {
        alert(`Từ chối xuất bến: ${response.data?.message || 'Lỗi đối soát hệ thống'}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(`Lỗi hệ thống: ${error.response?.data?.detail || "Không thể kết nối Backend"}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={{ bgcolor: theme.palette.customBg.main, minHeight: '100vh', p: { xs: 2, sm: 3 } }}>

      {/* HEADER */}
      <Box sx={{ mb: 4, p: 2, borderBottom: `2px solid ${theme.palette.customBg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate("/camera-overview")} sx={{ color: theme.palette.primary.main, border: `1px solid ${theme.palette.customBg.border}` }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            HỆ THỐNG GIÁM SÁT CỔNG RA (CHECKOUT OVERVIEW)
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => setIsOpenInitModal(true)}>
          Quét Xe Ra Mới
        </Button>
      </Box>

      {/* THÂN HIỂN THỊ DỮ LIỆU ĐỐI SOÁT SAU KHI CHECKOUT */}
      {!vehicleData ? (
        <Box sx={{ textAlign: 'center', py: 12, color: theme.palette.text.secondary }}>
          <Typography variant="h6">Vui lòng bấm nút "Quét Xe Ra Mới" hoặc nhập Event UID để tiến hành thực hiện phiên Checkout.</Typography>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3, alignItems: 'stretch' }}>
            <Box sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(33.33% - 16px)' }, width: '100%' }}>
              {/* Hiển thị thông tin người lấy động từ BE */}
              <CccdInfo data={vehicleData} onUpdateField={() => { }} />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.66% - 16px)' }, width: '100%' }}>
              {/* Hiển thị hình ảnh camera nhận diện biển số lấy động từ BE */}
              <CameraInfo data={vehicleData} />
            </Box>
          </Box>
        </Box>
      )}

      {/* LỊCH SỬ LOG */}
      <Box sx={{ mt: 4 }}>
        <HistoryLog history={printHistory} />
      </Box>

      {/* MODAL NHẬP MÃ ĐỊNH DANH - THỰC HIỆN GỌI LỆNH LUÔN */}
      <Dialog open={isOpenInitModal} onClose={() => setIsOpenInitModal(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleFinalCheckout}>
          <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            ĐỊNH DANH PHIÊN XUẤT BẾN
          </DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Nhập mã định danh sự kiện hoặc quét mã vé. Hệ thống sẽ tự động đối soát thông tin gốc và thực hiện lệnh kết thúc phiên xuất bến.
            </Typography>

            <TextField
              label="Mã sự kiện Cổng Ra (Event UID)"
              variant="outlined"
              fullWidth
              placeholder="LPR-xxxxxx"
              value={exitInput.eventUid}
              onChange={(e) => setExitInput({ ...exitInput, eventUid: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: <LocalShippingIcon sx={{ mr: 1 }} color="action" />
                }
              }}
            />

            <TextField
              label="Mã số vé giấy (Ticket Code)"
              variant="outlined"
              fullWidth
              placeholder="Quét mã vạch tại đây..."
              value={exitInput.ticketCode}
              onChange={(e) => setExitInput({ ...exitInput, ticketCode: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: <QrCodeScannerIcon sx={{ mr: 1 }} color="action" />
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button variant="outlined" color="inherit" onClick={() => setIsOpenInitModal(false)}>Đóng</Button>
            <Button variant="contained" type="submit" disabled={isLoading} sx={{ color: '#fff !important' }}>
              {isLoading ? "Đang xử lý..." : "Xác nhận & Xuất bến"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}