import { Paper, Typography, List, ListItem, ListItemText, useTheme } from '@mui/material'; // 🌟 Import useTheme

interface HistoryLogProps {
  history: string[];
}

export default function HistoryLog({ history }: HistoryLogProps) {
  const theme = useTheme(); // 🌟 Kích hoạt bộ theo dõi Theme động của hệ thống

  return (
    // 🌟 Thay thế màu nền Paper và viền động theo theme
    <Paper 
      sx={{ 
        p: 2, 
        bgcolor: theme.palette.customBg.card, 
        borderRadius: 2, 
        border: `1px solid ${theme.palette.customBg.border}` 
      }}
    >
      {/* Màu tiêu đề log ăn theo màu text phụ của hệ thống */}
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, fontWeight: 'bold', mb: 1 }}>
        📜 Lịch sử liên kết hệ thống:
      </Typography>

      {history.length === 0 ? (
        // Màu thông báo trống tự động chuyển từ xám sẫm sang xám nhạt tương ứng để không bị chìm
        <Typography variant="body2" sx={{ color: theme.palette.text.disabled, py: 1 }}>
          Chưa có lượt xe nào được tạo trong phiên làm việc này.
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {history.map((item, index) => (
            <ListItem 
              key={index} 
              disableGutters 
              sx={{ 
                // Viền dưới phân cách giữa các log đổi động
                borderBottom: `1px solid ${theme.palette.customBg.border}`, 
                py: 1 
              }}
            >
              <ListItemText 
                primary={`${item}`} 
                secondary="➔ Đã lưu vào cơ sở dữ liệu thành công!"
                slotProps={{
                  primary: { 
                    sx: { 
                      // 🌟 ĐỘNG HÓA MÀU LOG CHÍNH: Light mode dùng xanh lá đậm, Dark mode dùng xanh lá tươi của bạn
                      color: theme.palette.mode === 'light' ? '#2e7d32' : '#4caf50', 
                      fontWeight: 'bold', 
                      fontSize: '14px' 
                    } 
                  },
                  secondary: { 
                    sx: { 
                      // 🌟 ĐỘNG HÓA MÀU CHỮ PHỤ: Light mode xanh lá vừa, Dark mode xanh lá nhạt
                      color: theme.palette.mode === 'light' ? '#4caf50' : '#81c784', 
                      fontSize: '12px' 
                    } 
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}