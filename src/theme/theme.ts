import { createTheme } from '@mui/material/styles';

// Định nghĩa thêm kiểu dữ liệu cho các màu tùy chỉnh nếu cần (TypeScript)
declare module '@mui/material/styles' {
  interface Palette {
    customBg: {
      header?: string;
      main: string;
      card: string;
      border: string;
    };
  }
  interface PaletteOptions {
    customBg?: {
      header?: string;
      main: string;
      card: string;
      border: string;
    };
  }
}
declare module '@mui/material/styles' {
  interface TypeText {
    textheader?: string; 
  }
}

// 🌟 ĐỊNH NGHĨA FONT CHỮ DÙNG CHUNG CHO CẢ 2 CHẾ ĐỘ MÀU
const typographyConfig = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h5: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 800,
  }
};

// 1. Giao diện sáng (Light Theme) - Cho bốt bảo vệ ban ngày
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' }, 
    text: {
      primary: '#000000', 
      secondary: '#555555', 
      textheader: '#ffff' 
    },
    success: { main: '#2e7d32' },
    customBg: {
      header: "#1976d2",   
      main: '#f8f9fa',   
      card: '#ffffff',   
      border: '#e0e0e0'  
    }
  },
  typography: typographyConfig // 🌟 ĐÃ TÍCH HỢP FONT CHỮ VÀO LIGHT MODE
});

// 2. Giao diện tối (Dark Theme) - Giảm mỏi mắt ban đêm
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff9900' }, 
    text: {
      primary: '#ffffff', 
      secondary: '#cccccc', 
      textheader: '#ff9900' 
    },
    success: { main: '#1b5e20' },
    customBg: {
      main: '#121212',   
      card: '#1a1a1a',   
      border: '#333333'  
    }
  },
  typography: typographyConfig // 🌟 ĐÃ TÍCH HỢP FONT CHỮ VÀO DARK MODE
});