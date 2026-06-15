// src/pages/HistoryLog/HistoryFilter.tsx

import { Paper, Typography, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface HistoryFilterProps {
  filterGate: string;
  filterDate: string;
  searchCar: string;
  onGateChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function HistoryFilter({
  filterGate,
  filterDate,
  searchCar,
  onGateChange,
  onDateChange,
  onSearchChange,
}: HistoryFilterProps) {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2.5, 
        mb: 4, 
        bgcolor: theme.palette.customBg.card, 
        border: `1px solid ${theme.palette.customBg.border}`, 
        borderRadius: 3,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)'
      }}
    >
      <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
        <FilterAltIcon fontSize="small" /> BỘ LỌC KIỂM SOÁT DỮ LIỆU
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="gate-select-label" sx={{ color: theme.palette.text.secondary }}>Chọn Cổng/Làn</InputLabel>
            <Select
              labelId="gate-select-label"
              value={filterGate}
              label="Chọn Cổng/Làn"
              onChange={(e) => onGateChange(e.target.value)}
              sx={{ color: theme.palette.text.primary, borderRadius: 2 }}
            >
              <MenuItem value="all">Tất cả các cổng</MenuItem>
              <MenuItem value="gate-001">Cổng vào 01</MenuItem>
              <MenuItem value="gate-002">Cổng vào 02</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Chọn Ngày Ra Vào"
            value={filterDate}
            onChange={(e) => onDateChange(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Biển số / CCCD / Tên tài xế"
            placeholder="Tìm kiếm nhanh..."
            value={searchCar}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}