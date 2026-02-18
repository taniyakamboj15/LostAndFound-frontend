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
  /**
   * Register a new user
   * @param data Registration information
   * @returns Auth response with user data
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  /**
   * Login with email and password
   * @param credentials Login credentials
   * @returns Auth response with user and artifacts
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Logout the current user and clear sessions
   * @returns Generic API response
   */
  logout: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * Refresh the access token using a refresh token
   * @param refreshToken The refresh token
   * @returns API response with new tokens
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Redirect user to Google OAuth login page
   */
  googleLogin: (): void => {
    window.location.href = `${api.defaults.baseURL}${API_ENDPOINTS.AUTH.GOOGLE}`;
  },

  /**
   * Verify user email via token
   * @param token Verification token from email
   * @returns Generic API response
   */
  verifyEmail: async (token: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.USERS.VERIFY_EMAIL, {
      token,
    });
    return response.data;
  },

  /**
   * Request resending the verification email
   * @param email User's email address
   * @returns Generic API response
   */
  resendVerification: async (email: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.USERS.RESEND_VERIFICATION, {
      email,
    });
    return response.data;
  },

  /**
   * Get current authenticated user profile
   * @returns API response with user profile data
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },
};
