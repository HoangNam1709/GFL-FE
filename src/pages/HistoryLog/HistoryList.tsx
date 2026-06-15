// src/pages/HistoryLog/HistoryList.tsx

import { Box, Typography, Paper, CircularProgress, Pagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HistoryCard from './HistoryCard';
import type { HistoryLogItem, PaginationInfo } from './types';

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
      <Paper sx={{ p: 4, textAlign: 'center', color: theme.palette.error.main, bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.error.main}`, borderRadius: 3 }}>
        <Typography sx={{fontWeight:"bold"}}>{error}</Typography>
      </Paper>
    );
  }

  if (logs.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center', color: theme.palette.text.secondary, bgcolor: theme.palette.customBg.card, border: `1px solid ${theme.palette.customBg.border}`, borderRadius: 3 }}>
        <Typography variant="body1">Không tìm thấy dữ liệu lịch sử nào trùng khớp.</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Vòng lặp gọi HistoryCard */}
      {logs.map((item) => (
        <HistoryCard key={item.session_id} item={item} />
      ))}

      {/* Phân trang */}
      {pagination.total_pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Pagination 
            count={pagination.total_pages} 
            page={page} 
            onChange={(_, value) => onPageChange(value)} 
            color="primary" 
            shape="rounded"
            size="medium"
            sx={{
              '& .MuiPaginationItem-root': { borderRadius: 2, fontWeight: 'bold' }
            }}
          />
        </Box>
      )}
    </Box>
  );
}