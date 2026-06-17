import { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Switch, Chip, useTheme, Avatar, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShieldIcon from '@mui/icons-material/Shield';
import type { UserPermission, UserRole } from './types';

// Dữ liệu Mock mô phỏng danh sách nhân sự từ Backend đổ về
const MOCK_USERS: UserPermission[] = [
  {
    id: 'US001', username: 'minhxje.admin', fullName: 'Nguyễn Minh Hiếu', gateCode: 'ALL', role: 'ADMIN',
    canViewCamera: true, canApproveVehicle: true, canExportReport: true, canManageSystem: true, status: 'ACTIVE'
  },
  {
    id: 'US002', username: 'tran.b_manager', fullName: 'Trần Văn Bình', gateCode: 'GATE_01', role: 'MANAGER',
    canViewCamera: true, canApproveVehicle: true, canExportReport: true, canManageSystem: false, status: 'ACTIVE'
  },
  {
    id: 'US003', username: 'guard.le_01', fullName: 'Lê Hoàng Nam', gateCode: 'GATE_01', role: 'SECURITY_GUARD',
    canViewCamera: true, canApproveVehicle: true, canExportReport: false, canManageSystem: false, status: 'ACTIVE'
  },
  {
    id: 'US004', username: 'guard.nguyen_02', fullName: 'Nguyễn Văn Hùng', gateCode: 'GATE_02', role: 'SECURITY_GUARD',
    canViewCamera: true, canApproveVehicle: false, canExportReport: false, canManageSystem: false, status: 'INACTIVE'
  },
];

export default function PermissionPage() {
  const theme = useTheme();
  const [users, setUsers] = useState<UserPermission[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Hàm xử lý bật/tắt nhanh quyền hạn trực tiếp trên bảng (Sau này sẽ gọi API cập nhật)
  const handlePermissionChange = (userId: string, field: keyof UserPermission) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: !user[field] } : user
      )
    );
  };

  // Hàm render nhãn nhãn Vai trò (Role) với màu sắc trực quan
  const renderRoleChip = (role: UserRole) => {
    const config = {
      ADMIN: { label: 'Quản trị viên', color: 'error' as const },
      MANAGER: { label: 'Điều hành bến', color: 'warning' as const },
      SECURITY_GUARD: { label: 'Bảo vệ bốt', color: 'primary' as const },
    };
    return <Chip label={config[role].label} color={config[role].color} size="small" sx={{ fontWeight: 'bold' }} />;
  };

  // Lọc danh sách theo ô tìm kiếm tên hoặc mã nhân viên
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* TIÊU ĐỀ PHÂN HỆ */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase' }}>
            <ShieldIcon color="primary" /> Quản lý tài khoản & Phân quyền an ninh
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Thiết lập quyền truy cập camera hạ tầng, cấp lệnh phê duyệt Barrier và cấu hình thiết bị bốt trực.
          </Typography>
        </Box>

        {/* Ô TÌM KIẾM NHÂN VIÊN */}
        <TextField
          size="small"
          placeholder="Tìm tên hoặc mã nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 300,
            bgcolor: theme.palette.customBg.card,
            '& .MuiOutlinedInput-root': { borderRadius: '8px' }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* BẢNG PHÂN QUYỀN HỆ THỐNG */}
      <TableContainer component={Paper} sx={{ bgcolor: theme.palette.customBg.card, borderRadius: '12px', boxShadow: 'none', border: `1px solid ${theme.palette.customBg.border}`, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f1f3f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nhân sự bốt trực</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Bốt phân công</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Xem Camera OCR</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Phê duyệt Xe Vào/Ra</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Xuất báo cáo dữ liệu</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Quản trị hệ thống</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} hover sx={{ '&:last-child cell, &:last-child th': { border: 0 } }}>

                {/* Cột 1: Thông tin nhân sự (Avatar + Tên) */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main, fontSize: '14px', fontWeight: 'bold' }}>
                      {user.fullName.split(' ').pop()?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.id} • @{user.username}</Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Cột 2: Vai trò */}
                <TableCell>{renderRoleChip(user.role)}</TableCell>

                {/* Cột 3: Vị trí bốt trực */}
                <TableCell sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {user.gateCode === 'ALL' ? 'Tất cả các làn' : `Làn trực: ${user.gateCode}`}
                </TableCell>

                {/* Cột 4 -> 7: Các Switch bật tắt quyền chi tiết */}
                <TableCell align="center">
                  <Switch
                    checked={user.canViewCamera}
                    onChange={() => handlePermissionChange(user.id, 'canViewCamera')}
                    disabled={user.role === 'ADMIN'} // Admin mặc định full quyền không cho tắt
                  />
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={user.canApproveVehicle}
                    onChange={() => handlePermissionChange(user.id, 'canApproveVehicle')}
                    disabled={user.role === 'ADMIN'}
                  />
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={user.canExportReport}
                    onChange={() => handlePermissionChange(user.id, 'canExportReport')}
                    disabled={user.role === 'ADMIN'}
                  />
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={user.canManageSystem}
                    onChange={() => handlePermissionChange(user.id, 'canManageSystem')}
                    disabled={user.role === 'ADMIN'}
                  />
                </TableCell>

                {/* Cột 8: Trạng thái tài khoản */}
                <TableCell align="center">
                  <Chip
                    label={user.status === 'ACTIVE' ? 'Đang trực' : 'Tạm khóa'}
                    color={user.status === 'ACTIVE' ? 'success' : 'default'}
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}