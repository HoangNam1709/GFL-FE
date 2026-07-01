import { Box, Button, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PrintIcon from "@mui/icons-material/Print";
import CustomButton from "../../../components/CustomButton";

interface ActionButtonsProps {
  eventUid: string;
  sessionStatus: string;
  onBack: () => void;
  onOpenCompare: () => void;
  onPrintSuccess: () => void;
}

export default function ActionButtons({
  eventUid,
  sessionStatus,
  onBack,
  onOpenCompare,
  onPrintSuccess,
}: ActionButtonsProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 2 }}>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ fontWeight: "bold", border: `1px solid ${theme.palette.divider}`, fontSize: "13px" }}
      >
        QUAY LẠI FORM ĐĂNG KÝ
      </Button>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <CustomButton
          variant="contained"
          startIcon={<VerifiedUserIcon />}
          onClick={onOpenCompare}
          disabled={!eventUid}
          sx={{ fontWeight: "bold", color: "#fff !important" }}
        >
          XÁC THỰC KHUÔN MẶT
        </CustomButton>
        <CustomButton
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={(e) => {
            e.preventDefault();
            onPrintSuccess();
          }}
          disabled={sessionStatus !== "SUCCESS_MATCH"}
          sx={{ fontWeight: "bold", bgcolor: "success.main", color: "#ffffff" }}
        >
          XÁC NHẬN & IN THẺ VÀO
        </CustomButton>
      </Box>
    </Box>
  );
}