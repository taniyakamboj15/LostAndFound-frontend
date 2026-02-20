import api from './api';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';

export interface DispositionAuditEntry {
  action: string;
  timestamp: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  details: string;
}

export interface Disposition {
  _id: string;
  itemId: string;
  type: string;
  processedBy: {
    _id: string;
    name: string;
    email: string;
  };
  processedAt: string;
  recipient?: string;
  notes?: string;
  auditTrail: DispositionAuditEntry[];
}

export const dispositionService = {
  getById: async (id: string): Promise<ApiResponse<Disposition>> => {
    const response = await api.get<ApiResponse<Disposition>>(API_ENDPOINTS.DISPOSITION.BY_ID(id));
    return response.data;
  },

  getByItemId: async (itemId: string): Promise<ApiResponse<Disposition | null>> => {
    const response = await api.get<ApiResponse<Disposition | null>>(API_ENDPOINTS.DISPOSITION.BY_ITEM(itemId));
    return response.data;
  },
};
