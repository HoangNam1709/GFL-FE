// src/pages/HistoryLog/components/TicketMatchInfo.tsx

import { Box, Typography, Grid, Divider, Chip, useTheme } from '@mui/material';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

interface TicketMatchInfoProps {
  item: any;
}

export default function TicketMatchInfo({ item }: TicketMatchInfoProps) {
  const theme = useTheme();

  // Nếu không có thông tin vé, không render gì cả
  if (!item.ticket) return null;

  return (
    <Grid size={{ xs: 12 }}>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1, mb: 1.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <LocalAtmIcon fontSize="small"/> 3. THÔNG TIN VÉ & ĐỐI SOÁT THU PHÍ BẾN
      </Typography>
      <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fdfdfd', borderRadius: 2, border: `1px solid ${theme.palette.customBg.border}` }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Mã số Vé bến xe:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{item.ticket.ticket_code}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">ID Hệ thống vé:</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px' }}>{item.ticket.ticket_id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Trạng thái soát vé:</Typography>
                <Box sx={{ mt: 0.3 }}>
                  <Chip 
                    label={item.ticket.status === 'CHECKED_OUT' ? 'VÉ ĐÃ SỬ DỤNG' : 'VÉ HỢP LỆ'} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ fontWeight: 'bold', fontSize: '10px', borderRadius: '4px' }} 
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Mã QR:</Typography>
            <Box component="img" src={item.ticket.qr_image_url} sx={{ width: '70px', height: '70px', objectFit: 'contain', bgcolor: 'white', p: 0.5, border: '1px solid #ddd', borderRadius: 1 }} />
          </Grid>
          
          <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Mã vạch Barcode:</Typography>
            <Box component="img" src={item.ticket.barcode_image_url || ''} sx={{ width: '100%', height: '45px', objectFit: 'contain', bgcolor: 'white', p: 0.5, border: '1px solid #ddd', borderRadius: 1 }} />
          </Grid>

        </Grid>
      </Box>
    </Grid>
  );
}