import { useState } from "react";
import type { FormEvent } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { CheckCircleOutlined as CheckCircleOutlineIcon } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import CustomButton from "../../components/CustomButton";
import CccdInfo from "../VehicleIn/components/CccdInfo";
import CameraInfo from "../VehicleIn/components/CameraInfo";
import DriverIdentityModal from "./components/DriverIdentityModal";
import FaceCompareModal from "../../components/FaceCompareModal";
import ToastNotification from "../../components/ToastNotification";
import type { XitecLog } from "../../types/vehicle";
import type { ToastState } from "../../components/ToastNotification";

// 🌟 Import các components và hooks bạn vừa tách ra
import VehicleOwnerForm from "./components/VehicleOwnerForm";
import VehicleInfoForm from "./components/VehicleInfoForm";
import ActionButtons from "./components/ActionButton";
import { useVehicleImages } from "../../hooks/useVehicleImage";
import { submitVehicleRegistration } from "../../services/VehicleService";

export default function VehicleRegistrationPage() {
  const theme = useTheme();
  const { user } = useAuth();
  
  // 1. Sử dụng Custom Hook quản lý ảnh vừa tách
  const { images, refs, handleImageChange, handleRemoveImage, resetImages } = useVehicleImages();

  // 2. State điều khiển luồng dữ liệu chính ở lại file cha
  const [vehicleData, setVehicleData] = useState<XitecLog | null>(null);
  const [eventUid, setEventUid] = useState<string>("");
  const [sessionStatus, setSessionStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenPersonModal, setIsOpenPersonModal] = useState<boolean>(false);
  const [isOpenCompareModal, setIsOpenCompareModal] = useState<boolean>(false);

  // 3. State quản lý form text chính
  const [formData, setFormData] = useState({
    licensePlate: "",
    ticketType: "Thang",
    ownerName: "",
    ownerId: "",
    ownerPhone: "",
    notes: "",
  });
  const [errors, setErrors] = useState({ licensePlate: "" });

  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'success' });
  const showToast = (message: string, severity: ToastState['severity'] = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: field === "licensePlate" ? e.target.value.toUpperCase() : e.target.value,
    });
    if (field === "licensePlate" && e.target.value.trim() !== "") setErrors({ licensePlate: "" });
  };

  const handleBackToRegistration = () => {
    resetImages(); // Gọi hàm dọn dẹp ảnh từ hook
    setVehicleData(null);
    setSessionStatus("");
    setEventUid("");
    setFormData({ licensePlate: '', ticketType: 'Thang', ownerName: '', ownerId: '', ownerPhone: '', notes: '' });
    setErrors({ licensePlate: '' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.licensePlate.trim()) return setErrors({ licensePlate: "Biển số xe không được để trống!" });
    if (!images.plate.file || !images.vehicle.file) {
      showToast("Vui lòng tải lên Ảnh Biển Số và Ảnh Toàn Xe!", "warning");
      return;
    }

    try {
      setIsLoading(true);
      // 🌟 Gọi Service API đã tách
      const result = await submitVehicleRegistration(formData.licensePlate, images, user?.organizationId);
      
      setEventUid(result.event_uid);
      setIsOpenPersonModal(true);
    } catch (error: any) {
      showToast(error.message || "Không thể kết nối đến máy chủ API bốt xe!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      {/* HEADER TIÊU ĐỀ */}
      <Box sx={{ mb: 3, pb: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, display: "flex", alignItems: "center", gap: 2 }}>
        <AppRegistrationIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: "bold", lineHeight: 1.2 }}>
            HỆ THỐNG CẤP PHÁT & ĐĂNG KÝ VÉ XE ĐỊNH KỲ
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {vehicleData ? `Trạng thái phiên kết nối: ${sessionStatus}` : "Đăng ký thông tin tài xế và phương tiện."}
          </Typography>
        </Box>
      </Box>

      {/* VIEW FORM CHƯA CÓ KẾT QUẢ */}
      {!vehicleData ? (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* 🌟 Gọi Component Form thông tin chủ xe */}
              <VehicleOwnerForm formData={formData} onChange={handleTextChange} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              {/* 🌟 Gọi Component Form thông tin xe & ảnh upload */}
              <VehicleInfoForm 
                formData={formData} 
                errors={errors} 
                images={images}
                refs={refs}
                onChange={handleTextChange}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <CustomButton type="submit" variant="contained" isLoading={isLoading} sx={{ fontWeight: "bold", px: 4, py: 1.2 }}>
                HOÀN TẤT ĐĂNG KÝ XE
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      ) : (
        /* VIEW HIỂN THỊ KẾT QUẢ ĐỒNG BỘ */
        <Box sx={{ mt: 0 }}>
          {/* 🌟 Gọi Component Thanh điều hướng hành động */}
          <ActionButtons 
            eventUid={eventUid}
            sessionStatus={sessionStatus}
            onBack={handleBackToRegistration}
            onOpenCompare={() => setIsOpenCompareModal(true)}
            onPrintSuccess={() => showToast("Cấp phát thẻ thành công!", "success")}
          />
          
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CheckCircleOutlineIcon color="success" fontSize="small" /> KẾT QUẢ ĐỒNG BỘ DỮ LIỆU TỪ HỆ THỐNG OCR & BIOMETRIC
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
            <Box sx={{ flex: { xs: "1 1 100%", lg: "0 0 calc(33.33% - 16px)" } }}>
              <CccdInfo data={vehicleData!} onUpdateField={(f, v) => setVehicleData((prev) => (prev ? { ...prev, [f]: v } : null))} />
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(66.66% - 16px)" } }}>
              <CameraInfo data={vehicleData!} />
            </Box>
          </Box>
        </Box>
      )}

      {/* POPUP MODALS & TOAST */}
      <DriverIdentityModal
        open={isOpenPersonModal}
        onClose={() => setIsOpenPersonModal(false)}
        eventId={eventUid}
        licensePlate={formData.licensePlate}
        ownerId={formData.ownerId}
        ownerName={formData.ownerName}
        onOcrSuccess={(data, status) => { setVehicleData(data); setSessionStatus(status); }}
      />

      <FaceCompareModal
        open={isOpenCompareModal}
        onClose={() => setIsOpenCompareModal(false)}
        vehicleData={vehicleData!}
        eventUid={eventUid}
        onCompareSuccess={() => { setSessionStatus("SUCCESS_MATCH"); showToast("Xác thực khuôn mặt thành công!", "success"); }}
        defaultLiveFace={images.face.file ? images.face : undefined}
      />

      <ToastNotification toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}