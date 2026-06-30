import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
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
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIcon from "@mui/icons-material/Phone";
import SaveIcon from "@mui/icons-material/Save";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CancelIcon from "@mui/icons-material/Cancel";
import PrintIcon from "@mui/icons-material/Print";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CheckCircleOutlined as CheckCircleOutlineIcon } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import CustomButton from "../../components/CustomButton";
import CccdInfo from "../VehicleIn/components/CccdInfo";
import CameraInfo from "../VehicleIn/components/CameraInfo";
import DriverIdentityModal from "./components/DriverIdentityModal";
import FaceCompareModal from "../../components/FaceCompareModal";
import type { XitecLog } from "../../types/vehicle";
import type { ToastState } from "../../components/ToastNotification";
import ToastNotification from "../../components/ToastNotification";

interface ImageState {
  file: File | null;
  preview: string;
}

export default function VehicleRegistrationPage() {
  const theme = useTheme();
  const { user } = useAuth();
  // State quản lý luồng dữ liệu chính
  const [vehicleData, setVehicleData] = useState<XitecLog | null>(null);
  const [eventUid, setEventUid] = useState<string>("");
  const [sessionStatus, setSessionStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State trigger đóng mở popup con
  const [isOpenPersonModal, setIsOpenPersonModal] = useState<boolean>(false);
  const [isOpenCompareModal, setIsOpenCompareModal] = useState<boolean>(false);

  // Quản lý form data chính
  const [formData, setFormData] = useState({
    licensePlate: "",
    ticketType: "Thang",
    ownerName: "",
    ownerId: "",
    ownerPhone: "",
    notes: "",
  });
  const [errors, setErrors] = useState({ licensePlate: "" });
  const [images, setImages] = useState<{
    plate: ImageState;
    vehicle: ImageState;
    face: ImageState;
  }>({
    plate: { file: null, preview: "" },
    vehicle: { file: null, preview: "" },
    face: { file: null, preview: "" },
  });
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

  const plateInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (images.plate.preview) URL.revokeObjectURL(images.plate.preview);
      if (images.vehicle.preview) URL.revokeObjectURL(images.vehicle.preview);
      if (images.face.preview) URL.revokeObjectURL(images.face.preview);
    };
  }, [images.plate.preview, images.vehicle.preview, images.face.preview]);

  const handleChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]:
          field === "licensePlate"
            ? e.target.value.toUpperCase()
            : e.target.value,
      });
      if (field === "licensePlate" && e.target.value.trim() !== "")
        setErrors({ licensePlate: "" });
    };

  const handleImageChange =
    (type: "plate" | "vehicle" | "face") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (images[type].preview) URL.revokeObjectURL(images[type].preview);
        setImages((prev) => ({
          ...prev,
          [type]: { file, preview: URL.createObjectURL(file) },
        }));
      }
    };

  const handleRemoveImage = (type: "plate" | "vehicle" | "face") => {
    if (images[type].preview) URL.revokeObjectURL(images[type].preview);
    setImages((prev) => ({ ...prev, [type]: { file: null, preview: "" } }));
  };

  // Nút Back
  const handleBackToRegistration = () => {
    // 1. Giải phóng các URL preview cũ để tránh rò rỉ bộ nhớ (Memory Leak)
    if (images.plate.preview) URL.revokeObjectURL(images.plate.preview);
    if (images.vehicle.preview) URL.revokeObjectURL(images.vehicle.preview);
    if (images.face.preview) URL.revokeObjectURL(images.face.preview);

    // 2. Clear thông tin luồng chính
    setVehicleData(null);
    setSessionStatus("");
    setEventUid("");

    // 3. Clear toàn bộ dữ liệu text input trong form
    setFormData({
      licensePlate: '',
      ticketType: 'Thang',
      ownerName: '',
      ownerId: '',
      ownerPhone: '',
      notes: ''
    });

    // 4. Clear trạng thái lỗi validation
    setErrors({
      licensePlate: ''
    });

    // 5. Clear toàn bộ file và ảnh preview đã chọn
    setImages({
      plate: { file: null, preview: '' },
      vehicle: { file: null, preview: '' },
      face: { file: null, preview: '' }
    });
  };

  // Bước 1: Submit Form Xe lên hệ thống LPR bốt
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.licensePlate.trim())
      return setErrors({ licensePlate: "Biển số xe không được để trống!" });
    if (!images.plate.file || !images.vehicle.file)
      return alert("Vui lòng tải lên Ảnh Biển Số và Ảnh Toàn Xe!");

    // Chủ động lấy đúng camera_token đã lưu biệt lập từ localStorage
    const cameraToken = localStorage.getItem("camera_token");

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("event_uid", "");
      formDataToSend.append("plate_number", formData.licensePlate);
      formDataToSend.append("plate_image", images.plate.file);
      formDataToSend.append("frame_image", images.vehicle.file);

      // SỬA TẠI ĐÂY: Dùng axios thường + Endpoint tuyệt đối + Truyền chuẩn xác camera_token
      const response = await axios.post(
        "http://localhost:8000/mock/aibox/lpr-event",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Organization-ID": user?.organizationId || "",
            Authorization: `Bearer ${cameraToken || ""}`,
          },
        },
      );

      if (response.status === 200 || response.data?.status === "SUCCESS") {
        const receivedData = response.data?.data || response.data;
        setEventUid(receivedData.event_uid || response.data?.event_uid || "");
        setIsOpenPersonModal(true); // Sang tiếp Bước 2 mở popup định danh
      } else {
        showToast(response.data?.message || "Đăng ký xe thất bại.", "error");
      }
    } catch (error: any) {
      // Lỗi 401 (nếu còn bị) sẽ lọt vào đây để bạn console.log xem cụ thể, KHÔNG BỊ OUT PHIÊN nữa
      console.error(
        ">>> [DEBUG LỖI API BỐT XE]:",
        error.response?.data || error.message,
      );
      const serverMsg =
        error.response?.data?.detail?.message || error.response?.data?.detail;
      alert(
        `Lỗi bốt xe: ${typeof serverMsg === "string" ? serverMsg : "Không thể kết nối đến máy chủ API bốt xe!"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderUploadBox = (
    label: string,
    type: "plate" | "vehicle" | "face",
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const imgState = images[type];
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: "bold", mb: 0.5, color: "text.secondary" }}
        >
          {label}
        </Typography>
        <Box
          onClick={() => !imgState.preview && inputRef.current?.click()}
          sx={{
            width: "100%",
            height: "100px",
            border: imgState.preview
              ? `1px solid ${theme.palette.divider}`
              : `1px dashed ${theme.palette.primary.main}`,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: imgState.preview ? "default" : "pointer",
            bgcolor: "action.hover",
            overflow: "hidden",
          }}
        >
          {imgState.preview ? (
            <>
              <img
                src={imgState.preview}
                alt={label}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(type);
                }}
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Box sx={{ textAlign: "center", p: 1 }}>
              <AddAPhotoIcon color="primary" sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontSize: "10px",
                  color: "text.secondary",
                }}
              >
                Tải ảnh
              </Typography>
            </Box>
          )}
        </Box>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleImageChange(type)}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.customBg?.main || "background.default",
        minHeight: "100vh",
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          mb: 4,
          pb: 2,
          borderBottom: `2px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AppRegistrationIcon
          sx={{ color: theme.palette.primary.main, fontSize: 35 }}
        />
        <Box>
          <Typography
            variant="h5"
            sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
          >
            HỆ THỐNG CẤP PHÁT & ĐĂNG KÝ VÉ XE ĐỊNH KỲ
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {vehicleData
              ? `Trạng thái phiên kết nối hiện tại: ${sessionStatus}`
              : "Đăng ký thông tin tài xế và hình ảnh phương tiện ra vào bốt bảo vệ dài hạn."}
          </Typography>
        </Box>
      </Box>

      {/* VIEW FORM CHƯA CÓ KẾT QUẢ */}
      {!vehicleData ? (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "12px",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PersonIcon color="primary" /> Thông Tin Chủ Xe / Tài Xế
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Họ và Tên Chủ Xe"
                        value={formData.ownerName}
                        onChange={handleChange("ownerName")}
                        slotProps={{
                          htmlInput: { style: { textTransform: "uppercase" } },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Số CCCD / Định danh"
                        value={formData.ownerId}
                        onChange={handleChange("ownerId")}
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
                        onChange={handleChange("ownerPhone")}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "12px",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <DirectionsCarIcon color="primary" /> Thông Tin Phương Tiện
                    & Hình Ảnh
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        label="Biển Số Xe"
                        value={formData.licensePlate}
                        onChange={handleChange("licensePlate")}
                        error={Boolean(errors.licensePlate)}
                        helperText={errors.licensePlate}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 4 }}>
                          {renderUploadBox(
                            "Ảnh Biển Số",
                            "plate",
                            plateInputRef,
                          )}
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          {renderUploadBox(
                            "Ảnh Toàn Xe",
                            "vehicle",
                            vehicleInputRef,
                          )}
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          {renderUploadBox(
                            "Ảnh Mặt Tài Xế",
                            "face",
                            faceInputRef,
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú thêm..."
                value={formData.notes}
                onChange={handleChange("notes")}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <CustomButton
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                isLoading={isLoading}
                sx={{ fontWeight: "bold", px: 5, py: 1.8 }}
              >
                HOÀN TẤT ĐĂNG KÝ XE
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      ) : (
        /* VIEW HIỂN THỊ KẾT QUẢ ĐỒNG BỘ */
        <Box sx={{ mt: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToRegistration}
              sx={{
                fontWeight: "bold",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              QUAY LẠI FORM ĐĂNG KÝ
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <CustomButton
                variant="contained"
                size="large"
                startIcon={<VerifiedUserIcon />}
                onClick={() => setIsOpenCompareModal(true)}
                disabled={!eventUid}
                sx={{
                  fontWeight: "bold",
                  px: 3,
                  py: 1.5,
                  color: "#fff !important",
                }}
              >
                XÁC THỰC KHUÔN MẶT
              </CustomButton>
              <CustomButton
                variant="contained"
                size="large"
                startIcon={<PrintIcon />}
                onClick={(e) => e.preventDefault()}
                disabled={sessionStatus !== "SUCCESS_MATCH"}
                sx={{
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  bgcolor: "success.main",
                  color: "#ffffff",
                }}
              >
                XÁC NHẬN & IN THẺ VÀO
              </CustomButton>
            </Box>
          </Box>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <CheckCircleOutlineIcon color="success" /> KẾT QUẢ ĐỒNG BỘ DỮ LIỆU
            TỪ HỆ THỐNG OCR & BIOMETRIC
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box
              sx={{ flex: { xs: "1 1 100%", lg: "0 0 calc(33.33% - 16px)" } }}
            >
              <CccdInfo
                data={vehicleData}
                onUpdateField={(f, v) =>
                  setVehicleData((prev) => (prev ? { ...prev, [f]: v } : null))
                }
              />
            </Box>
            <Box
              sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(66.66% - 16px)" } }}
            >
              <CameraInfo data={vehicleData} />
            </Box>
          </Box>
        </Box>
      )}

      {/* POPUP BƯỚC 2: LIÊN KẾT ĐỊNH DANH CCCD */}
      <DriverIdentityModal
        open={isOpenPersonModal}
        onClose={() => setIsOpenPersonModal(false)}
        eventId={eventUid}
        licensePlate={formData.licensePlate}
        ownerId={formData.ownerId}
        ownerName={formData.ownerName}
        onOcrSuccess={(data, status) => {
          setVehicleData(data);
          setSessionStatus(status);
        }}
      />

      {/* POPUP BƯỚC 3: ĐỐI SÁNH XÁC THỰC KHUÔN MẶT */}
      <FaceCompareModal
        open={isOpenCompareModal}
        onClose={() => setIsOpenCompareModal(false)}
        vehicleData={vehicleData}
        eventUid={eventUid}
        onCompareSuccess={() => {
          setSessionStatus("SUCCESS_MATCH");
          showToast("Xác thực khuôn mặt trùng khớp thành công!", "success"); // 🌟 Hiện thông báo khi so khớp mặt thành công
        }}
        defaultLiveFace={images.face.file ? images.face : undefined}
      />

      <ToastNotification
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
