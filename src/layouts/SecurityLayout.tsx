// src/layouts/SecurityLayout/index.tsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, CssBaseline, useTheme } from '@mui/material';

// Import 2 Component độc lập vừa bóc tách
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 280;

export default function SecurityLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.customBg.main }}>
      <CssBaseline />

      {/* 1. Nối thanh công cụ phía trên */}
      <Header open={open} onToggleDrawer={handleToggleDrawer} />

      {/* 2. Nối thanh điều hướng bên trái */}
      <Sidebar open={open} drawerWidth={DRAWER_WIDTH} />

      {/* 3. Vùng hiển thị nội dung chính của router con */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          color: theme.palette.text.primary,
          marginLeft: 0,
          transition: (t) => t.transitions.create('margin', {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}