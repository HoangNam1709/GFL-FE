import { AppBar, Toolbar, Box, Typography, IconButton, useTheme, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ThemeToggleButton from '../components/ThemeToggleButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icon mặc định tinh gọn
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  open: boolean;
  onToggleDrawer: () => void;
}

export default function Header({ open, onToggleDrawer }: HeaderProps) {
  const theme = useTheme();
  const { user } = useAuth(); // Lấy thông tin tài khoản hiện tại

  // Lấy chữ cái đầu của tên tài khoản để làm Avatar placeholder chuyên nghiệp
  const userDisplayName = (user as any)?.username || (user as any)?.email || 'Bùi Minh Đức';
  const avatarLetter = userDisplayName.charAt(0).toUpperCase();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: theme.palette.customBg.header,
        borderBottom: `1px solid ${theme.palette.customBg.border}`,
        zIndex: (t) => t.zIndex.drawer + 1,
        boxShadow: 'none'
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: '56px !important',
          px: '16px !important'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            aria-label="toggle drawer"
            onClick={onToggleDrawer}
            edge="start"
            size="small"
            sx={{ mr: 1.5, color: theme.palette.text.textheader }}
          >
            {open ? <ChevronLeftIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>

          <Typography
            variant="subtitle1"
            noWrap
            component="div"
            sx={{
              color: theme.palette.text.textheader,
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            HỆ THỐNG GIÁM SÁT AN NINH XE RA VÀO SÂN BAY
          </Typography>
        </Box>

        {/* GÓC PHẢI: GIAO DIỆN & THÔNG TIN ĐĂNG NHẬP */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ThemeToggleButton />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: 2,
              borderLeft: `1px solid ${theme.palette.customBg.border}`,
              height: '24px'
            }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.textheader,
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: 1.2
                }}
              >
                {userDisplayName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '10px',
                  display: 'block'
                }}
              >
                {(user as any)?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên bốt trực'}
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 26,
                height: 26,
                // 🌟 Kiểm tra mode: Light mode thì nền trắng tinh, Dark mode thì dùng màu Primary
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#ffffff',

                // 🌟 Màu sắc của chữ/icon bên trong tương ứng
                color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.primary.main,

                fontSize: '12px',
                fontWeight: 'bold',

                // Thêm một đường viền mảnh cho Avatar ở bản Light mode để nó nổi bật, không bị chìm vào nền Header
                border: `1px solid ${theme.palette.mode === 'dark' ? 'transparent' : '#e0e0e0'}`
              }}
            >
              {user ? avatarLetter : <AccountCircleIcon sx={{ fontSize: 16 }} />}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}