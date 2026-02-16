import api from './api';
import { API_ENDPOINTS } from '../constants';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
  User,
} from '../types';

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  // Login with credentials
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response.data;
  },

  // Google OAuth login
  googleLogin: (): void => {
    window.location.href = `${api.defaults.baseURL}${API_ENDPOINTS.AUTH.GOOGLE}`;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.USERS.VERIFY_EMAIL, {
      token,
    });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.USERS.RESEND_VERIFICATION);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },
};
