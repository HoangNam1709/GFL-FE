import { Snackbar, Alert } from '@mui/material';

// Định nghĩa kiểu dữ liệu (Props) nhận vào từ trang cha
export interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

interface ToastNotificationProps {
  toast: ToastState;
  onClose: () => void;
}

export default function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={3000} // Tự động đóng sau 4 giây
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Hiện ở góc trên bên phải
    >
      <Alert 
        onClose={onClose} 
        severity={toast.severity} 
        variant="filled" 
        sx={{ width: '100%', fontWeight: 'bold', borderRadius: '8px', boxShadow: 3 }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
}