import { useState, useCallback, useMemo, useEffect } from 'react';
import { claimService } from '@services/claim.service';
import { useToast } from './useToast';
import { ClaimStatus } from '@constants/status';
import { Claim, VerifyClaimData, RejectClaimData } from '../types/claim.types';
import { ApiError } from '../types/api.types';

export const useClaimDetail = (id: string | null) => {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchClaim = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await claimService.getById(id);
      setClaim(response.data);
    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error.message || 'Failed to fetch claim details';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  const verifyClaim = useCallback(async (data: VerifyClaimData = {}) => {
    if (!id) return;
    try {
      await claimService.verify(id, data);
      toast.success('Claim verified successfully');
      await fetchClaim();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to verify claim');
      throw error;
    }
  }, [id, toast, fetchClaim]);

  const rejectClaim = useCallback(async (data: RejectClaimData) => {
    if (!id) return;
    try {
      await claimService.reject(id, data);
      toast.success('Claim rejected successfully');
      await fetchClaim();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to reject claim');
      throw error;
    }
  }, [id, toast, fetchClaim]);

  const updateStatus = useCallback(async (status: ClaimStatus, reason?: string) => {
    if (!id) return;
    try {
      if (status === ClaimStatus.VERIFIED) {
        await verifyClaim();
      } else if (status === ClaimStatus.REJECTED) {
        await rejectClaim({ reason: reason || 'No reason provided' });
      } else {
        // Handle other status updates if needed
        toast.error(`Status update to ${status} not implemented in this hook`);
      }
    } catch (err: unknown) {
      // Error already handled in verify/reject
      throw err as ApiError;
    }
  }, [id, verifyClaim, rejectClaim, toast]);

  useEffect(() => {
    fetchClaim();
  }, [fetchClaim]);

  return useMemo(() => ({
    claim,
    isLoading,
    error,
    verifyClaim,
    rejectClaim,
    updateStatus,
    refresh: fetchClaim,
  }), [claim, isLoading, error, verifyClaim, rejectClaim, updateStatus, fetchClaim]);
};
