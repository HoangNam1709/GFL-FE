import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '../theme/theme';


interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeManagerProvider({ children }: { children: React.ReactNode }) {
  // Lưu trạng thái vào localStorage để khi F5 tải lại trang không bị mất chế độ màu đã chọn
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved ? saved === 'dark' : true; // Mặc định là Dark Mode (giao diện tối)
  });

  useEffect(() => {
    localStorage.setItem('theme_mode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline /> {/* Ép nền body toàn bộ trang web đổi màu theo theme */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Hook để các file con (Header, Card, Button...) gọi ra sử dụng khi cần đổi trạng thái
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeManagerProvider');
  return context;
};