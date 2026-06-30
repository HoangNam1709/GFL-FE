import { Box, Typography, Grid, Divider, Chip, useTheme } from '@mui/material';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

interface TicketMatchInfoProps {
  item: any;
}

export default function TicketMatchInfo({ item }: TicketMatchInfoProps) {
  const theme = useTheme();
  // 🌟 SỬA ĐIỀU KIỆN CHẶN: Nếu không có object ticket HOẶC các trường cốt lõi đều null thì không render
  if (!item.ticket || (!item.ticket.ticket_code && !item.ticket.ticket_id)) {
    return null;
  }

  // Hàm hiển thị Chip trạng thái vé thông minh dựa trên dữ liệu Session hoặc chính ticket
  // Ưu tiên dùng `item.status` (session.status) nếu có, để phản ánh ngay trạng thái checkin/checkout
  const renderTicketStatus = (ticketStatusRaw: string | null, sessionStatusRaw?: string | null) => {
    const status = (sessionStatusRaw && String(sessionStatusRaw).trim()) || (ticketStatusRaw && String(ticketStatusRaw).trim());
    if (!status) return { label: 'CHƯA CÓ TRẠNG THÁI', color: 'default' as const };

    const normalizedStatus = status.toUpperCase();

    // Nếu phiên đang CHECKED_IN => hiển thị ĐANG SỬ DỤNG
    if (normalizedStatus === 'CHECKED_IN' || normalizedStatus === 'CHECK_IN' || normalizedStatus === 'IN_USE') {
      return { label: 'ĐANG SỬ DỤNG', color: 'primary' as const };
    }

    // Nếu phiên đã CHECKED_OUT => vé đã sử dụng
    if (normalizedStatus === 'CHECKED_OUT' || normalizedStatus === 'USED') {
      return { label: 'VÉ ĐÃ SỬ DỤNG', color: 'error' as const };
    }

    // Trạng thái vé gốc tại kho
    if (normalizedStatus === 'READY' || normalizedStatus === 'ACTIVE' || normalizedStatus === 'PRINTED') {
      return { label: 'VÉ HỢP LỆ', color: 'success' as const };
    }

    return { label: `CHƯA XÁC ĐỊNH (${status})`, color: 'default' as const };
  };

  const ticketStatus = renderTicketStatus(
    item?.ticket?.status,
    item?.status ?? item?.session?.status
  );

  return (
    <Grid size={{ xs: 12 }}>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1, mb: 1.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <LocalAtmIcon fontSize="small" /> 3. THÔNG TIN VÉ & ĐỐI SOÁT THU PHÍ BẾN
      </Typography>
      <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fdfdfd', borderRadius: 2, border: `1px solid ${theme.palette.customBg.border}` }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>

          {/* Khối chữ thông tin vé */}
          <Grid size={{ xs: 12, sm: item.ticket.qr_image_url || item.ticket.barcode_image_url ? 6 : 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Mã số Vé bến xe:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', color: theme.palette.primary.main }}>
                  {item.ticket.ticket_code || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">ID Hệ thống vé:</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
                  {item.ticket.ticket_id || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Trạng thái soát vé:</Typography>
                <Box sx={{ mt: 0.3 }}>
                  <Chip
                    label={ticketStatus.label}
                    size="small"
                    color={ticketStatus.color}
                    variant="outlined"
                    sx={{ fontWeight: 'bold', fontSize: '10px', borderRadius: '4px' }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* 🌟 CHỈ RENDER ẢNH QR KHI CÓ ĐƯỜNG DẪN THẬT */}
          {item.ticket.qr_image_url && (
            <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Mã QR:</Typography>
              <Box component="img" src={item.ticket.qr_image_url} sx={{ width: '100%', height: '120px', objectFit: 'contain', bgcolor: 'white', p: 0.5, border: '1px solid #ddd', borderRadius: 1 }} />
            </Grid>
          )}

          {/* 🌟 CHỈ RENDER ẢNH BARCODE KHI CÓ ĐƯỜNG DẪN THẬT */}
          {item.ticket.barcode_image_url && (
            <Grid size={{ xs: 6, sm: 3 }} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Mã vạch Barcode:</Typography>
              <Box component="img" src={item.ticket.barcode_image_url} sx={{ width: '100%', height: '120px', objectFit: 'contain', bgcolor: 'white', p: 0.5, border: '1px solid #ddd', borderRadius: 1 }} />
            </Grid>
          )}

        </Grid>
      </Box>
    </Grid>
  );
}