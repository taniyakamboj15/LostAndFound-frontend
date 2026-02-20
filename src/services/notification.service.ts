import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { Notification, NotificationsResponse } from '../types';

export const notificationService = {
  getNotifications: async (page = 1, limit = 10, unreadOnly = false): Promise<NotificationsResponse> => {
    const res = await api.get<NotificationsResponse>(API_ENDPOINTS.NOTIFICATIONS.BASE, {
      params: { page, limit, unreadOnly }
    });
    return res.data;
  },

  markAsRead: async (id: string): Promise<{ success: boolean; data: Notification }> => {
    const res = await api.patch<{ success: boolean; data: Notification }>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return res.data;
  },

  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    const res = await api.patch<{ success: boolean; message: string }>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return res.data;
  },

  deleteNotification: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete<{ success: boolean; message: string }>(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`);
    return res.data;
  },

  clearAll: async (): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete<{ success: boolean; message: string }>(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return res.data;
  }
};
