import { Card, CardContent, Typography, Divider, TextField, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIcon from "@mui/icons-material/Phone";

interface VehicleOwnerFormProps {
  formData: { ownerName: string; ownerId: string; ownerPhone: string };
  onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VehicleOwnerForm({ formData, onChange }: VehicleOwnerFormProps) {
  return (
    <Card sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px", boxShadow: "none", height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon color="primary" fontSize="small" /> Thông Tin Chủ Xe / Tài Xế
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="Họ và Tên Chủ Xe"
              value={formData.ownerName}
              onChange={onChange("ownerName")}
              slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Số CCCD / Định danh"
              value={formData.ownerId}
              onChange={onChange("ownerId")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Số Điện Thoại"
              value={formData.ownerPhone}
              onChange={onChange("ownerPhone")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}