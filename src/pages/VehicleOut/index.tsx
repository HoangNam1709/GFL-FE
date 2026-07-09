// VehicleOutPage.tsx
import { useState } from "react";
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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import axiosInstance from "../../configs/axios";
import { useNavigate } from "react-router-dom";

import CccdInfo from "../VehicleIn/components/CccdInfo";
import CameraInfo from "../VehicleIn/components/CameraInfo";
import ToastNotification, {
  type ToastState,
} from "../../components/ToastNotification";

interface CheckoutHistoryLog {
  sessionId: string;
  name: string;
  licensePlate: string;
  checkinTime: string;
  checkoutTime: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
const API_CHECKOUT_URL = `${API_BASE_URL}/api/v1/access/checkout`;

export default function VehicleOutPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkoutHistory, setCheckoutHistory] = useState<CheckoutHistoryLog[]>(
    [],
  );
  const [isOpenInitModal, setIsOpenInitModal] = useState<boolean>(true);

  const [exitInput, setExitInput] = useState({
    eventUid: "",
    ticketCode: "",
  });

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (
    message: string,
    severity: ToastState["severity"] = "success",
  ) => {
    setToast({ open: true, message, severity });
  };

  const handleFinalCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!exitInput.eventUid.trim() && !exitInput.ticketCode.trim()) {
      showToast("Vui lòng nhập Mã sự kiện hoặc quét mã vé!", "warning");
      return;
    }

    let userToken = localStorage.getItem("token") || "";
    if (userToken.startsWith("Bearer ")) {
      userToken = userToken.replace("Bearer ", "");
    }

    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      if (exitInput.eventUid.trim()) {
        params.append("event_uid", exitInput.eventUid.trim());
      }
      if (exitInput.ticketCode.trim()) {
        params.append("ticket_code", exitInput.ticketCode.trim());
      }
      params.append("note", "Checkout qua ứng dụng Frontend");

      const response = await axiosInstance.post(API_CHECKOUT_URL, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data && response.data.status === "SUCCESS") {
        const resData = response.data.data;
        const sessionInfo = resData.session;
        const ticketInfo = resData.ticket;
        const vehicleInfo = resData.detail?.vehicle;
        const personInfo = resData.detail?.person;

        const mappedData = {
          id: personInfo?.cccd_number || sessionInfo?.cccd_number || "",
          name: personInfo?.full_name || sessionInfo?.full_name || "N/A",
          birth: personInfo?.birth || "",
          place: personInfo?.place || "",
          nationalId: personInfo?.cccd_number || "",
          driverName: personInfo?.full_name || "",
          licensePlate:
            vehicleInfo?.plate_number ||
            sessionInfo?.expected_plate_number ||
            "Không có xe (Chỉ có người)",
          driverFaceImage:
            personInfo?.live_face_image_url ||
            personInfo?.cccd_face_image_url ||
            "",
          licensePlateImage:
            vehicleInfo?.plate_image_url || vehicleInfo?.frame_image_url || "",
          nationalIdImage: personInfo?.cccd_original_image_url || "",
          entryTime: sessionInfo?.checked_in_at || "",

          ticket: {
            ticket_id: ticketInfo?.ticket_id || "N/A",
            ticket_code:
              ticketInfo?.ticket_code || exitInput.ticketCode || "N/A",
            // 🎯 Lấy status từ sessionInfo ("CHECKED_OUT") vì ticketInfo.status vẫn đang báo "READY"
            status: sessionInfo?.status || "CHECKED_OUT",
            qr_image_url: ticketInfo?.qr_image_url || "",
            barcode_image_url: ticketInfo?.barcode_image_url || "",
          },
        };
        setVehicleData(mappedData);

        showToast(
          "Xác thực thông tin thành công! Mở barrier cho xe xuất bến.",
          "success",
        );

        // Đẩy toàn bộ thông tin phiên vào bảng lịch sử nhật ký
        const newLog: CheckoutHistoryLog = {
          sessionId: sessionInfo?.session_id || `SS-${Date.now()}`,
          name: mappedData.name,
          licensePlate: mappedData.licensePlate,
          checkinTime: sessionInfo?.checked_in_at || "N/A",
          checkoutTime:
            sessionInfo?.checked_out_at || new Date().toLocaleString("vi-VN"),
        };

        setCheckoutHistory([newLog, ...checkoutHistory]);
        setIsOpenInitModal(false);

        // Làm sạch ô nhập liệu chuẩn bị cho xe kế tiếp
        setExitInput({ eventUid: "", ticketCode: "" });
      } else {
        showToast(
          `Từ chối xuất bến: ${response.data?.message || "Lỗi đối soát hệ thống"}`,
          "error",
        );
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        `Lỗi hệ thống: ${error.response?.data?.detail || "Không thể kết nối Backend"}`,
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.customBg.main,
        minHeight: "100vh",
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderBottom: `2px solid ${theme.palette.customBg.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => navigate("/camera-overview")}
            sx={{
              color: theme.palette.primary.main,
              border: `1px solid ${theme.palette.customBg.border}`,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
          >
            HỆ THỐNG GIÁM SÁT CỔNG RA (CHECKOUT OVERVIEW)
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsOpenInitModal(true)}
        >
          Quét Xe Ra Mới
        </Button>
      </Box>

      {/* THÂN HIỂN THỊ DỮ LIỆU ĐỐI SOÁT */}
      {!vehicleData ? (
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="h6">
            Vui lòng bấm nút "Quét Xe Ra Mới" hoặc nhập Event UID để tiến hành
            thực hiện phiên Checkout.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                flex: { xs: "1 1 100%", lg: "0 0 calc(33.33% - 16px)" },
                width: "100%",
              }}
            >
              <CccdInfo data={vehicleData} onUpdateField={() => {}} />
            </Box>
            <Box
              sx={{
                flex: { xs: "1 1 100%", lg: "1 1 calc(66.66% - 16px)" },
                width: "100%",
              }}
            >
              <CameraInfo data={vehicleData} />
            </Box>
          </Box>
        </Box>
      )}

      {/* HIỂN THỊ BẢNG LỊCH SỬ PHIÊN */}
      <Box sx={{ mt: 5 }}>
        <Typography
          variant="h6"
          sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 2 }}
        >
          NHẬT KÝ PHIÊN XE XUẤT BẾN TRONG CA
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            border: `1px solid ${theme.palette.customBg.border}`,
            boxShadow: "none",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.customBg.border }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Mã Phiên (Session ID)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Họ và Tên</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Biển Số Xe / Đối Tượng
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Thời Gian Vào (Check-in)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Thời Gian Ra (Check-out)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkoutHistory.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 3, color: "text.secondary" }}
                  >
                    Chưa có phiên nào thực hiện checkout trong phiên làm việc
                    này.
                  </TableCell>
                </TableRow>
              ) : (
                checkoutHistory.map((log) => (
                  <TableRow key={log.sessionId} hover>
                    <TableCell
                      sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                    >
                      {log.sessionId}
                    </TableCell>
                    <TableCell>{log.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.licensePlate}
                        color={
                          log.licensePlate.includes("Không có xe")
                            ? "default"
                            : "primary"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: "success.main", fontWeight: 500 }}>
                      {log.checkinTime}
                    </TableCell>
                    <TableCell sx={{ color: "error.main", fontWeight: 500 }}>
                      {log.checkoutTime}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="ĐÃ RA"
                        color="success"
                        size="small"
                        sx={{ fontWeight: "bold", color: "#fff" }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* MODAL NHẬP MÃ ĐỊNH DANH */}
      <Dialog
        open={isOpenInitModal}
        onClose={() => setIsOpenInitModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <form onSubmit={handleFinalCheckout}>
          <DialogTitle
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            ĐỊNH DANH PHIÊN XUẤT BẾN
          </DialogTitle>
          <DialogContent
            dividers
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Typography variant="body2" color="text.secondary">
              Nhập mã định danh sự kiện hoặc quét mã vé. Hệ thống sẽ tự động đối
              soát thông tin gốc và thực hiện lệnh kết thúc phiên xuất bến.
            </Typography>
            <TextField
              label="Mã sự kiện Cổng Ra (Event UID)"
              variant="outlined"
              fullWidth
              placeholder="LPR-xxxxxx"
              value={exitInput.eventUid}
              onChange={(e) =>
                setExitInput({ ...exitInput, eventUid: e.target.value })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <LocalShippingIcon sx={{ mr: 1 }} color="action" />
                  ),
                },
              }}
            />
            <TextField
              label="Mã số vé giấy (Ticket Code)"
              variant="outlined"
              fullWidth
              placeholder="Quét mã vạch tại đây..."
              value={exitInput.ticketCode}
              onChange={(e) =>
                setExitInput({ ...exitInput, ticketCode: e.target.value })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <QrCodeScannerIcon sx={{ mr: 1 }} color="action" />
                  ),
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setIsOpenInitModal(false)}
            >
              Đóng
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{ color: "#fff !important" }}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận & Xuất bến"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ToastNotification
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
