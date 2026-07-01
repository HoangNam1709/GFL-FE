import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, useTheme } from '@mui/material';

import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 260;
const HEADER_HEIGHT = 56; // fix cứng chiều cao đã đồng bộ với Header

export default function SecurityLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.customBg.main }}>
      <CssBaseline />

      {/* 1. Thanh công cụ phía trên */}
      <Header open={open} onToggleDrawer={handleToggleDrawer} />

      {/* 2. Thanh điều hướng bên trái */}
      <Sidebar open={open} drawerWidth={DRAWER_WIDTH} />

      {/* 3. Vùng hiển thị nội dung chính (Đã tối ưu hóa lề) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2, // 🌟 Giảm từ 3 xuống 2 (16px) để nội dung sát biên tinh gọn, rộng rãi
          color: theme.palette.text.primary,
          minWidth: 0, // Chống vỡ layout bảng dữ liệu lớn
          
          // 🌟 Tính toán lề trái động: Nếu Sidebar mở thì dịch vào 260px, nếu đóng thì sát lề 0px
          marginLeft: open ? 0 : `-${DRAWER_WIDTH}px`, 
          
          paddingTop: `${HEADER_HEIGHT + 16}px`, 
          
          transition: (t) => t.transitions.create(['margin', 'padding'], {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}