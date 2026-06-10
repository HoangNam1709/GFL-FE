import { Button } from '@mui/material';
import { useAppTheme } from '../contexts/ThemeContexts'; // Đường dẫn tới file context ở bước 1
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggleButton() {
  const { isDarkMode, toggleTheme } = useAppTheme(); // 🌟 Lấy trạng thái toàn cục ra

  return (
    <Button
      variant="contained"
      onClick={toggleTheme}
      startIcon={isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      sx={{
        bgcolor: isDarkMode ? '#333' : '#e0e0e0',
        color: isDarkMode ? '#fff' : '#000',
        '&:hover': { bgcolor: isDarkMode ? '#444' : '#d5d5d5' },
        fontWeight: 'bold'
      }}
    >
      {isDarkMode ? 'DARK MODE' : 'LIGHT MODE'}
    </Button>
  );
}