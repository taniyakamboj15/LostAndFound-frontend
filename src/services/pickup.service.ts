import api from './api';
import { API_ENDPOINTS } from '../constants';
import type {
  BookPickupData,
  CompletePickupData,
  PickupResponse,
  PickupsListResponse,
  AvailableSlotsResponse,
} from '../types';

export const pickupService = {
  // Get all pickups
  getAll: async (): Promise<PickupsListResponse> => {
    const response = await api.get<PickupsListResponse>(API_ENDPOINTS.PICKUPS.BASE);
    return response.data;
  },

  // Get my pickups (Claimant)
  getMyPickups: async (): Promise<PickupsListResponse> => {
    const response = await api.get<PickupsListResponse>(`${API_ENDPOINTS.PICKUPS.BASE}/my-pickups`);
    return response.data;
  },

  // Get available pickup slots
  getAvailableSlots: async (date?: string): Promise<AvailableSlotsResponse> => {
    const response = await api.get<AvailableSlotsResponse>(
      API_ENDPOINTS.PICKUPS.SLOTS,
      { params: { date } }
    );
    return response.data;
  },

  // Book a pickup
  book: async (data: BookPickupData): Promise<PickupResponse> => {
    const response = await api.post<PickupResponse>(API_ENDPOINTS.PICKUPS.BASE, data);
    return response.data;
  },

  // Complete a pickup
  complete: async (id: string, data: CompletePickupData): Promise<PickupResponse> => {
    const response = await api.post<PickupResponse>(
      API_ENDPOINTS.PICKUPS.COMPLETE(id),
      data
    );
    return response.data;
  },

  // Get pickup by ID
  getById: async (id: string): Promise<PickupResponse> => {
    const response = await api.get<PickupResponse>(API_ENDPOINTS.PICKUPS.BY_ID(id));
    return response.data;
  },
};
