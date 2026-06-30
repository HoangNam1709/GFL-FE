import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Toolbar, Typography, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, useTheme, alpha } from '@mui/material';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import VideocamIcon from '@mui/icons-material/Videocam';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GppGoodIcon from '@mui/icons-material/GppGood';
import LogoutIcon from '@mui/icons-material/Logout'; // Thêm icon Đăng xuất
import { useAuth } from '../contexts/AuthContext';
interface SidebarProps {
  open: boolean;
  drawerWidth: number;
}

export default function Sidebar({ open, drawerWidth }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { logout } = useAuth();

  // State quản lý riêng việc đóng/mở menu con Quản lý hệ thống
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const handleToggleSettings = () => setOpenSettings(!openSettings);
  const isActive = (path: string) => location.pathname === path;


// Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Tổng Quan Camera', path: '/camera-overview', icon: <VideocamIcon /> },
    { text: 'Lịch Sử Ra Vào', path: '/log-history', icon: <HistoryIcon /> },
    { text: 'Đăng Ký Xe', path: '/register-car', icon: <NoCrashIcon /> },
    { text: 'Đăng Ký Người', path: '/people-register', icon: <DirectionsRunIcon /> },
  ];

  const settingSubItems = [
    { 
      text: 'Quản lý Tài khoản', 
      path: '/system-management/users-management', 
      icon: <ManageAccountsIcon fontSize="small" /> 
    },
    { 
      text: 'Phân quyền & Vai trò', 
      path: '/system-management/permissions', 
      icon: <GppGoodIcon fontSize="small" /> 
    },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        transition: (t) => t.transitions.create('width', {
          easing: t.transitions.easing.sharp,
          duration: t.transitions.duration.enteringScreen,
        }),
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: theme.palette.customBg.card,
          color: theme.palette.text.primary,
          borderRight: `1px solid ${theme.palette.customBg.border}`,
          // --- Biến Drawer Paper thành Flexbox để đẩy nội dung xuống đáy ---
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar />
      <Toolbar sx={{ justifyContent: 'center', borderBottom: `1px solid ${theme.palette.customBg.border}`, minHeight: '48px !important' }}>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, fontWeight: 'bold' }}>
          🛡️ KHU VỰC ĐIỀU HÀNH
        </Typography>
      </Toolbar>

      {/* flexGrow: 1 ở đây sẽ chiếm trọn không gian trống và đẩy phần tử phía sau xuống đáy */}
      <Box sx={{ overflow: 'auto', mt: 2, flexGrow: 1 }}>
        <List>
          {/* MENU CHÍNH ĐƠN CẤP */}
          {menuItems.map((item) => {
            const isSelected = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                  sx={{
                    mx: 1, borderRadius: '8px', mb: 1, color: 'text.primary',
                    '&.Mui-selected': {
                      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : alpha('#222121', 0.12),
                      color: 'primary.main',
                      '&:hover': { bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.25) : alpha('#242323', 0.2) },
                      '& .MuiListItemIcon-root': { color: 'primary.main' }
                    },
                    '&:hover': { bgcolor: theme.palette.mode === 'dark' ? alpha('#ffffff', 0.05) : alpha('#000000', 0.09) }
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? theme.palette.primary.main : theme.palette.text.primary }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} slotProps={{ primary: { sx: { fontWeight: isSelected ? 700 : 500 } } }} />
                </ListItemButton>
              </ListItem>
            );
          })}

          {/* MENU CHA CÓ DROPDOWN */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleToggleSettings}
              sx={{ mx: 1, borderRadius: '8px', mb: 0.5, color: 'text.primary', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? alpha('#ffffff', 0.05) : alpha('#000000', 0.09) } }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Quản Lý Hệ Thống" slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
              {openSettings ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          {/* KHỐI CON SỔ XUỐNG */}
          <Collapse in={openSettings} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {settingSubItems.map((subItem) => {
                const isSubSelected = isActive(subItem.path);
                return (
                  <ListItem key={subItem.text} disablePadding>
                    <ListItemButton
                      onClick={() => navigate(subItem.path)}
                      selected={isSubSelected}
                      sx={{
                        mx: 1, borderRadius: '6px', height: '40px', color: 'text.primary',
                        '&.Mui-selected': {
                          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.12) : alpha('#222121', 0.08),
                          color: 'primary.main',
                          '& .MuiListItemIcon-root': { color: 'primary.main' },
                          '&:hover': { bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : alpha('#242323', 0.15) }
                        },
                        '&:hover': { bgcolor: theme.palette.mode === 'dark' ? alpha('#ffffff', 0.04) : alpha('#000000', 0.06) }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: '32px', color: isSubSelected ? theme.palette.primary.main : theme.palette.text.primary }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={subItem.text} slotProps={{ primary: { sx: { fontSize: '13px', fontWeight: isSubSelected ? 700 : 500 } } }} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </List>
      </Box>

      {/* --- KHỐI ĐĂNG XUẤT ĐƯỢC ĐẨY XUỐNG DƯỚI CÙNG --- */}
      <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.customBg.border}` }}>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mx: 0.5,
                borderRadius: '8px',
                color: theme.palette.error.main, // Chuyển chữ thành màu đỏ (MUI Error)
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.08), // Hiệu ứng hover đỏ nhạt
                }
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.main }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Đăng xuất" 
                slotProps={{ primary: { sx: { fontWeight: 600 } } }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}