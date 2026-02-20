import { useState, useCallback, useEffect } from 'react';
import { transferService } from '@services/transfer.service';
import { useToast } from './useToast';
import { Transfer, TransferFilters } from '@app-types/index';

export const useTransfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchTransfers = useCallback(async (filters?: TransferFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await transferService.getAll(filters);
      setTransfers(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transfers';
      setError(errorMessage);
      toast.error('Failed to fetch transfers');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateTransferStatus = useCallback(async (id: string, status: string, details?: { carrierInfo?: string; notes?: string }) => {
    setIsLoading(true);
    try {
      const response = await transferService.updateStatus(id, { status, ...details });
      setTransfers(prev => prev.map(t => t._id === id ? response.data : t));
      toast.success(response.message || `Transfer marked as ${status.toLowerCase()}`);
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transfer status';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    transfers,
    isLoading,
    error,
    fetchTransfers,
    updateTransferStatus
  };
};

export const useTransferDetail = (claimId?: string) => {
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const fetchTransferByClaim = useCallback(async () => {
    if (!claimId) return;
    setIsLoading(true);
    try {
      const response = await transferService.getByClaimId(claimId);
      setTransfer(response.data[0] || null); // getByClaimId returns an array/response with data array
    } catch (err) {
      // Quietly fail if no transfer exists
      setTransfer(null);
    } finally {
      setIsLoading(false);
    }
  }, [claimId]);

  useEffect(() => { fetchTransferByClaim(); }, [fetchTransferByClaim]);

  return { transfer, isLoading, refresh: fetchTransferByClaim };
};
