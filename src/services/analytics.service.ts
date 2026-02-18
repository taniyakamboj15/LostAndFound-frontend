import api from './api';
import { API_ENDPOINTS } from '../constants';
import {
  AnalyticsResponse,
  CategoryBreakdownResponse,
  TrendsResponse,
  DispositionStatsResponse,
} from '../types';

export const analyticsService = {
  /**
   * Get high-level system metrics for the dashboard
   * @returns Overview statistics
   */
  getDashboard: async (): Promise<AnalyticsResponse> => {
    const response = await api.get<AnalyticsResponse>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD
    );
    return response.data;
  },

  /**
   * Get distribution of items across categories
   * @returns Breakdown metrics
   */
  getCategoryBreakdown: async (): Promise<CategoryBreakdownResponse> => {
    const response = await api.get<CategoryBreakdownResponse>(
      API_ENDPOINTS.ANALYTICS.CATEGORY_BREAKDOWN
    );
    return response.data;
  },

  /**
   * Get historical trends for item recovery
   * @param dateFrom Optional start date
   * @param dateTo Optional end date
   * @returns Trend data points
   */
  getTrends: async (dateFrom?: string, dateTo?: string): Promise<TrendsResponse> => {
    const response = await api.get<TrendsResponse>(API_ENDPOINTS.ANALYTICS.TRENDS, {
      params: { dateFrom, dateTo },
    });
    return response.data;
  },

  /**
   * Get statistics on item dispositions (Donated, Disposed, etc.)
   * @returns Disposition metrics
   */
  getDispositionStats: async (): Promise<DispositionStatsResponse> => {
    const response = await api.get<DispositionStatsResponse>(
      API_ENDPOINTS.ANALYTICS.DISPOSITION_STATS
    );
    return response.data;
  },
};
