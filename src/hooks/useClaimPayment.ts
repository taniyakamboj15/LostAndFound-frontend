import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { paymentService, clearIdempotencyKey } from '../services/payment.service';
import { ClaimStatus, PaymentStatus } from '../constants/status';
import type { FeeBreakdown } from '../types/ui.types';
import type { Claim } from '../types';

export const useClaimPayment = (claim: Claim | null, isClaimant: boolean, refreshClaim: () => Promise<void>) => {
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loadingFee, setLoadingFee] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);


  useEffect(() => {
    if (claim?.status === ClaimStatus.VERIFIED && claim.paymentStatus !== PaymentStatus.PAID && isClaimant) {
      setLoadingFee(true);
      const claimId = claim._id;
      paymentService.getFeeBreakdown(claimId)
        .then(res => setFeeBreakdown(res.data.data))
        .catch(() => toast.error('Could not load fee details. Please refresh the page.'))
        .finally(() => setLoadingFee(false));
    }
  }, [claim, isClaimant]);

  const handlePayClick = async () => {
    if (!claim || !feeBreakdown) return;
    setIsPayLoading(true);
    try {
      const claimId = claim._id;
      const res = await paymentService.createPaymentIntent(claimId);
      setClientSecret(res.data.data.clientSecret);
      setFeeBreakdown(res.data.data.breakdown);
      setIsPaymentModalOpen(true);
    } catch (error) {
       const err = error as AxiosError<{ message: string }>;
       toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setIsPayLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
     if (!claim) return;
     try {
       const claimId = claim._id;
       await paymentService.verifyPayment(paymentIntentId, claimId);
       clearIdempotencyKey(claimId);
       setIsPaymentModalOpen(false);
       toast.success('Payment successful! You can now schedule your pickup.');
       await refreshClaim();
     } catch (error) {
       const err = error as AxiosError<{ message: string }>;
       toast.error(err.response?.data?.message || 'Payment verification failed');
     }
  };

  return {
    feeBreakdown,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    clientSecret,
    loadingFee,
    isPayLoading,
    handlePayClick,
    handlePaymentSuccess
  };
};
