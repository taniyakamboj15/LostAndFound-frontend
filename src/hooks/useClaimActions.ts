import { useState, useCallback } from 'react';
import { ClaimStatus } from '@constants/status';
import { useClaimDetail } from './useClaimDetail';

export const useClaimActions = (claimId: string | null) => {
  const { claim, isLoading, error, updateStatus, refresh } = useClaimDetail(claimId);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = useCallback(async () => {
    if (!claimId) return;
    setIsSubmitting(true);
    try {
      await updateStatus(ClaimStatus.VERIFIED);
      await refresh();
    } catch (error) {
      // Error handled by useClaimDetail/service
    } finally {
      setIsSubmitting(false);
    }
  }, [claimId, updateStatus, refresh]);

  const handleReject = useCallback(async () => {
    if (!claimId || !rejectionReason.trim()) return;

    setIsSubmitting(true);
    try {
      await updateStatus(ClaimStatus.REJECTED, rejectionReason);
      setIsRejectModalOpen(false);
      await refresh();
    } catch (error) {
      // Error handled by useClaimDetail/service
    } finally {
      setIsSubmitting(false);
    }
  }, [claimId, rejectionReason, updateStatus, refresh]);

  const openRejectModal = useCallback(() => {
    setRejectionReason('');
    setIsRejectModalOpen(true);
  }, []);

  const closeRejectModal = useCallback(() => {
    setIsRejectModalOpen(false);
    setRejectionReason('');
  }, []);

  return {
    claim,
    isLoading,
    error,
    isSubmitting,
    isRejectModalOpen,
    rejectionReason,
    setRejectionReason,
    handleVerify,
    handleReject,
    openRejectModal,
    closeRejectModal
  };
};
