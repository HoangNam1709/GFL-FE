import { IconButton, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useAppTheme } from '../contexts/ThemeContexts'; 
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggleButton() {
  const { isDarkMode, toggleTheme } = useAppTheme();
  const theme = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      size="small" // Đặt size mặc định là nhỏ
      sx={{
        color: theme.palette.text.primary, 
        
        // Cân đối lại màu nền phẳng tinh tế
        bgcolor: isDarkMode ? alpha('#ffffff', 0.06) : alpha('#000000', 0.03), 
        boxShadow: 'none', // Loại bỏ shadow lớn rườm rà trên thanh Header phẳng
          
        border: `1px solid ${isDarkMode ? alpha('#ffffff', 0.08) : alpha('#000000', 0.06)}`,
        p: 0.6, // 🌟 Thu nhỏ khoảng đệm lại (Gốc là 1.2)
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        
        '&:hover': {
          bgcolor: isDarkMode ? alpha('#ffffff', 0.12) : alpha('#000000', 0.08),
          transform: 'rotate(15deg)', // 🌟 Chỉ xoay, bỏ scale(1.08) để tránh lấn chiều cao Header
          boxShadow: 'none',
        }
      }}
      aria-label="Cài đặt giao diện"
    >
      {isDarkMode ? (
        <Brightness7Icon sx={{ color: '#ffb74d', fontSize: 18 }} /> // 🌟 Thu nhỏ icon xuống 18px
      ) : (
        <Brightness4Icon sx={{ color: theme.palette.text.textheader || '#424242', fontSize: 18 }} /> // 🌟 Thu nhỏ icon xuống 18px
      )}
    </IconButton>
  );
}