import { Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { ButtonProps } from '@mui/material';
// Kế thừa toàn bộ thuộc tính gốc của Button trong MUI (onClick, disabled, type,...)
interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean; // Thêm trạng thái xoay tròn riêng nếu cần
}

export default function CustomButton({ 
  children, 
  isLoading, 
  sx, 
  disabled, 
  startIcon, 
  ...rest 
}: CustomButtonProps) {
  const theme = useTheme();
  return (
    <Button
      {...rest} // Kế thừa toàn bộ props còn lại (onClick, variant, color...)
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'none',
        padding: '8px 20px',
        '&:hover': { backgroundColor: theme.palette.primary.dark },
        '&:disabled': { backgroundColor: '#cccccc', color: '#666666' },
        ...sx // Cho phép file cha truyền thêm style riêng để ghi đè nếu cần
      }}
    >
      {children}
    </Button>
  );
}