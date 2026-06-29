// src/components/ProtectedRoute.tsx
import { type ReactNode } from 'react';
// import { useAuth } from '../contexts/AuthContext'; 

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   // Nếu chưa login, chuyển hướng về trang login
  //   window.location.href = '/login';
  //   return null;
  // }

  return <>{children}</>;
}