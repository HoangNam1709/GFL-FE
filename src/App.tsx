import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { ThemeManagerProvider } from './contexts/ThemeContexts'; // 🌟 Import context vừa tạo

export default function App() {
  return (
    <BrowserRouter>
      <ThemeManagerProvider> {/* 🌟 Bọc quản lý Theme tại đây */}
        <AppRoutes />
      </ThemeManagerProvider>
    </BrowserRouter>
  );
}