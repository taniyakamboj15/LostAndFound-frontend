import api from './api';
import { API_ENDPOINTS } from '../constants';
import {
  CreateLostReportData,
  UpdateLostReportData,
  LostReportFilters,
  LostReportResponse,
  LostReportsListResponse,
  MatchesResponse,
} from '../types';

export const reportService = {
  /**
   * Get all lost reports in the system (Staff/Admin only)
   * @param filters Filtering criteria (status, date, user)
   * @returns List of lost reports
   */
  getAll: async (filters?: LostReportFilters): Promise<LostReportsListResponse> => {
    const response = await api.get<LostReportsListResponse>(
      API_ENDPOINTS.LOST_REPORTS.BASE,
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get lost reports submitted by the current user
   * @param filters Filtering options
   * @returns List of user's reports
   */
  getMyReports: async (filters?: LostReportFilters): Promise<LostReportsListResponse> => {
    const response = await api.get<LostReportsListResponse>(
      API_ENDPOINTS.LOST_REPORTS.MY_REPORTS,
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get details for a specific lost report
   * @param id Report ID
   * @returns Detailed report profile
   */
  getById: async (id: string): Promise<LostReportResponse> => {
    const response = await api.get<LostReportResponse>(
      API_ENDPOINTS.LOST_REPORTS.BY_ID(id)
    );
    return response.data;
  },

  /**
   * Submit a new lost report
   * @param data Item description and details
   * @returns Created report response
   */
  create: async (data: CreateLostReportData): Promise<LostReportResponse> => {
    const response = await api.post<LostReportResponse>(
      API_ENDPOINTS.LOST_REPORTS.BASE,
      data
    );
    return response.data;
  },

  /**
   * Update details of an existing lost report
   * @param id Report ID
   * @param data Partial update data
   * @returns Updated report response
   */
  update: async (id: string, data: UpdateLostReportData): Promise<LostReportResponse> => {
    const response = await api.patch<LostReportResponse>(
      API_ENDPOINTS.LOST_REPORTS.BY_ID(id),
      data
    );
    return response.data;
  },

  /**
   * Get potential found item matches for this report
   * @param id Report ID
   * @returns List of potential item matches
   */
  getMatches: async (id: string): Promise<MatchesResponse> => {
    const response = await api.get<MatchesResponse>(
      API_ENDPOINTS.MATCHES.FOR_REPORT(id)
    );
    return response.data;
  },
};
