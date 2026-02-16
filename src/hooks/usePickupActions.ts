import { useCallback } from 'react';
import { usePickupDetail } from './usePickups';
import { useNavigate } from 'react-router-dom';

export const usePickupActions = (pickupId: string | undefined) => {
  const navigate = useNavigate();
  const { pickup, isLoading, isCompleting, error, completePickup, refresh } = usePickupDetail(pickupId);

  const handleCompletePickup = useCallback(async () => {
    if (!pickup) return;
    
    // Use reference code if available, otherwise fallback to empty string (handling done in usePickupDetail)
    const code = pickup.referenceCode || '';
    const success = await completePickup(code);
    
    if (success) {
      navigate('/pickups');
    }
  }, [pickup, completePickup, navigate]);

  return {
    pickup,
    isLoading,
    isCompleting,
    error,
    completePickup,
    handleCompletePickup,
    refresh
  };
};
