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
  // Get all storage locations
  getAll: async (filters?: { isActive?: boolean }): Promise<StorageListResponse> => {
    const response = await api.get<StorageListResponse>(API_ENDPOINTS.STORAGE.BASE, {
      params: filters,
    });
    return response.data;
  },

  // Get available storage locations
  getAvailable: async (): Promise<StorageListResponse> => {
    const response = await api.get<StorageListResponse>(`${API_ENDPOINTS.STORAGE.BASE}/available`);
    return response.data;
  },

  // Get storage by ID
  getById: async (id: string): Promise<StorageResponse> => {
    const response = await api.get<StorageResponse>(API_ENDPOINTS.STORAGE.BY_ID(id));
    return response.data;
  },

  // Create new storage location
  create: async (data: CreateStorageData): Promise<StorageResponse> => {
    const response = await api.post<StorageResponse>(API_ENDPOINTS.STORAGE.BASE, data);
    return response.data;
  },

  // Update storage location
  update: async (id: string, data: UpdateStorageData): Promise<StorageResponse> => {
    const response = await api.patch<StorageResponse>(API_ENDPOINTS.STORAGE.BY_ID(id), data);
    return response.data;
  },

  // Delete storage location
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(API_ENDPOINTS.STORAGE.BY_ID(id));
    return response.data;
  },
};
