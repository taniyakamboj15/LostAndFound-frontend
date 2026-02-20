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
  /**
   * Get all claims in the system (Staff/Admin only)
   * @param filters Filtering options (status, date, etc.)
   * @returns List of claims
   */
  getAll: async (filters?: ClaimFilters): Promise<ClaimsListResponse> => {
    const response = await api.get<ClaimsListResponse>(API_ENDPOINTS.CLAIMS.BASE, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get claims filed by the current user
   * @param filters Filtering options
   * @returns List of user's claims
   */
  getMyClaims: async (filters?: ClaimFilters): Promise<ClaimsListResponse> => {
    const response = await api.get<ClaimsListResponse>(API_ENDPOINTS.CLAIMS.MY_CLAIMS, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get details for a specific claim
   * @param id Claim ID
   * @returns Full claim details
   */
  getById: async (id: string): Promise<ClaimResponse> => {
    const response = await api.get<ClaimResponse>(API_ENDPOINTS.CLAIMS.BY_ID(id));
    return response.data;
  },

  /**
   * File a new claim for a found item
   * @param data Claim details
   * @returns Created claim response
   */
  create: async (data: CreateClaimData): Promise<ClaimResponse> => {
    const response = await api.post<ClaimResponse>(API_ENDPOINTS.CLAIMS.BASE, data);
    return response.data;
  },

  /**
   * Upload ownership/identity proof for a claim
   * @param id Claim ID
   * @param data Files and document type
   * @returns Updated claim response
   */
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

  /**
   * Verify and approve a claim (Staff/Admin only)
   * @param id Claim ID
   * @param data Verification notes
   * @returns Approved claim response
   */
  verify: async (id: string, data: VerifyClaimData): Promise<ClaimResponse> => {
    const response = await api.post<ClaimResponse>(
      API_ENDPOINTS.CLAIMS.VERIFY(id),
      data
    );
    return response.data;
  },

  /**
   * Reject a claim (Staff/Admin only)
   * @param id Claim ID
   * @param data Rejection reason
   * @returns Rejected claim response
   */
  reject: async (id: string, data: RejectClaimData): Promise<ClaimResponse> => {
    const response = await api.post<ClaimResponse>(
      API_ENDPOINTS.CLAIMS.REJECT(id),
      data
    );
    return response.data;
  },

  /**
   * Request identity/ownership proof from claimant manually (Staff/Admin only)
   * @param id Claim ID
   * @returns Updated claim response
   */
  requestProof: async (id: string): Promise<ClaimResponse> => {
    const response = await api.post<ClaimResponse>(
      API_ENDPOINTS.CLAIMS.REQUEST_PROOF(id)
    );
    return response.data;
  },
  /**
   * File an anonymous claim for a found item
   * @param data Claim details including email
   * @returns Created claim response
   */
  fileAnonymous: async (data: { itemId: string; email: string; description: string } | FormData): Promise<ClaimResponse> => {
    const response = await api.post<ClaimResponse>(API_ENDPOINTS.CLAIMS.ANONYMOUS, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
    return response.data;
  },

  /**
   * Delete a claim
   * @param id Claim ID
   * @returns Success response
   */
  deleteClaim: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(API_ENDPOINTS.CLAIMS.BY_ID(id));
    return response.data;
  },
};
