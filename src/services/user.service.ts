import api from './api';
import { API_ENDPOINTS } from '../constants';
import type { User, ApiResponse, CreateUserData, UpdateUserData } from '../types';

export const userService = {
  // Get all users (admin only)
  getAll: async (filters?: { role?: string }): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.BASE, {
      params: filters,
    });
    return response.data;
  },

  // Create a new user/staff member (admin only)
  create: async (data: CreateUserData): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>(API_ENDPOINTS.USERS.BASE, data);
    return response.data;
  },

  // Update user profile (already in authService but added here for completeness)
  update: async (id: string, data: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(`${API_ENDPOINTS.USERS.BASE}/${id}`, data);
    return response.data;
  },
};
