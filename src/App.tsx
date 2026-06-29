import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { ThemeManagerProvider } from './contexts/ThemeContexts'; 

// 1. IMPORT AUTH PROVIDER CỦA BẠN VÀO ĐÂY:
import { AuthProvider } from './contexts/AuthContext' // Sửa lại đường dẫn nếu thư mục của bạn khác

export default function App() {
  return (
    <BrowserRouter>
      <ThemeManagerProvider> 
        {/* 2. BỌC AUTH PROVIDER TẠI ĐÂY */}
        <AuthProvider> 
          <AppRoutes />
        </AuthProvider>
      </ThemeManagerProvider>
    </BrowserRouter>
  );
}