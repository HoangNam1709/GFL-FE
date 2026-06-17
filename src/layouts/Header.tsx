import { AppBar, Toolbar, Box, Typography, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ThemeToggleButton from '../components/ThemeToggleButton';

interface HeaderProps {
  open: boolean;
  onToggleDrawer: () => void;
}

export default function Header({ open, onToggleDrawer }: HeaderProps) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: theme.palette.customBg.header,
        borderBottom: `2px solid ${theme.palette.customBg.border}`,
        zIndex: (t) => t.zIndex.drawer + 1,
        boxShadow: theme.palette.mode === 'light' ? '0px 2px 4px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Nút bấm ẩn/hiện Sidebar */}
          <IconButton
            aria-label="toggle drawer"
            onClick={onToggleDrawer}
            edge="start"
            sx={{ mr: 2, color: theme.palette.text.textheader }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          {/* Tiêu đề hệ thống */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: theme.palette.text.textheader, fontWeight: 'bold' }}
          >
            HỆ THỐNG GIÁM SÁT AN NINH XE RA VÀO SÂN BAY
          </Typography>
        </Box>

        {/* Nút đổi Theme góc phải */}
        <Box>
          <ThemeToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}