import api from './api';
import { API_ENDPOINTS } from '../constants';
import type {
  BookPickupData,
  CompletePickupData,
  PickupResponse,
  PickupsListResponse,
  AvailableSlotsResponse,
  PickupFilters,
} from '../types';

export const pickupService = {
  /**
   * Get all scheduled pickups (Staff/Admin only)
   * @param filters Filtering by date, status, or claimant
   * @returns List of pickups
   */
  getAll: async (filters?: PickupFilters): Promise<PickupsListResponse> => {
    const response = await api.get<PickupsListResponse>(API_ENDPOINTS.PICKUPS.BASE, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get pickups scheduled by the current user
   * @param filters Filtering options
   * @returns User's scheduled pickups
   */
  getMyPickups: async (filters?: PickupFilters): Promise<PickupsListResponse> => {
    const response = await api.get<PickupsListResponse>(`${API_ENDPOINTS.PICKUPS.BASE}/my-pickups`, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get available time slots for booking a pickup
   * @param date Optional date to check slots for
   * @returns List of available slot times
   */
  getAvailableSlots: async (date?: string): Promise<AvailableSlotsResponse> => {
    const response = await api.get<AvailableSlotsResponse>(
      API_ENDPOINTS.PICKUPS.SLOTS,
      { params: { date } }
    );
    return response.data;
  },

  /**
   * Book a new pickup appointment for a verified claim
   * @param data Date and time selection
   * @returns Created pickup details
   */
  book: async (data: BookPickupData): Promise<PickupResponse> => {
    const response = await api.post<PickupResponse>(API_ENDPOINTS.PICKUPS.BASE, data);
    return response.data;
  },

  /**
   * Verify and complete an item handoff (Staff/Admin only)
   * @param id Pickup ID
   * @param data Confirmation artifacts (e.g., QR code or Ref code)
   * @returns Updated pickup status
   */
  complete: async (id: string, data: CompletePickupData): Promise<PickupResponse> => {
    const response = await api.post<PickupResponse>(
      API_ENDPOINTS.PICKUPS.COMPLETE(id),
      data
    );
    return response.data;
  },

  /**
   * Get details for a specific pickup appointment
   * @param id Pickup ID
   * @returns Detailed pickup profile with status
   */
  getById: async (id: string): Promise<PickupResponse> => {
    const response = await api.get<PickupResponse>(API_ENDPOINTS.PICKUPS.BY_ID(id));
    return response.data;
  },
};
