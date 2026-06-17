export type UserRole = 'ADMIN' | 'MANAGER' | 'SECURITY_GUARD';

export interface UserItem {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}