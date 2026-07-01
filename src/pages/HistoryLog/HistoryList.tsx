import { 
  Box, Typography, Paper, CircularProgress, Pagination,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { HistoryLogItem, PaginationInfo } from './types';
import HistoryRow from './HistoryRow';

interface HistoryListProps {
  logs: HistoryLogItem[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  page: number;
  onPageChange: (newPage: number) => void;
}

export default function HistoryList({
  logs,
  loading,
  error,
  pagination,
  page,
  onPageChange,
}: HistoryListProps) {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="primary" thickness={4} size={45} />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', color: theme.palette.error.main, bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.error.main}`, borderRadius: '4px' }}>
        <Typography sx={{ fontWeight: "bold" }}>{error}</Typography>
      </Paper>
    );
  }

  if (logs.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center', color: theme.palette.text.secondary, bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: '4px' }}>
        <Typography variant="body2">Không tìm thấy dữ liệu lịch sử nào trùng khớp.</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      
      {/* 📊 BẢNG DỮ LIỆU CHUẨN ENTERPRISE */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '4px', 
          boxShadow: 'none', 
          border: `1px solid ${theme.palette.customBg.border}`,
          bgcolor: theme.palette.customBg.card,
          overflowX: 'auto' // Hỗ trợ scroll ngang nếu màn hình nhỏ
        }}
      >
        <Table size="small" sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5' }}>
            <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 700, py: 1.2, color: theme.palette.text.primary, borderColor: theme.palette.customBg.border } }}>
              <TableCell align="center" sx={{ width: 60 }}>STT</TableCell>
              <TableCell sx={{ width: 140 }}>MÃ PHIÊN</TableCell>
              <TableCell sx={{ width: 130 }}>TRẠNG THÁI</TableCell>
              <TableCell sx={{ width: 180 }}>BIỂN SỐ / PHƯƠNG TIỆN</TableCell>
              <TableCell sx={{ width: 220 }}>TÀI XẾ / KHÁCH HÀNG</TableCell>
              <TableCell sx={{ width: 140 }}>VỊ TRÍ CỔNG</TableCell>
              <TableCell sx={{ width: 160 }}>THỜI GIAN VÀO</TableCell>
              <TableCell sx={{ width: 160 }}>THỜI GIAN RA</TableCell>
              <TableCell align="right" sx={{ width: 100 }}>THAO TÁC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Vòng lặp truyền item kèm index vào HistoryRow */}
            {logs.map((item, index) => (
              <HistoryRow 
                key={item.session_id} 
                item={item} 
                index={(page - 1) * (pagination.limit || 10) + index} // Tính STT liên tục khi qua trang mới
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PHÂN TRANG (PAGINATION) CHUẨN ENTERPRISE */}
      {pagination.total_pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Pagination 
            count={pagination.total_pages} 
            page={page} 
            onChange={(_, value) => onPageChange(value)} 
            color="primary" 
            shape="rounded"
            size="small" // Thu nhỏ size phân trang lại cho tinh gọn
            sx={{
              '& .MuiPaginationItem-root': { 
                borderRadius: '4px', // Vuông vức đồng bộ Enterprise
                fontWeight: 600 
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}