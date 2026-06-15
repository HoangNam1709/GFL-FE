import { Routes, Route, Navigate } from 'react-router-dom';
import SecurityLayout from '../layouts/SecurityLayout';
import VehicleInPage from '../pages/VehicleIn';
import HistoryLogPage from '../pages/HistoryLog';
import VehicleRegistrationPage from '../pages/VehicleRegistration';
import UserRegistrationPage from '../pages/PeopleRegister';
import CameraOverviewPage from '../pages/CameraOverView';
import NotFoundPage from '../pages/NotFound/NotFound';
// Các trang tạm thời đặt làm Mock để test Layout, tuần sau ta sẽ tách file sau
const SystemManagementPage = () => <span style={{ color: '#fff' }}>Màn hình Quản Lý Hệ Thống</span>;
export default function AppRoutes() {
  return (
    <Routes>
      {/* Tất cả các trang an ninh đều được bọc bởi SecurityLayout */}
      <Route element={<SecurityLayout />}>
        <Route path="/" element={<Navigate to="/camera-overview" replace />} />
        <Route path="/camera-overview" element={<CameraOverviewPage />} />
        <Route path="/log-history" element={< HistoryLogPage/>} />
        <Route path="/vehicle-in" element={<VehicleInPage />} />
        <Route path="/register-car" element={<VehicleRegistrationPage />} />
        <Route path="/people-register" element={<UserRegistrationPage/>} />
        <Route path="/system-management" element={<SystemManagementPage />} />
        {/* Nếu vào đường dẫn không tồn tại, tự động chuyển hướng về trang Cổng Vào */}
        <Route path="*" element={<NotFoundPage/>} />
      </Route>
    </Routes>
  );
}