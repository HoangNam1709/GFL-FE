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
    textheader?: string; // Khai báo thêm trường tertiary vào hệ thống chữ
  }
}

// 1. Giao diện sáng (Light Theme) - Cho bốt bảo vệ ban ngày
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' }, // Dùng màu xanh cho light mode
    text: {
      primary: '#000000', // Màu chữ đen cho light mode
      secondary: '#555555', // Màu chữ phụ xám đậm
      textheader: '#ffff' // Màu chữ phụ trắng sáng cho header
    },
    success: { main: '#2e7d32' },
    customBg: {
      header: "#1976d2",   // Nền header xanh dương
      main: '#f8f9fa',   // Nền tổng thể xám nhạt
      card: '#ffffff',   // Nền Card trắng tinh
      border: '#e0e0e0'  // Viền xám mảnh
    }
  }
});

// 2. Giao diện tối (Dark Theme) - Giảm mỏi mắt ban đêm (Màu cũ của bạn)
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff9900' }, // Vàng cam đặc trưng của bạn
    text: {
      primary: '#ffffff', // Màu chữ trắng cho dark mode
      secondary: '#cccccc', // Màu chữ phụ xám sáng
      textheader: '#ff9900' // Màu chữ phụ vàng cam đặc trưng cho header
    },
    success: { main: '#1b5e20' },
    customBg: {
      main: '#121212',   // Nền tổng sẫm màu
      card: '#1a1a1a',   // Nền Card tối đen của bạn
      border: '#333333'  // Viền tối
    }
  }
});

export const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});