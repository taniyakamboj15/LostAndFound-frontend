import api from './api';
import { API_ENDPOINTS } from '../constants';
import type {
  CreateStorageData,
  UpdateStorageData,
  StorageResponse,
  StorageListResponse,
} from '../types';
import type { ApiResponse } from '../types/api.types';

export const storageService = {
  /**
   * List all storage locations with status filtering
   * @param filters Optional filter for active/inactive locations
   * @returns List of storage locations
   */
  getAll: async (filters?: { isActive?: boolean }): Promise<StorageListResponse> => {
    const response = await api.get<StorageListResponse>(API_ENDPOINTS.STORAGE.BASE, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get storage locations that have remaining capacity
   * @returns List of non-full storage locations
   */
  getAvailable: async (): Promise<StorageListResponse> => {
    const response = await api.get<StorageListResponse>(`${API_ENDPOINTS.STORAGE.BASE}/available`);
    return response.data;
  },

  /**
   * Get detailed info for a specific storage shelf/bin
   * @param id Storage ID
   * @returns Detailed storage profile
   */
  getById: async (id: string): Promise<StorageResponse> => {
    const response = await api.get<StorageResponse>(API_ENDPOINTS.STORAGE.BY_ID(id));
    return response.data;
  },

  /**
   * Create a new physical storage location (Admin only)
   * @param data Location name and capacity
   * @returns Created storage response
   */
  create: async (data: CreateStorageData): Promise<StorageResponse> => {
    const response = await api.post<StorageResponse>(API_ENDPOINTS.STORAGE.BASE, data);
    return response.data;
  },

  /**
   * Update storage location properties or capacity
   * @param id Storage ID
   * @param data Update details
   * @returns Updated storage response
   */
  update: async (id: string, data: UpdateStorageData): Promise<StorageResponse> => {
    const response = await api.patch<StorageResponse>(API_ENDPOINTS.STORAGE.BY_ID(id), data);
    return response.data;
  },

  /**
   * Remove an empty storage location (Admin only)
   * @param id Storage ID
   * @returns Generic API response
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(API_ENDPOINTS.STORAGE.BY_ID(id));
    return response.data;
  },
};
