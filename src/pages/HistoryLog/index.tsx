import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function HistoryLogPage() {
  const theme = useTheme();
  const [logs, setLogs] = useState<Array<string>>([]);

  // 🌟 KHAI BÁO CÁC STATE QUẢN LÝ BỘ LỌC
  const [filterGate, setFilterGate] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>(''); // Định dạng 'YYYY-MM-DD'
  const [searchCar, setSearchCar] = useState<string>('');

  useEffect(() => {
    const loadLogs = () => {
      const data = localStorage.getItem('vehicle_logs');
      if (data) {
        const storedLogs = JSON.parse(data);
        if (Array.isArray(storedLogs)) {
          setLogs(storedLogs);
        }
      } else {
        setLogs([]);
      }
    };

    loadLogs();
    window.addEventListener('local-storage-update', loadLogs);
    window.addEventListener('storage', loadLogs);

    return () => {
      window.removeEventListener('local-storage-update', loadLogs);
      window.removeEventListener('storage', loadLogs);
    };
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử ra vào không?")) {
      localStorage.removeItem('vehicle_logs');
      setLogs([]);
    }
  };

  // 🌟 LOGIC LỌC DỮ LIỆU ĐỘNG (Dùng useMemo để tối ưu hiệu năng khi mảng logs lớn)
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const logText = String(log).toUpperCase();

      // 1. Lọc theo cổng (Giả sử log của bạn có chứa các từ khóa như 'GATE-1', 'GATE-2' hoặc 'CỔNG VÀO LÀN 01')
      let matchesGate = true;
      if (filterGate !== 'all') {
        matchesGate = logText.includes(filterGate.toUpperCase());
      }

      // 2. Lọc theo ngày (Tìm kiếm chuỗi ngày tháng dạng DD/MM/YYYY hoặc YYYY-MM-DD trong chuỗi log)
      let matchesDate = true;
      if (filterDate) {
        // Chuyển đổi 'YYYY-MM-DD' từ input sang định dạng ngày Việt Nam 'DD/MM/YYYY' nếu log lưu kiểu đó
        const [year, month, day] = filterDate.split('-');
        const formattedDate = `${day}/${month}/${year}`; // 10/06/2026

        // Kiểm tra xem log có chứa chuỗi ngày không (bao gồm cả trường hợp log lưu dạng YYYY-MM-DD)
        matchesDate = logText.includes(formattedDate) || logText.includes(filterDate);
      }

      // 3. Lọc theo Biển số xe hoặc tên tài xế (Tìm kiếm tương đối không phân biệt hoa thường)
      const matchesSearch = logText.includes(searchCar.toUpperCase());

      return matchesGate && matchesDate && matchesSearch;
    });
  }, [logs, filterGate, filterDate, searchCar]);

  return (
    <Box sx={{ p: 3 }}>
      {/* TIÊU ĐỀ TRANG */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: `2px solid ${theme.palette.primary.main}`, pb: 2 }}>
        <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          QUẢN LÝ LỊCH SỬ XE RA VÀO BẾN (REAL-TIME)
        </Typography>

        {logs.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearHistory}
          >
            Xóa lịch sử
          </Button>
        )}
      </Box>

      {/* 🌟 KHU VỰC THANH BỘ LỌC (FILTER BAR) */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: theme.palette.customBg.card,
          border: `1px solid ${theme.palette.customBg.border}`,
          borderRadius: 2
        }}
      >
        <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <FilterAltIcon fontSize="small" /> BỘ LỌC TÌM KIẾM
        </Typography>

        <Grid container spacing={2}>
          {/* Lọc theo Cổng */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="gate-select-label" sx={{ color: theme.palette.text.secondary }}>Chọn Cổng/Làn</InputLabel>
              <Select
                labelId="gate-select-label"
                value={filterGate}
                label="Chọn Cổng/Làn"
                onChange={(e) => setFilterGate(e.target.value)}
                sx={{
                  color: theme.palette.text.primary,
                  bgcolor: theme.palette.mode === 'dark' ? '#222' : '#f9f9f9'
                }}
              >
                <MenuItem value="all">Tất cả các cổng</MenuItem>
                <MenuItem value="gate-1">Cổng Vào Làn 01</MenuItem>
                <MenuItem value="gate-2">Cổng Vào Làn 02</MenuItem>
                <MenuItem value="gate-3">Cổng Vào Làn 03</MenuItem>
                <MenuItem value="gate-4">Khu Vực Hậu Cần 01</MenuItem>
                <MenuItem value="gate-5">Bãi Xe Xitéc A</MenuItem>
                <MenuItem value="gate-6">Bãi Xe Xitéc B</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Lọc theo Ngày */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Chọn Ngày Ra Vào"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}

              slotProps={{
                inputLabel: {
                  shrink: true,
                  sx: { color: theme.palette.primary.main } // Nếu muốn chỉnh màu chữ cho label
                },
                input: {
                  sx: {
                    color: theme.palette.text.primary,
                    bgcolor: theme.palette.mode === 'dark' ? '#222' : '#f9f9f9'
                  }
                }
              }}
            />
          </Grid>

          {/* Tìm kiếm theo Xe / Tài xế */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Biển số xe / Tên tài xế"
              placeholder="Nhập biển số hoặc tên..."
              value={searchCar}
              onChange={(e) => setSearchCar(e.target.value)}
              slotProps={{
                input: {
                  sx: {
                    color: theme.palette.text.primary,
                    bgcolor: theme.palette.mode === 'dark' ? '#222' : '#f9f9f9'
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* DANH SÁCH HIỂN THỊ LOG SAU KHI LỌC */}
      {filteredLogs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: theme.palette.text.secondary, bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: 2 }}>
          <Typography variant="body1">Không tìm thấy lịch sử xe ra vào nào khớp với bộ lọc.</Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ bgcolor: theme.palette.customBg.card, color: theme.palette.text.primary, borderRadius: 2, border: `1px solid ${theme.palette.customBg.border}` }}>
          <List sx={{ p: 0 }}>
            {filteredLogs.map((log, index) => {
              const currentLogText = String(log);
              const isCheckIn = currentLogText.includes('[IN THẺ]');
              // Light mode dùng màu thành công sẫm hơn để tăng tương phản, Dark mode dùng màu tươi sáng
              const textColor = isCheckIn
                ? (theme.palette.mode === 'light' ? '#1b5e20' : theme.palette.success.main)
                : theme.palette.text.primary;

              return (
                <Box key={index}>
                  <ListItem sx={{ py: 1.5, px: 3, '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' } }}>
                    <ListItemText>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          color: textColor,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {currentLogText}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                  {index < filteredLogs.length - 1 && <Divider sx={{ bgcolor: theme.palette.customBg.border }} />}
                </Box>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
}