// src/pages/HistoryLog/HistoryCard.tsx

import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Chip, Avatar, 
  Button, Dialog, DialogTitle, DialogContent, IconButton, Divider 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PinIcon from '@mui/icons-material/Pin';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import type { HistoryLogItem } from './types';

// 🌟 Import đầy đủ 3 Component con đã được module hóa tách nhỏ
import VehicleGateInfo from './VehicleGateInfo';
import DriverIdentityInfo from './DriverIdentityInfo';
import TicketMatchInfo from './TicketMatchInfo';

interface HistoryCardProps {
  item: HistoryLogItem;
}

export default function HistoryCard({ item }: HistoryCardProps) {
  const theme = useTheme();
  const rawItem = item as any; // Ép kiểu an toàn giảm thiểu bắt bẻ từ bộ biên dịch
  
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const handleOpen = () => setOpenDetail(true);
  const handleClose = () => setOpenDetail(false);

  const renderStatusChip = (status: 'CHECKED_IN' | 'CHECKED_OUT') => {
    const isCheckIn = status === 'CHECKED_IN';
    return (
      <Chip 
        label={isCheckIn ? "VÀO CẢNG" : "ĐÃ XUẤT BẾN"} 
        variant="filled"
        sx={{ 
          fontWeight: 'bold', fontSize: '11px', borderRadius: '6px', height: '24px',
          bgcolor: isCheckIn ? 'rgba(46, 125, 50, 0.15)' : 'rgba(2, 136, 209, 0.15)',
          color: isCheckIn ? theme.palette.success.main : theme.palette.info.main,
          border: `1px solid ${isCheckIn ? 'rgba(46, 125, 50, 0.3)' : 'rgba(2, 136, 209, 0.3)'}`
        }} 
      />
    );
  };

  return (
    <>
      {/* KHỐI CARD THÔNG TIN TỔNG QUAN NGOÀI DANH SÁCH */}
      <Card 
        sx={{ 
          bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`,
          borderRadius: 3, boxShadow: 'none', transition: 'all 0.2s ease-in-out',
          '&:hover': { borderColor: theme.palette.primary.main }
        }}
      >
        <CardContent sx={{ p: { xs: '16px !important', sm: '20px !important' } }}>
          <Grid container spacing={{ xs: 2.5, md: 2 }} sx={{ alignItems: 'center' }}>
            {/* Cột 1: Trạng thái & Thời gian */}
            <Grid size={{ xs: 12, sm: 3, md: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 1.5, flexWrap: 'wrap' }}>
                {renderStatusChip(rawItem.status)}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, gap: { xs: 1, sm: 0.2 }, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: theme.palette.text.secondary, fontSize: '13px', fontWeight: 600 }}>{rawItem.detected_at?.split(' ')[1]}</Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '11px' }}>{rawItem.detected_at?.split(' ')[0]}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Cột 2: Cổng & Biển số */}
            <Grid size={{ xs: 12, sm: 9, md: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar variant="rounded" src={rawItem.plate?.plate_image_url || undefined} sx={{ width: 56, height: 56, bgcolor: theme.palette.mode === 'dark' ? '#222' : '#eaeaea', border: `1px solid ${theme.palette.customBg.border}` }}><PinIcon /></Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <MeetingRoomIcon fontSize="small" sx={{ color: theme.palette.text.secondary, width: 16 }} />
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{rawItem.gate_name}</Typography>
                  </Box>
                  <Box sx={{ display: 'inline-flex', bgcolor: rawItem.plate?.number ? 'rgba(255, 153, 0, 0.1)' : 'rgba(0,0,0,0.05)', px: 1, py: 0.2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: rawItem.plate?.number ? '#ff9900' : theme.palette.text.secondary }}>{rawItem.plate?.number || 'ĐI BỘ / NO-PLATE'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Cột 3: Tài xế */}
            <Grid size={{ xs: 12, sm: 8, md: 3.5 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar src={rawItem.person?.cccd_face_image_url || undefined} sx={{ width: 54, height: 54 }}><PersonIcon /></Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 700, mb: 0.5 }}>{rawItem.person?.full_name || 'CHƯA QUÉT ĐỊNH DANH'}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CreditCardIcon sx={{ color: theme.palette.text.secondary, fontSize: '15px' }} />
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{rawItem.person?.cccd_number || 'N/A'}</Typography>
                    </Box>
                    {rawItem.ticket && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, bgcolor: 'rgba(0,0,0,0.03)', px: 0.5, borderRadius: 0.5 }}>
                        <LocalAtmIcon sx={{ color: theme.palette.text.secondary, fontSize: '13px' }} />
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{rawItem.ticket.ticket_code}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Cột 4: ID Phiên */}
            <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: { md: 'right' }, borderLeft: { md: `1px dashed ${theme.palette.customBg.border}` }, pl: { md: 2 } }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>MÃ PHIÊN</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: theme.palette.primary.main, fontWeight: 700 }}>#{rawItem.session_id?.split('-')[1] || rawItem.session_id}</Typography>
            </Grid>

            {/* Cột 5: Nút bấm */}
            <Grid size={{ xs: 12, md: 1.5 }} sx={{ textAlign: 'right' }}>
              <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} onClick={handleOpen} fullWidth sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>Chi tiết</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* POPUP CHI TIẾT ĐỐI SOÁT TOÀN DIỆN */}
      <Dialog open={openDetail} onClose={handleClose} fullWidth maxWidth="md" slotProps={{ paper: { sx: { borderRadius: 4, backgroundImage: 'none' } } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FingerprintIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>CHI TIẾT PHIÊN ĐỐI SOÁT THỜI GIAN THỰC</Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 12, top: 12, color: theme.palette.text.secondary }}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            
            {/* 1. Thông tin phương tiện & cổng camera */}
            <VehicleGateInfo item={rawItem} renderStatusChip={renderStatusChip} />

            {/* 2. Thông tin tài xế & định danh định dạng sinh trắc AI */}
            <DriverIdentityInfo item={rawItem} />

            {/* 3. Thông tin Vé bến & module kiểm tra thanh toán (Mới tách) */}
            <TicketMatchInfo item={rawItem} />

          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}