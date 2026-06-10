import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  IconButton,
  useTheme, // 🌟 Import useTheme để lấy palette động
  alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import ThemeToggleButton from '../components/ThemeToggleButton'; // 🌟 Import nút đổi theme vào đây
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import VideocamIcon from '@mui/icons-material/Videocam';
const DRAWER_WIDTH = 280;

export default function SecurityLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme(); // 🌟 Kích hoạt bộ theo dõi Theme động

  const [open, setOpen] = useState<boolean>(true);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Tổng Quan Camera', path: '/camera-overview', icon: <VideocamIcon /> },
    { text: 'Lịch Sử Ra Vào', path: '/log-history', icon: <HistoryIcon /> },
    { text: 'Đăng Ký Xe', path: '/register-car', icon: <NoCrashIcon /> },
    {text: 'Đăng Ký Người', path: '/people-register', icon: <DirectionsRunIcon />},
    { text: 'Quản Lý Hệ Thống', path: '/system-management', icon: <SettingsIcon /> },
  ];

  return (
    // 🌟 Đổi nền tổng của Layout động theo hệ thống
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.customBg.main }}>
      <CssBaseline />

      {/* 2. THANH HEADER PHÍA TRÊN */}
      <AppBar
        position="fixed"
        sx={{
          // 🌟 Đổi màu nền Header động (Trắng tinh <-> Đen Card)
          bgcolor: theme.palette.customBg.card,
          borderBottom: `2px solid ${theme.palette.customBg.border}`,
          zIndex: (t) => t.zIndex.drawer + 1,
          boxShadow: theme.palette.mode === 'light' ? '0px 2px 4px rgba(0,0,0,0.05)' : 'none'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Nút bấm ẩn/hiện Sidebar */}
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleToggleDrawer}
              edge="start"
              sx={{ mr: 2, color: theme.palette.primary.main }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>

            {/* Tiêu đề hệ thống */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold'
              }}
            >
              HỆ THỐNG GIÁM SÁT AN NINH XE RA VÀO SÂN BAY
            </Typography>
          </Box>

          {/* 🌟 ĐẶT NÚT ĐỔI THEME GỌN GÀNG Ở GÓC PHẢI THANH HEADER */}
          <Box>
            <ThemeToggleButton />
          </Box>
        </Toolbar>
      </AppBar>

      {/* 3. THANH SIDEBAR BÊN TRÁI */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          transition: (t) => t.transitions.create('width', {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.enteringScreen,
          }),
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            // 🌟 Đổi nền Sidebar đồng bộ với màu Card của hệ thống
            bgcolor: theme.palette.customBg.card,
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.customBg.border}`
          },
        }}
      >
        <Toolbar />

        <Toolbar sx={{ justifyContent: 'center', borderBottom: `1px solid ${theme.palette.customBg.border}`, minHeight: '48px !important' }}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, fontWeight: 'bold' }}>
            🛡️ KHU VỰC ĐIỀU HÀNH
          </Typography>
        </Toolbar>

        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isSelected}
                    sx={{
                      mx: 1,
                      borderRadius: '8px',
                      mb: 1,
                      color: 'text.primary', // 💡 MUI tự hiểu, không cần ghi theme.palette.text.primary cho dài dòng

                      // Cấu hình màu sắc động khi menu được chọn (Active)
                      '&.Mui-selected': {
                        // 💡 Dùng alpha() để gọi màu từ theme.tsx ra, sau này đổi màu ở theme là chỗ này tự đổi theo
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.primary.main, 0.15) // Lấy màu Cam chính phối 15% độ trong suốt
                          : alpha('#222121', 0.12),

                        color: 'primary.main', // 💡 Viết ngắn gọn thay cho theme.palette.primary.main

                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.primary.main, 0.25)
                            : alpha('#242323', 0.2)
                        },
                        // Ép màu icon chuyển sang màu chủ đạo đồng bộ với chữ
                        '& .MuiListItemIcon-root': { color: 'primary.main' }
                      },

                      // Hiệu ứng hover khi menu chưa được click chọn
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha('#ffffff', 0.05)
                          : alpha('#000000', 0.09),
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      slotProps={{ primary: { sx: { fontWeight: isSelected ? 700 : 500 } } }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* 4. VÙNG HIỂN THỊ NỘI DUNG (CONTENT AREA) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          color: theme.palette.text.primary, // 🌟 Chữ trang con tự động đổi màu Đen <-> Trắng
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