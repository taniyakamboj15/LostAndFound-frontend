import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePickupDetail } from './usePickups';
import { useAuth } from './useAuth';

export const usePickupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { pickup, isLoading, isCompleting, completePickup, refresh } = usePickupDetail(id);
  const { isStaff, isAdmin } = useAuth();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const openScanModal = useCallback(() => {
    setIsScanModalOpen(true);
  }, []);

  const closeScanModal = useCallback(() => {
    setIsScanModalOpen(false);
  }, []);

  const onVerifySuccess = useCallback(() => {
    setIsScanModalOpen(false);
    refresh();
  }, [refresh]);

  return {
    pickup,
    isLoading,
    isCompleting,
    completePickup,
    isStaff,
    isAdmin,
    isScanModalOpen,
    openScanModal,
    closeScanModal,
    onVerifySuccess
  };
};
