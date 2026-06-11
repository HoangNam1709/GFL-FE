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
      sx={{
        color: theme.palette.text.primary, 
        
        // 🌟 XỬ LÝ MÀU NỀN ĐẬM RÕ: 
        // Dark Mode: Màu trắng mờ 8% trên nền tối

        bgcolor: isDarkMode ? alpha('#ffffff', 0.08) : '#ffffff', 
        boxShadow: isDarkMode 
          ? 'none' 
          : '0px 2px 8px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.04)',
          
        border: `1px solid ${isDarkMode ? alpha('#ffffff', 0.1) : '#e0e0e0'}`, // Viền mảnh tinh tế
        p: 1.2, 
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', // Hiệu ứng mượt hơn
        
        '&:hover': {
          // Khi hover: Dark mode sáng hơn tí, Light mode chuyển xám cực nhẹ
          bgcolor: isDarkMode ? alpha('#ffffff', 0.18) : '#f5f5f5',
          transform: 'rotate(15deg) scale(1.08)',
          boxShadow: isDarkMode ? 'none' : '0px 4px 12px rgba(0, 0, 0, 0.12)',
        }
      }}
      aria-label="Cài đặt giao diện"
    >
      {isDarkMode ? (
        <Brightness7Icon sx={{ color: '#ffb74d' }} />
      ) : (
        <Brightness4Icon sx={{ color: '#1976d2' }} />
      )}
    </IconButton>
  );
}