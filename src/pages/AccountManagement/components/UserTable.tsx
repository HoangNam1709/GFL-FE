import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, Avatar, Typography, Tooltip, IconButton, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { UserItem, UserRole } from '../types';

interface UserTableProps {
  users: UserItem[];
  onEditClick: (user: UserItem) => void;
  onDeleteClick: (id: string) => void;
}

export default function UserTable({ users, onEditClick, onDeleteClick }: UserTableProps) {
  const theme = useTheme();

  const renderRoleChip = (role: UserRole) => {
    const config = {
      ADMIN: { label: 'Quản trị viên', color: 'error' as const },
      MANAGER: { label: 'Điều hành bến', color: 'warning' as const },
      SECURITY_GUARD: { label: 'Bảo vệ bốt', color: 'primary' as const },
    };
    return <Chip label={config[role].label} color={config[role].color} size="small" sx={{ fontWeight: 'bold' }} />;
  };

  return (
    <TableContainer component={Paper} sx={{ bgcolor: theme.palette.customBg.card, borderRadius: '12px', boxShadow: 'none', border: `1px solid ${theme.palette.customBg.border}`, overflow: 'hidden' }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f1f3f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Mã NV</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Nhân sự bốt trực</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Tên đăng nhập</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Liên hệ</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
            <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell sx={{ fontWeight: 600 }}>{user.id}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, fontSize: '13px', fontWeight: 'bold' }}>
                    {user.fullName.split(' ').pop()?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">Ngày tạo: {user.createdAt}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 500 }}>@{user.username}</TableCell>
              <TableCell>
                <Typography variant="body2">{user.email}</Typography>
                <Typography variant="caption" color="text.secondary">{user.phoneNumber}</Typography>
              </TableCell>
              <TableCell>{renderRoleChip(user.role)}</TableCell>
              <TableCell align="center">
                <Chip
                  label={user.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm khóa'}
                  color={user.status === 'ACTIVE' ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <Tooltip title="Chỉnh sửa thông tin">
                    <IconButton size="small" color="info" onClick={() => onEditClick(user)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa tài khoản">
                    <IconButton size="small" color="error" onClick={() => onDeleteClick(user.id)} disabled={user.role === 'ADMIN'}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}