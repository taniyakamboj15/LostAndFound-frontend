import api from './api';
import { API_ENDPOINTS } from '../constants';
import {
  AnalyticsResponse,
  CategoryBreakdownResponse,
  TrendsResponse,
  DispositionStatsResponse,
  PaymentAnalyticsResponse,
  StaffWorkload,
  PredictionAccuracy,
} from '../types';

export const analyticsService = {
 
  getDashboard: async (): Promise<AnalyticsResponse> => {
    const response = await api.get<AnalyticsResponse>(API_ENDPOINTS.ANALYTICS.DASHBOARD);
    return response.data;
  },

 
  getCategoryBreakdown: async (): Promise<CategoryBreakdownResponse> => {
    const response = await api.get<CategoryBreakdownResponse>(API_ENDPOINTS.ANALYTICS.CATEGORY_BREAKDOWN);
    return response.data;
  },

 
  getTrends: async (dateFrom?: string, dateTo?: string): Promise<TrendsResponse> => {
    const response = await api.get<TrendsResponse>(API_ENDPOINTS.ANALYTICS.TRENDS, {
      params: { dateFrom, dateTo },
    });
    return response.data;
  },

 
  getDispositionStats: async (): Promise<DispositionStatsResponse> => {
    const response = await api.get<DispositionStatsResponse>(API_ENDPOINTS.ANALYTICS.DISPOSITION_STATS);
    return response.data;
  },

 
  getPaymentAnalytics: async (): Promise<PaymentAnalyticsResponse> => {
    const response = await api.get<PaymentAnalyticsResponse>(API_ENDPOINTS.PAYMENTS.ANALYTICS);
    return response.data;
  },

  getStaffWorkload: async (): Promise<{ success: boolean; data: StaffWorkload }> => {
    const response = await api.get<{ success: boolean; data: StaffWorkload }>(API_ENDPOINTS.ANALYTICS.STAFF_WORKLOAD);
    return response.data;
  },

  getPredictionAccuracy: async (): Promise<{ success: boolean; data: PredictionAccuracy[] }> => {
    const response = await api.get<{ success: boolean; data: PredictionAccuracy[] }>(API_ENDPOINTS.ANALYTICS.PREDICTION_ACCURACY);
    return response.data;
  },
};
