import api from './api';
import { API_ENDPOINTS } from '../constants';
import {
  AnalyticsResponse,
  CategoryBreakdownResponse,
  TrendsResponse,
  DispositionStatsResponse,
} from '../types';

export const analyticsService = {
  // Get dashboard metrics
  getDashboard: async (): Promise<AnalyticsResponse> => {
    const response = await api.get<AnalyticsResponse>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD
    );
    return response.data;
  },

  // Get category breakdown
  getCategoryBreakdown: async (): Promise<CategoryBreakdownResponse> => {
    const response = await api.get<CategoryBreakdownResponse>(
      API_ENDPOINTS.ANALYTICS.CATEGORY_BREAKDOWN
    );
    return response.data;
  },

  // Get trends data
  getTrends: async (dateFrom?: string, dateTo?: string): Promise<TrendsResponse> => {
    const response = await api.get<TrendsResponse>(API_ENDPOINTS.ANALYTICS.TRENDS, {
      params: { dateFrom, dateTo },
    });
    return response.data;
  },

  // Get disposition stats
  getDispositionStats: async (): Promise<DispositionStatsResponse> => {
    const response = await api.get<DispositionStatsResponse>(
      API_ENDPOINTS.ANALYTICS.DISPOSITION_STATS
    );
    return response.data;
  },
};
