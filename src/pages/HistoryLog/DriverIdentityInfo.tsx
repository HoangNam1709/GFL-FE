import { Box, Typography, Grid, Divider, Chip, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface DriverIdentityInfoProps {
  item: any;
}

export default function DriverIdentityInfo({ item }: DriverIdentityInfoProps) {
  const theme = useTheme();

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <PersonIcon fontSize="small"/> 2. THÔNG TIN TÀI XẾ & ĐỊNH DANH
      </Typography>

      <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fdfdfd', borderRadius: 2, border: `1px solid ${theme.palette.customBg.border}`, mb: 2 }}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12 }}><Typography variant="caption" color="text.secondary">Họ và tên tài xế:</Typography><Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.person?.full_name || 'CHƯA QUÉT ĐỊNH DANH'}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Số CCCD/CMND:</Typography><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.person?.cccd_number || 'N/A'}</Typography></Grid>
          <Grid size={{ xs: 3 }}><Typography variant="caption" color="text.secondary">Ngày sinh:</Typography><Typography variant="body2">{item.person?.birth || 'N/A'}</Typography></Grid>
          <Grid size={{ xs: 3 }}><Typography variant="caption" color="text.secondary">Giới tính:</Typography><Typography variant="body2">{item.person?.sex || 'N/A'}</Typography></Grid>
          <Grid size={{ xs: 12 }}><Divider sx={{ my: 0.5 }} /></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Kết quả so khớp mặt:</Typography><Box sx={{ mt: 0.3 }}><Chip label={item.face_compare?.result === 'MATCH' ? 'TRÙNG KHỚP 100%' : 'KHÔNG KHỚP'} size="small" color={item.face_compare?.result === 'MATCH' ? 'success' : 'error'} sx={{ fontWeight: 'bold', fontSize: '10px', borderRadius: '4px', height: '20px' }} /></Box></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Điểm số AI Face:</Typography><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{item.face_compare?.score ? item.face_compare.score.toFixed(4) : 'N/A'} (Ngưỡng: {item.face_compare?.threshold || '0.45'})</Typography></Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>Ảnh chân dung CCCD:</Typography>
          <Box component="img" src={item.person?.cccd_face_image_url || 'https://placehold.co/150x150?text=No+Face'} sx={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 2, border: `1px solid ${theme.palette.customBg.border}` }} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>Ảnh Live Camera:</Typography>
          <Box component="img" src={item.person?.live_face_image_url || 'https://placehold.co/150x150?text=No+Live'} sx={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 2, border: `1px solid ${theme.palette.customBg.border}` }} />
        </Grid>
      </Grid>
    </Grid>
  );
}