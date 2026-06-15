import { Box, Typography, Grid, Divider, useTheme } from '@mui/material';
import PinIcon from '@mui/icons-material/Pin';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface VehicleGateInfoProps {
  item: any;
  renderStatusChip: (status: 'CHECKED_IN' | 'CHECKED_OUT') => React.ReactNode;
}

export default function VehicleGateInfo({ item, renderStatusChip }: VehicleGateInfoProps) {
  const theme = useTheme();

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <PinIcon fontSize="small"/> 1. THÔNG TIN PHƯƠNG TIỆN & CỔNG
      </Typography>
      
      <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fdfdfd', borderRadius: 2, border: `1px solid ${theme.palette.customBg.border}`, mb: 2 }}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Mã phiên gốc:</Typography><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{item.session_id}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Trạng thái cảng:</Typography><Box sx={{ mt: 0.5 }}>{renderStatusChip(item.status)}</Box></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Tên Cổng kiểm soát:</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{item.gate_name} ({item.gate_id})</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Thời gian quét:</Typography><Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CalendarMonthIcon fontSize="inherit"/> {item.detected_at}</Typography></Grid>
          <Grid size={{ xs: 12 }}><Divider sx={{ my: 0.5 }} /></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Biển số OCR:</Typography><Typography variant="body2" color="primary" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{item.plate?.number || 'KHÔNG CÓ BIỂN / ĐI BỘ'}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Độ tin cậy OCR:</Typography><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{item.plate?.confidence ? `${(item.plate.confidence * 100).toFixed(1)}%` : 'N/A'}</Typography></Grid>
        </Grid>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>ẢNH CẬP CẢNG CAMERA TỰ ĐỘNG:</Typography>
      <Box 
        component="img"
        src={item.plate?.plate_image_url || 'https://placehold.co/600x400?text=No+Plate+Image'}
        alt="Plate camera capture"
        sx={{ width: '100%', height: '140px', objectFit: 'contain', borderRadius: 2, bgcolor: '#000', border: `1px solid ${theme.palette.customBg.border}` }}
      />
    </Grid>
  );
}