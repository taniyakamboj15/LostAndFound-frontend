import api from './api';
import { API_ENDPOINTS } from '../constants';
import type { User, ApiResponse, CreateUserData, UpdateUserData } from '../types';

export const userService = {
  /**
   * List all registered users with role filtering (Admin only)
   * @param filters Optional role filter
   * @returns List of users
   */
  getAll: async (filters?: { role?: string }): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.BASE, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Create a new staff or admin user account (Admin only)
   * @param data User account information
   * @returns Created user profile
   */
  create: async (data: CreateUserData): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>(API_ENDPOINTS.USERS.BASE, data);
    return response.data;
  },

  /**
   * Provide profile updates for a specific user
   * @param id User ID to update
   * @param data Partial update data
   * @returns Updated user profile
   */
  update: async (id: string, data: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(`${API_ENDPOINTS.USERS.BASE}/${id}`, data);
    return response.data;
  },
};
