import api from './api';
import { FeeBreakdown } from '../types/ui.types';


const getIdempotencyKey = (claimId: string): string => {
  const storageKey = `idem_${claimId}`;
  let key = sessionStorage.getItem(storageKey);
  if (!key) {
    key = `${claimId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(storageKey, key);
  }
  return key;
};

export const clearIdempotencyKey = (claimId: string): void => {
  sessionStorage.removeItem(`idem_${claimId}`);
};

export const paymentService = {
  getFeeBreakdown: (claimId: string) => {
    return api.get<{ success: boolean; data: FeeBreakdown }>(
      `/api/payments/fee-breakdown/${claimId}`
    );
  },


  createPaymentIntent: (claimId: string) => {
    const idempotencyKey = getIdempotencyKey(claimId);
    return api.post<{
      success: boolean;
      data: {
        clientSecret: string;
        breakdown: FeeBreakdown;
        paymentIntentId: string;
      };
    }>(
      '/api/payments/create-intent',
      { claimId },
      { headers: { 'Idempotency-Key': idempotencyKey } }
    );
  },

  verifyPayment: (paymentIntentId: string, claimId: string) => {
    return api.post<{ success: boolean; message: string }>(
      '/api/payments/verify',
      { paymentIntentId, claimId }
    );
  },
};
