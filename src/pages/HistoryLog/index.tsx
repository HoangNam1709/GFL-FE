// src/pages/HistoryLog/index.tsx

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// 🌟 Import Service
import { historyService, type FetchHistoryParams } from '../../services/HistoryService';

import HistoryFilter from './HistoryFilter';
import HistoryList from './HistoryList';
import type { HistoryLogItem, PaginationInfo } from './types';

export default function HistoryLogPage() {
  const theme = useTheme();

  // Quản lý States dữ liệu
  const [logs, setLogs] = useState<HistoryLogItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Quản lý States bộ lọc
  const [filterGate, setFilterGate] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchCar, setSearchCar] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Hook gọi dữ liệu từ API Backend qua Service lớp trung gian
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query params chuẩn hóa theo interface của Service
        const queryParams: FetchHistoryParams = { page, limit: 10 };
        if (filterGate !== 'all') queryParams.gate_id = filterGate;
        if (filterDate) queryParams.date = filterDate;
        if (searchCar) queryParams.search = searchCar;

        // 🌟 Gọi qua lớp Service sạch sẽ
        const responseData = await historyService.getHistoryLogs(queryParams);

        if (responseData && responseData.status === 'SUCCESS') {
          setLogs(responseData.data);
          setPagination(responseData.pagination);
        } else {
          setError('Cấu trúc dữ liệu Backend không hợp lệ.');
        }
      } catch (err: any) {
        console.error('Lỗi API qua Service:', err);
        setError('Không thể kết nối tới máy chủ hoặc dữ liệu không tồn tại.');
      } finally {
        setLoading(false);
      }
    };

    // Cơ chế Debounce hạn chế spam API liên tục khi gõ ô tìm kiếm
    const delayDebounce = setTimeout(() => {
      fetchLogs();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filterGate, filterDate, searchCar, page]);

  // Bộ hàm xử lý thay đổi bộ lọc (Reset số trang về 1)
  const handleGateChange = (value: string) => { setFilterGate(value); setPage(1); };
  const handleDateChange = (value: string) => { setFilterDate(value); setPage(1); };
  const handleSearchChange = (value: string) => { setSearchCar(value); setPage(1); };

  return (
    <Box sx={{ p: 4, bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#f8f9fa', minHeight: '100vh' }}>

      {/* TIÊU ĐỀ TRANG */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            letterSpacing: '0.5px',
            fontFamily: '"Inter", "Roboto", sans-serif',
            textTransform: 'uppercase'
          }}
        >
          Nhật ký kiểm soát xe ra vào bến
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mt: 0.5,
            fontFamily: '"Inter", "Roboto", sans-serif'
          }}
        >
          Hệ thống theo dõi và đối soát thông tin tài xế kết hợp quét OCR biển số tự động theo thời gian thực.
        </Typography>
      </Box>

      {/* 1. KHU VỰC BỘ LỌC TÌM KIẾM */}
      <HistoryFilter
        filterGate={filterGate}
        filterDate={filterDate}
        searchCar={searchCar}
        onGateChange={handleGateChange}
        onDateChange={handleDateChange}
        onSearchChange={handleSearchChange}
      />

      {/* 2. KHU VỰC DANH SÁCH & PHÂN TRANG */}
      <HistoryList
        logs={logs}
        loading={loading}
        error={error}
        pagination={pagination}
        page={page}
        onPageChange={setPage}
      />

    </Box>
  );
}