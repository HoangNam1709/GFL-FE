import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, useTheme } from '@mui/material';

import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 260;
const HEADER_HEIGHT = 56; 

export default function SecurityLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <CssBaseline />

      {/* 1. Thanh công cụ phía trên */}
      <Header open={open} onToggleDrawer={handleToggleDrawer} />

      {/* 2. Thanh điều hướng bên trái */}
      <Sidebar open={open} drawerWidth={DRAWER_WIDTH} />

      {/* 3. Vùng hiển thị nội dung chính - Fix lỗi co vỡ khung hình */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2, 
          color: theme.palette.text.primary,
          minWidth: 0, // Đảm bảo an toàn, chống vỡ các bảng dữ liệu lớn (Datagrid/Table)
          
          // Fix lỗi: Khi đóng/mở, ta thay đổi width động thay vì giật lùi marginLeft âm
          width: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          
          paddingTop: `${HEADER_HEIGHT + 16}px`, 
          
          // Đồng bộ transition mượt mà chuẩn Material Design
          transition: (t) =>
            t.transitions.create(['width', 'margin'], {
              easing: open ? t.transitions.easing.easeOut : t.transitions.easing.sharp,
              duration: open ? t.transitions.duration.enteringScreen : t.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}