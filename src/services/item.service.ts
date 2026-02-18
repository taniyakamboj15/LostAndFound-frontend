import api from './api';
import { API_ENDPOINTS } from '../constants';
import {
  Item,
  CreateItemData,
  UpdateItemData,
  ItemFilters,
  ItemSearchResponse,
  ApiResponse,
  PublicItem,
} from '../types';

export const itemService = {
  /**
   * Get all registered items with optional filtering
   * @param filters Search and filter criteria
   * @returns Paginated list of items
   */
  getItems: async (filters?: ItemFilters): Promise<ItemSearchResponse> => {
    const response = await api.get<ItemSearchResponse>(API_ENDPOINTS.ITEMS.BASE, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get detailed information for a specific item
   * @param id Item ID
   * @returns Detailed item profile
   */
  getById: async (id: string): Promise<ApiResponse<Item>> => {
    const response = await api.get<ApiResponse<Item>>(API_ENDPOINTS.ITEMS.BY_ID(id));
    return response.data;
  },

  /**
   * Register a new found item (Staff/Admin only)
   * @param data Item data and photos
   * @returns Created item details
   */
  create: async (data: CreateItemData): Promise<ApiResponse<Item>> => {
    let formData: FormData;
    
    // If data is already FormData, use it directly
    if (data instanceof FormData) {
      formData = data;
    } else {
      // Otherwise, convert structured data to FormData
      formData = new FormData();
      
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('locationFound', data.locationFound);
      formData.append('dateFound', data.dateFound);
      formData.append('isHighValue', String(data.isHighValue));
      
      if (data.estimatedValue) {
        formData.append('estimatedValue', String(data.estimatedValue));
      }
      
      if (data.finderName) {
        formData.append('finderName', data.finderName);
      }
      
      if (data.finderContact) {
        formData.append('finderContact', data.finderContact);
      }
      
      if (data.storageLocation) {
        formData.append('storageLocation', data.storageLocation);
      }
      
      // Append photos
      data.photos.forEach((photo) => {
        formData.append('photos', photo);
      });
    }

    const response = await api.post<ApiResponse<Item>>(
      API_ENDPOINTS.ITEMS.BASE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Update existing item details
   * @param id Item ID
   * @param data Partial or complete update data
   * @returns Updated item profile
   */
  update: async (id: string, data: UpdateItemData): Promise<ApiResponse<Item>> => {
    const isFormData = data instanceof FormData;
    const response = await api.patch<ApiResponse<Item>>(
      API_ENDPOINTS.ITEMS.BY_ID(id),
      data,
      isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : undefined
    );
    return response.data;
  },

  /**
   * Change the lifecycle status of an item
   * @param id Item ID
   * @param status New status value
   * @returns Updated item profile
   */
  updateStatus: async (id: string, status: string): Promise<ApiResponse<Item>> => {
    const response = await api.patch<ApiResponse<Item>>(
      API_ENDPOINTS.ITEMS.STATUS(id),
      { status }
    );
    return response.data;
  },

  /**
   * Assign or change the storage location of an item
   * @param id Item ID
   * @param storageId Storage location ID
   * @returns Updated item profile
   */
  assignStorage: async (id: string, storageId: string): Promise<ApiResponse<Item>> => {
    const response = await api.patch<ApiResponse<Item>>(
      API_ENDPOINTS.ITEMS.STORAGE(id),
      { storageId }
    );
    return response.data;
  },

  /**
   * Search for items visible to the public (unauthenticated)
   * @param filters Publicly available search filters
   * @returns List of public-facing item summaries
   */
  publicSearch: async (filters?: ItemFilters): Promise<ApiResponse<PublicItem[]>> => {
    const response = await api.get<ApiResponse<PublicItem[]>>(
      API_ENDPOINTS.PUBLIC.ITEMS,
      { params: filters }
    );
    return response.data;
  },
};
