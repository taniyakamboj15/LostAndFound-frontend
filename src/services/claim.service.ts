import api from './api';
import { API_ENDPOINTS } from '../constants';
import type {
  CreateClaimData,
  UploadProofData,
  VerifyClaimData,
  RejectClaimData,
  ClaimFilters,
  ClaimResponse,
  ClaimsListResponse,
} from '../types';

export const claimService = {
  // Get all claims
  getAll: async (filters?: ClaimFilters): Promise<ClaimsListResponse> => {
    const response = await api.get<ClaimsListResponse>(API_ENDPOINTS.CLAIMS.BASE, {
      params: filters,
    });
    return response.data;
  },

  // Get my claims (Claimant)
  getMyClaims: async (filters?: ClaimFilters): Promise<ClaimsListResponse> => {
    const response = await api.get<ClaimsListResponse>(API_ENDPOINTS.CLAIMS.MY_CLAIMS, {
      params: filters,
    });
    return response.data;
  },

  // Get claim by ID
  getById: async (id: string): Promise<ClaimResponse> => {
    const response = await api.get<ClaimResponse>(API_ENDPOINTS.CLAIMS.BY_ID(id));
    return response.data;
  },

  // Create new claim
  create: async (data: CreateClaimData): Promise<ClaimResponse> => {
    const response = await api.post<ClaimResponse>(API_ENDPOINTS.CLAIMS.BASE, data);
    return response.data;
  },

  // Upload proof documents
  uploadProof: async (id: string, data: UploadProofData): Promise<ClaimResponse> => {
    const formData = new FormData();
    
    formData.append('type', data.type);
    
    data.files.forEach((file: File) => {
      formData.append('files', file);
    });

    const response = await api.post<ClaimResponse>(
      API_ENDPOINTS.CLAIMS.PROOF(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Verify claim (Staff/Admin)
  verify: async (id: string, data: VerifyClaimData): Promise<ClaimResponse> => {
    const response = await api.post<ClaimResponse>(
      API_ENDPOINTS.CLAIMS.VERIFY(id),
      data
    );
    return response.data;
  },

  // Reject claim (Staff/Admin)
  reject: async (id: string, data: RejectClaimData): Promise<ClaimResponse> => {
    const response = await api.post<ClaimResponse>(
      API_ENDPOINTS.CLAIMS.REJECT(id),
      data
    );
    return response.data;
  },
};
