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
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import type { HistoryLogItem } from './types';

import VehicleGateInfo from './VehicleGateInfo';
import DriverIdentityInfo from './DriverIdentityInfo';
import TicketMatchInfo from './TicketMatchInfo';

interface HistoryCardProps {
  item: HistoryLogItem;
}

export default function HistoryCard({ item }: HistoryCardProps) {
  const theme = useTheme();
  const rawItem = item as any; 
  
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const handleOpen = () => setOpenDetail(true);
  const handleClose = () => setOpenDetail(false);

  // Hàm hiển thị Badge trạng thái động dựa trên việc xe đã checkout hay chưa
  const renderStatusChip = (status: string) => {
    const isCheckedOut = status === 'CHECKED_OUT' || rawItem.checked_out_at !== null;
    return (
      <Chip 
        label={isCheckedOut ? "ĐÃ XUẤT BẾN" : "TRONG BẾN"} 
        variant="filled"
        sx={{ 
          fontWeight: 'bold', fontSize: '11px', borderRadius: '6px', height: '24px',
          bgcolor: isCheckedOut ? 'rgba(2, 136, 209, 0.15)' : 'rgba(46, 125, 50, 0.15)',
          color: isCheckedOut ? theme.palette.info.main : theme.palette.success.main,
          border: `1px solid ${isCheckedOut ? 'rgba(2, 136, 209, 0.3)' : 'rgba(46, 125, 50, 0.3)'}`
        }} 
      />
    );
  };

  // Hàm tách ngày và giờ để hiển thị gọn gàng
  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return { date: '--/--/----', time: '--:--:--' };
    const parts = dateTimeStr.split(' ');
    return {
      time: parts[1] || '',
      date: parts[0] || ''
    };
  };

  const inTime = formatDateTime(rawItem.checked_in_at || rawItem.detected_at);
  const outTime = formatDateTime(rawItem.checked_out_at);

  return (
    <>
      <Card 
        sx={{ 
          bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`,
          borderRadius: 3, boxShadow: 'none', mb: 2, transition: 'all 0.2s ease-in-out',
          '&:hover': { borderColor: theme.palette.primary.main }
        }}
      >
        <CardContent sx={{ p: { xs: '16px !important', sm: '20px !important' } }}>
          <Grid container spacing={{ xs: 2.5, md: 2 }} sx={{ alignItems: 'center' }}>
            
            {/* 🌟 CỘT 1: TRẠNG THÁI & TIMELINE VÀO - RA SONG SONG */}
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>{renderStatusChip(rawItem.status)}</Box>
                
                {/* Khối hiển thị song song Vào / Ra */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* Thời gian vào */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LoginIcon sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>Vào:</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {inTime.time} <Box component="span" sx={{ fontSize: '11px', fontWeight: 400, color: 'text.secondary' }}>({inTime.date})</Box>
                    </Typography>
                  </Box>

                  {/* Thời gian ra */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LogoutIcon sx={{ color: rawItem.checked_out_at ? theme.palette.info.main : theme.palette.text.disabled, fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>Ra:</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: rawItem.checked_out_at ? 'inherit' : theme.palette.text.disabled }}>
                      {rawItem.checked_out_at ? `${outTime.time} ` : 'Chưa ra '} 
                      {rawItem.checked_out_at && <Box component="span" sx={{ fontSize: '11px', fontWeight: 400, color: 'text.secondary' }}>({outTime.date})</Box>}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Cột 2: Cổng & Biển số */}
            <Grid size={{ xs: 12, sm: 8, md: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Avatar variant="rounded" src={rawItem.plate?.plate_image_url || undefined} sx={{ width: 52, height: 52, bgcolor: theme.palette.mode === 'dark' ? '#222' : '#eaeaea', border: `1px solid ${theme.palette.customBg.border}` }}><PinIcon /></Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <MeetingRoomIcon fontSize="small" sx={{ color: theme.palette.text.secondary, width: 14 }} />
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '13px' }}>{rawItem.gate_name || "Cổng kiểm soát"}</Typography>
                  </Box>
                  <Box sx={{ display: 'inline-flex', bgcolor: rawItem.expected_plate_number || rawItem.plate?.number ? 'rgba(255, 153, 0, 0.1)' : 'rgba(0,0,0,0.05)', px: 1, py: 0.2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: (rawItem.expected_plate_number || rawItem.plate?.number) ? '#ff9900' : theme.palette.text.secondary }}>
                      {rawItem.expected_plate_number || rawItem.plate?.number || 'ĐI BỘ / NO-PLATE'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Cột 3: Tài xế */}
            <Grid size={{ xs: 12, sm: 8, md: 3 }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Avatar src={rawItem.person?.cccd_face_image_url || undefined} sx={{ width: 50, height: 50 }}><PersonIcon /></Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 700, mb: 0.5 }}>{rawItem.full_name || rawItem.person?.full_name || 'CHƯA QUÉT ĐỊNH DANH'}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CreditCardIcon sx={{ color: theme.palette.text.secondary, fontSize: '14px' }} />
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{rawItem.cccd_number || rawItem.person?.cccd_number || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Cột 4: ID Phiên */}
            <Grid size={{ xs: 12, sm: 4, md: 2 }} sx={{ textAlign: { md: 'right' }, borderLeft: { md: `1px dashed ${theme.palette.customBg.border}` }, pl: { md: 2 } }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>MÃ PHIÊN</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: theme.palette.primary.main, fontWeight: 700 }}>
                #{rawItem.session_code?.split('-')[1] || rawItem.session_id?.split('-')[1] || rawItem.session_id}
              </Typography>
            </Grid>

            {/* Cột 5: Nút bấm */}
            <Grid size={{ xs: 12, md: 1.5 }} sx={{ textAlign: 'right' }}>
              <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} onClick={handleOpen} fullWidth sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>Chi tiết</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* POPUP CHI TIẾT ĐỐI SOÁT */}
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
            <VehicleGateInfo item={rawItem} renderStatusChip={renderStatusChip} />
            <DriverIdentityInfo item={rawItem} />
            <TicketMatchInfo item={rawItem} />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}