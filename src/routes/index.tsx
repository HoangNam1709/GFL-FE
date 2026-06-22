import { Routes, Route, Navigate } from 'react-router-dom';
import SecurityLayout from '../layouts/SecurityLayout';
import VehicleInPage from '../pages/VehicleIn';
import HistoryLogPage from '../pages/HistoryLog';
import VehicleRegistrationPage from '../pages/VehicleRegistration';
import UserRegistrationPage from '../pages/PeopleRegister';
import CameraOverviewPage from '../pages/CameraOverView';
import NotFoundPage from '../pages/NotFound/NotFound';
import PermissionPage from '../pages/Permission/Permission';
import UserManagementPage from '../pages/AccountManagement/UserManagementPage';
import VehicleOutPage from '../pages/VehicleOut';
export default function AppRoutes() {
  return (
    <Routes>
      {/* Tất cả các trang an ninh đều được bọc bởi SecurityLayout */}
      <Route element={<SecurityLayout />}>
        <Route path="/" element={<Navigate to="/camera-overview" replace />} />
        <Route path="/camera-overview" element={<CameraOverviewPage />} />
        <Route path="/log-history" element={< HistoryLogPage />} />
        <Route path="/vehicle-in" element={<VehicleInPage />} />
        <Route path="/vehicle-out" element={<VehicleOutPage />} />
        <Route path="/register-car" element={<VehicleRegistrationPage />} />
        <Route path="/people-register" element={<UserRegistrationPage />} />
        <Route path="/system-management/permissions" element={<PermissionPage />} />
        <Route path="/system-management/users-management" element={<UserManagementPage/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}