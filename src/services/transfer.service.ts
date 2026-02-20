import api from './api';
import { TransferFilters, TransferResponse, SingleTransferResponse } from '../types';

export const transferService = {
  getAll: async (params?: TransferFilters): Promise<TransferResponse> => {
    const response = await api.get<TransferResponse>('/api/transfers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<SingleTransferResponse> => {
    const response = await api.get<SingleTransferResponse>(`/api/transfers/${id}`);
    return response.data;
  },

  getByClaimId: async (claimId: string): Promise<SingleTransferResponse> => {
    const response = await api.get<SingleTransferResponse>(`/api/transfers/claim/${claimId}`);
    return response.data;
  },

  updateStatus: async (id: string, data: { status: string; carrierInfo?: string; notes?: string }): Promise<SingleTransferResponse> => {
    const response = await api.patch<SingleTransferResponse>(`/api/transfers/${id}/status`, data);
    return response.data;
  }
};
