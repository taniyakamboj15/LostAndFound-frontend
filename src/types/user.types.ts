import { UserRole } from '@constants/roles';

// User Types
export interface User {
  id: string;
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatar?: string;
  phone?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
}

// Profile Types
export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface CreateUserData extends RegisterData {
  role: UserRole;
}

export interface UpdateUserData extends Partial<CreateUserData> {}

export interface AddStaffData {
  name: string;
  email: string;
  password: string;
  role: Extract<UserRole, 'ADMIN' | 'STAFF'>;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
