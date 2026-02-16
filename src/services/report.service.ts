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
  // Get all lost reports
  getAll: async (filters?: LostReportFilters): Promise<LostReportsListResponse> => {
    const response = await api.get<LostReportsListResponse>(
      API_ENDPOINTS.LOST_REPORTS.BASE,
      { params: filters }
    );
    return response.data;
  },

  // Get my reports (Claimant)
  getMyReports: async (filters?: LostReportFilters): Promise<LostReportsListResponse> => {
    const response = await api.get<LostReportsListResponse>(
      API_ENDPOINTS.LOST_REPORTS.MY_REPORTS,
      { params: filters }
    );
    return response.data;
  },

  // Get report by ID
  getById: async (id: string): Promise<LostReportResponse> => {
    const response = await api.get<LostReportResponse>(
      API_ENDPOINTS.LOST_REPORTS.BY_ID(id)
    );
    return response.data;
  },

  // Create new lost report
  create: async (data: CreateLostReportData): Promise<LostReportResponse> => {
    const response = await api.post<LostReportResponse>(
      API_ENDPOINTS.LOST_REPORTS.BASE,
      data
    );
    return response.data;
  },

  // Update lost report
  update: async (id: string, data: UpdateLostReportData): Promise<LostReportResponse> => {
    const response = await api.patch<LostReportResponse>(
      API_ENDPOINTS.LOST_REPORTS.BY_ID(id),
      data
    );
    return response.data;
  },

  // Get matches for report
  getMatches: async (id: string): Promise<MatchesResponse> => {
    const response = await api.get<MatchesResponse>(
      API_ENDPOINTS.MATCHES.FOR_REPORT(id)
    );
    return response.data;
  },
};
