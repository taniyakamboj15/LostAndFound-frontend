import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePickupVerification = (onSuccess?: (pickupData: { _id: string }) => void) => {
  const navigate = useNavigate();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const openScanModal = useCallback(() => {
    setIsScanModalOpen(true);
  }, []);

  const closeScanModal = useCallback(() => {
    setIsScanModalOpen(false);
  }, []);

  const handleVerifySuccess = useCallback((pickupData: { _id: string }) => {
    if (onSuccess) {
      onSuccess(pickupData);
    } else {
      navigate(`/pickups/${pickupData._id}`);
    }
  }, [navigate, onSuccess]);

  return {
    isScanModalOpen,
    openScanModal,
    closeScanModal,
    handleVerifySuccess
  };
};
