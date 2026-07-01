import { Card, CardContent, Typography, Divider, TextField, Box, IconButton, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CancelIcon from "@mui/icons-material/Cancel";
import { type RefObject } from "react";
import { type ImageState } from "../../../hooks/useVehicleImage";

interface VehicleInfoFormProps {
  formData: { licensePlate: string; notes: string };
  errors: { licensePlate: string };
  images: { plate: ImageState; vehicle: ImageState; face: ImageState };
  refs: {
    plateInputRef: RefObject<HTMLInputElement | null>;
    vehicleInputRef: RefObject<HTMLInputElement | null>;
    faceInputRef: RefObject<HTMLInputElement | null>;
  };
  onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (type: "plate" | "vehicle" | "face") => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (type: "plate" | "vehicle" | "face") => void;
}

export default function VehicleInfoForm({
  formData,
  errors,
  images,
  refs,
  onChange,
  onImageChange,
  onRemoveImage,
}: VehicleInfoFormProps) {
  const theme = useTheme();

  const renderUploadBox = (label: string, type: "plate" | "vehicle" | "face", inputRef: RefObject<HTMLInputElement | null>) => {
    const imgState = images[type];
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <Typography variant="caption" sx={{ fontWeight: "bold", mb: 0.5, color: "text.secondary" }}>
          {label}
        </Typography>
        <Box
          onClick={() => !imgState.preview && inputRef.current?.click()}
          sx={{
            width: "100%",
            height: "100px",
            border: imgState.preview ? `1px solid ${theme.palette.divider}` : `1px dashed ${theme.palette.primary.main}`,
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
              <img src={imgState.preview} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onRemoveImage(type); }}
                sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(0,0,0,0.6)", color: "#fff" }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Box sx={{ textAlign: "center", p: 1 }}>
              <AddAPhotoIcon color="primary" sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography variant="caption" sx={{ display: "block", fontSize: "10px", color: "text.secondary" }}>
                Tải ảnh
              </Typography>
            </Box>
          )}
        </Box>
        <input type="file" accept="image/*" ref={inputRef} style={{ display: "none" }} onChange={onImageChange(type)} />
      </Box>
    );
  };

  return (
    <Card sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px", boxShadow: "none", height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <DirectionsCarIcon color="primary" fontSize="small" /> Thông Tin Phương Tiện & Hình Ảnh
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="Biển Số Xe"
              value={formData.licensePlate}
              onChange={onChange("licensePlate")}
              error={Boolean(errors.licensePlate)}
              helperText={errors.licensePlate}
            />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ mt: 0.5 }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 4 }}>{renderUploadBox("Ảnh Biển Số", "plate", refs.plateInputRef)}</Grid>
              <Grid size={{ xs: 4 }}>{renderUploadBox("Ảnh Toàn Xe", "vehicle", refs.vehicleInputRef)}</Grid>
              <Grid size={{ xs: 4 }}>{renderUploadBox("Ảnh Mặt Tài Xế", "face", refs.faceInputRef)}</Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Ghi chú thêm..."
              value={formData.notes}
              onChange={onChange("notes")}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}