import { useState } from 'react';
import { 
  Box, Typography, TableRow, TableCell, Chip, Avatar, 
  Button, Dialog, DialogTitle, DialogContent, IconButton, Divider, Grid 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PinIcon from '@mui/icons-material/Pin';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import type { HistoryLogItem } from './types';

import VehicleGateInfo from './VehicleGateInfo';
import DriverIdentityInfo from './DriverIdentityInfo';
import TicketMatchInfo from './TicketMatchInfo';

interface HistoryRowProps {
  item: HistoryLogItem;
  index: number;
}

export default function HistoryRow({ item, index }: HistoryRowProps) {
  const theme = useTheme();
  const rawItem = item as any; 
  
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const handleOpen = () => setOpenDetail(true);
  const handleClose = () => setOpenDetail(false);

  // Giao diện Enterprise tối giản Badge trạng thái (Sử dụng kích thước nhỏ - small)
  const renderStatusChip = (status: string) => {
    const isCheckedOut = status === 'CHECKED_OUT' || rawItem.checked_out_at !== null;
    return (
      <Chip 
        label={isCheckedOut ? "ĐÃ XUẤT BẾN" : "TRONG BẾN"} 
        size="small"
        sx={{ 
          fontWeight: 700, fontSize: '11px', borderRadius: '4px',
          bgcolor: isCheckedOut ? 'rgba(2, 136, 209, 0.1)' : 'rgba(46, 125, 50, 0.1)',
          color: isCheckedOut ? theme.palette.info.main : theme.palette.success.main,
          border: `1px solid ${isCheckedOut ? 'rgba(2, 136, 209, 0.2)' : 'rgba(46, 125, 50, 0.2)'}`
        }} 
      />
    );
  };

  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return { date: '--/--/----', time: '--:--:--' };
    const parts = dateTimeStr.split(' ');
    return { time: parts[1] || '', date: parts[0] || '' };
  };

  const inTime = formatDateTime(rawItem.checked_in_at || rawItem.detected_at);
  const outTime = formatDateTime(rawItem.checked_out_at);

  return (
    <>
      <TableRow 
        hover
        sx={{ 
          '&:nth-of-type(even)': { bgcolor: theme.palette.action.hover },
          '& .MuiTableCell-root': { py: 1, px: 1.5, borderColor: theme.palette.divider }
        }}
      >
        {/* STT */}
        <TableCell align="center">
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
            {index + 1}
          </Typography>
        </TableCell>

        {/* MÃ PHIÊN */}
        <TableCell>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: theme.palette.primary.main, fontWeight: 700, fontSize: '13px' }}>
            #{rawItem.session_code?.split('-')[1] || rawItem.session_id?.split('-')[1] || rawItem.session_id?.substring(0, 8)}
          </Typography>
        </TableCell>

        {/* TRẠNG THÁI */}
        <TableCell>{renderStatusChip(rawItem.status)}</TableCell>

        {/* BIỂN SỐ / PHƯƠNG TIỆN */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar variant="rounded" src={rawItem.plate?.plate_image_url || undefined} sx={{ width: 32, height: 32, fontSize: '14px', bgcolor: theme.palette.mode === 'dark' ? '#222' : '#eaeaea' }}><PinIcon fontSize="small" /></Avatar>
            <Box sx={{ display: 'inline-flex', bgcolor: rawItem.expected_plate_number || rawItem.plate?.number ? 'rgba(255, 153, 0, 0.08)' : 'rgba(0,0,0,0.04)', px: 0.8, py: 0.1, borderRadius: '4px' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: (rawItem.expected_plate_number || rawItem.plate?.number) ? '#d97706' : theme.palette.text.secondary }}>
                {rawItem.expected_plate_number || rawItem.plate?.number || 'ĐI BỘ'}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        {/* ĐỊNH DANH TÀI XẾ */}
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar src={rawItem.person?.cccd_face_image_url || undefined} sx={{ width: 28, height: 28 }}><PersonIcon fontSize="small" /></Avatar>
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '13px' }}>
                {rawItem.full_name || rawItem.person?.full_name || 'CHƯA ĐỊNH DANH'}
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '11px' }}>
                {rawItem.cccd_number || rawItem.person?.cccd_number || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        {/* VỊ TRÍ CỔNG */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MeetingRoomIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>{rawItem.gate_name || "Cổng chính"}</Typography>
          </Box>
        </TableCell>

        {/* THỜI GIAN VÀO */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LoginIcon sx={{ color: theme.palette.success.main, fontSize: 14 }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '13px' }}>
              {inTime.time} <Box component="span" sx={{ fontSize: '11px', color: 'text.secondary' }}>{inTime.date}</Box>
            </Typography>
          </Box>
        </TableCell>

        {/* THỜI GIAN RA */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LogoutIcon sx={{ color: rawItem.checked_out_at ? theme.palette.info.main : theme.palette.text.disabled, fontSize: 14 }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '13px', color: rawItem.checked_out_at ? 'inherit' : theme.palette.text.disabled }}>
              {rawItem.checked_out_at ? `${outTime.time} ` : 'Chưa ra '}
              {rawItem.checked_out_at && <Box component="span" sx={{ fontSize: '11px', color: 'text.secondary' }}>{outTime.date}</Box>}
            </Typography>
          </Box>
        </TableCell>

        {/* HÀNH ĐỘNG */}
        <TableCell align="right">
          <Button 
            variant="text" 
            size="small" 
            startIcon={<VisibilityIcon />} 
            onClick={handleOpen}
            sx={{ textTransform: 'none', fontWeight: 600, py: 0.2 }}
          >
            Chi tiết
          </Button>
        </TableCell>
      </TableRow>

      {/* POPUP CHI TIẾT ĐỐI SOÁT (Giữ nguyên cấu trúc nhưng giảm borderRadius chuẩn Enterprise) */}
      <Dialog open={openDetail} onClose={handleClose} fullWidth maxWidth="md" slotProps={{ paper: { sx: { borderRadius: '6px', backgroundImage: 'none' } } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FingerprintIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '15px' }}>CHI TIẾT PHIÊN ĐỐI SOÁT THỜI GIAN THỰC</Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 12, top: 12, color: theme.palette.text.secondary }}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={2}>
            <VehicleGateInfo item={rawItem} renderStatusChip={renderStatusChip} />
            <DriverIdentityInfo item={rawItem} />
            <TicketMatchInfo item={rawItem} />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}