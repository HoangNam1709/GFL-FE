import { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PrintIcon from "@mui/icons-material/Print";
import CustomButton from "../../../components/CustomButton";
import axiosInstance from "../../../configs/axios";
import type { XitecLog } from "../../../types/vehicle";

interface ActionButtonsProps {
  eventUid: string;
  sessionStatus: string;
  vehicleData: XitecLog | null;
  onBack: () => void;
  onOpenCompare: () => void;
  onPrintSuccess: (logMessage: string) => void;
  onPrintError: (message: string) => void;
}

interface TicketData {
  ticket_id: string;
  ticket_code: string;
  front_image_url: string;
  back_image_url: string;
}

export default function ActionButtons({
  eventUid,
  sessionStatus,
  vehicleData,
  onBack,
  onOpenCompare,
  onPrintSuccess,
  onPrintError,
}: ActionButtonsProps) {
  const theme = useTheme();
  const [isPrinting, setIsPrinting] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  const handlePrint = async () => {
    if (!eventUid || !vehicleData) return;

    // Mở cửa sổ NGAY LẬP TỨC khi còn trong user gesture, trước khi await
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      onPrintError(
        "Trình duyệt đang chặn popup. Vui lòng cho phép popup cho trang này và thử lại.",
      );
      return;
    }

    // Hiển thị loading tạm trong cửa sổ mới trong khi chờ API
    printWindow.document.write(`
    <html>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;background:#111;color:#fff;">
        <p>Đang tạo vé, vui lòng chờ...</p>
      </body>
    </html>
  `);

    try {
      setIsPrinting(true);

      // Bước 1: Issue vé nếu chưa có
      let ticket = ticketData;
      if (!ticket) {
        const issueForm = new FormData();
        issueForm.append("event_uid", eventUid);
        issueForm.append("ticket_type", "VEHICLE_PASS");
        issueForm.append("issued_by", "guard-001");

        const issueRes = await axiosInstance.post(
          "/api/v1/tickets/issue",
          issueForm,
        );
        if (issueRes.data?.status !== "SUCCESS") {
          printWindow.close();
          onPrintError("Không thể tạo vé, vui lòng thử lại.");
          return;
        }

        const issued = issueRes.data.data;
        ticket = {
          ticket_id: issued.ticket_id,
          ticket_code: issued.ticket_code,
          front_image_url: issued.front_image_url,
          back_image_url: issued.back_image_url,
        };
        setTicketData(ticket);
      }

      // Bước 2: Đánh dấu đã in
      const printForm = new FormData();
      printForm.append("printer_name", "GUARD_PRINTER");
      printForm.append("printed_by", "guard-001");
      await axiosInstance.post(
        `/api/v1/tickets/${ticket.ticket_id}/print`,
        printForm,
      );

      // Bước 3: Ghi nội dung thật vào cửa sổ đã mở sẵn
      printWindow.document.open();
      printWindow.document.write(`
      <html>
        <head>
          <title>VÉ XE - ${ticket.ticket_code}</title>
          <style>
            body {
              margin: 0;
              padding: 16px;
              background: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 16px;
            }
            img {
              max-width: 640px;
              width: 100%;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            @media print {
              body { padding: 0; gap: 8px; }
              img { box-shadow: none; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <img src="${ticket.front_image_url}" alt="Mặt trước vé" />
          <img src="${ticket.back_image_url}" alt="Mặt sau vé" />
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); window.close(); }, 400);
            };
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();

      onPrintSuccess(
        `[IN VÉ] Mã: ${ticket.ticket_code} - Xe: ${vehicleData.licensePlate} - Tài xế: ${vehicleData.driverName} (${new Date().toLocaleTimeString("vi-VN")})`,
      );
    } catch (error: any) {
      console.error(
        ">>> [API ERROR PRINT TICKET]:",
        error.response?.data || error.message,
      );
      printWindow.close();
      onPrintError("Lỗi khi tạo hoặc in vé, vui lòng thử lại.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2.5,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{
          fontWeight: "bold",
          border: `1px solid ${theme.palette.divider}`,
          fontSize: "13px",
        }}
      >
        QUAY LẠI FORM ĐĂNG KÝ
      </Button>

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <CustomButton
          variant="contained"
          startIcon={<VerifiedUserIcon />}
          onClick={onOpenCompare}
          disabled={!eventUid || isPrinting}
          sx={{ fontWeight: "bold", color: "#fff !important" }}
        >
          XÁC THỰC KHUÔN MẶT
        </CustomButton>

        <CustomButton
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={sessionStatus !== "SUCCESS_MATCH" || isPrinting}
          isLoading={isPrinting}
          sx={{ fontWeight: "bold", bgcolor: "success.main", color: "#ffffff" }}
        >
          XÁC NHẬN & IN THẺ VÀO
        </CustomButton>
      </Box>
    </Box>
  );
}
