import { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Button, useTheme, Avatar, TextField, InputAdornment,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, MenuItem,
  alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { UserItem, UserRole } from './types';

// Dữ liệu giả lập (Mock Data)
const MOCK_USERS: UserItem[] = [
  { id: 'US001', username: 'minhxje.admin', fullName: 'Nguyễn Minh Hiếu', email: 'hieu.nm@airport.vn', phoneNumber: '0987654321', role: 'ADMIN', status: 'ACTIVE', createdAt: '15/01/2026' },
  { id: 'US002', username: 'tran.b_manager', fullName: 'Trần Văn Bình', email: 'binh.tv@airport.vn', phoneNumber: '0912345678', role: 'MANAGER', status: 'ACTIVE', createdAt: '20/02/2026' },
  { id: 'US003', username: 'guard.le_01', fullName: 'Lê Hoàng Nam', email: 'nam.lh@airport.vn', phoneNumber: '0933445566', role: 'SECURITY_GUARD', status: 'ACTIVE', createdAt: '05/03/2026' },
  { id: 'US004', username: 'guard.nguyen_02', fullName: 'Nguyễn Văn Hùng', email: 'hung.nv@airport.vn', phoneNumber: '0955667788', role: 'SECURITY_GUARD', status: 'INACTIVE', createdAt: '12/04/2026' },
];

export default function UserManagementPage() {
  const theme = useTheme();
  const [users, setUsers] = useState<UserItem[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // State quản lý Modal Form (Thêm/Sửa)
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<UserItem | null>(null);

  // Khởi tạo giá trị mặc định cho form thêm mới
  const defaultFormState: Omit<UserItem, 'id' | 'createdAt'> = {
    username: '', fullName: '', email: '', phoneNumber: '', role: 'SECURITY_GUARD', status: 'ACTIVE'
  };
  const [formData, setFormData] = useState(defaultFormState);

  // State tạm lưu ID của tài khoản đang được nhắm đến để xóa (nếu có)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Mở đóng Modal
  const handleOpenAddDialog = () => {
    setEditUser(null);
    setFormData(defaultFormState);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user: UserItem) => {
    setEditUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  // Xử lý lưu Form (Thêm hoặc Sửa)
  const handleSaveUser = () => {
    if (editUser) {
      // Logic cập nhật tài khoản
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...formData } : u));
    } else {
      // Logic thêm mới tài khoản
      const newUser: UserItem = {
        ...formData,
        id: `US00${users.length + 1}`,
        createdAt: new Date().toLocaleDateString('vi-VN')
      };
      setUsers([...users, newUser]);
    }
    handleCloseDialog();
  };

  // Logic Xóa tài khoản
  // 1. Khi bấm nút Thùng rác: Chỉ mở Dialog lên và găm ID lại chứ chưa xóa vội
  const handleRequestDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  // 2. Khi người dùng bấm nút "Xác nhận xóa" trên Giao diện mới
  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      setUsers(users.filter(u => u.id !== deleteTargetId));
      setDeleteTargetId(null); // Xóa xong thì đóng bốt thông báo
    }
  };

  const renderRoleChip = (role: UserRole) => {
    const config = {
      ADMIN: { label: 'Quản trị viên', color: 'error' as const },
      MANAGER: { label: 'Điều hành bến', color: 'warning' as const },
      SECURITY_GUARD: { label: 'Bảo vệ bốt', color: 'primary' as const },
    };
    return <Chip label={config[role].label} color={config[role].color} size="small" sx={{ fontWeight: 'bold' }} />;
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* HEADER PHÂN HỆ */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase' }}>
            <AccountCircleIcon color="primary" /> Quản lý danh sách tài khoản
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Quản lý hồ sơ, cấp phát tài khoản đăng nhập và phân vai trò hoạt động cho nhân sự trực bốt.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ borderRadius: '8px', fontWeight: 'bold', textTransform: 'none', px: 3 }}
        >
          Tạo tài khoản
        </Button>
      </Box>

      {/* THANH TÌM KIẾM TẬP TRUNG */}
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder=" mã nhân viên, họ tên hoặc username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 400 },
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

      {/* BẢNG HIỂN THỊ DANH SÁCH TÀI KHOẢN */}
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
            {filteredUsers.map((user) => (
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
                      <IconButton size="small" color="info" onClick={() => handleOpenEditDialog(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa tài khoản">
                      <IconButton size="small" color="error" onClick={() => handleRequestDelete(user.id)} disabled={user.role === 'ADMIN'}>
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

      {/* ========================================== */}
      {/* 🌟 MODAL DIALOG: THÊM / SỬA TÀI KHOẢN */}
      {/* ========================================== */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '12px' } } }}>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${theme.palette.customBg.border}`, pb: 2 }}>
          {editUser ? 'CẬP NHẬT THÔNG TIN TÀI KHOẢN' : 'TẠO MỚI TÀI KHOẢN NHÂN SỰ'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="Họ và Tên" size="small" required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="Tên đăng nhập (Username)" size="small" required disabled={!!editUser}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="Địa chỉ Email" size="small" type="email" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="Số điện thoại" size="small" required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth select label="Vai trò hệ thống" size="small"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                <MenuItem value="MANAGER">Điều hành bến</MenuItem>
                <MenuItem value="SECURITY_GUARD">Bảo vệ bốt</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth select label="Trạng thái kích hoạt" size="small"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                disabled={editUser?.role === 'ADMIN'}
              >
                <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                <MenuItem value="INACTIVE">Tạm khóa</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.customBg.border}` }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="inherit" sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 'bold' }}>
            Hủy bỏ
          </Button>
          <Button onClick={handleSaveUser} variant="contained" sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 'bold', px: 3 }}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>



      {/* ========================================== */}
      {/* 🌟 DIALOG XÁC NHẬN XÓA TÀI KHOẢN (MUI v6) */}
      {/* ========================================== */}
      <Dialog
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }} // Bo tròn mềm mại hơn
      >
        <DialogContent sx={{ pt: 3, textPadding: 0, textAlign: 'center' }}>
          {/* Icon Cảnh báo thiết kế nổi bật hình tròn màu đỏ */}
          <Box
            sx={{
              width: 60, height: 60, bgcolor: alpha(theme.palette.error.main, 0.1),
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', mx: 'auto', mb: 2
            }}
          >
            <DeleteIcon sx={{ fontSize: 32, color: 'error.main' }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Xác nhận xóa tài khoản?
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            Hành động này sẽ gỡ bỏ hoàn toàn nhân sự ra khỏi hệ thống điều hành terminal. Bạn có chắc chắn muốn tiếp tục?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1.5 }}>
          <Button
            onClick={() => setDeleteTargetId(null)}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold', minWidth: 100 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '8px', textTransform: 'none', fontWeight: 'bold',
              minWidth: 100, bgcolor: 'error.main', boxShadow: 'none',
              '&:hover': { bgcolor: 'error.dark', boxShadow: 'none' }
            }}
          >
            Xóa ngay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}