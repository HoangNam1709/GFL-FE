import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Chuyển hướng mượt mà không bị reload lại trang
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}