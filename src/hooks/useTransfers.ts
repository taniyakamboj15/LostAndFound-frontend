import { useState, useCallback, useEffect } from 'react';
import { transferService } from '@services/transfer.service';
import { useToast } from './useToast';
import { Transfer, TransferFilters, TransferStatus } from '@app-types/index';

export const useTransfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchTransfers = useCallback(async (filters?: TransferFilters, pageNum: number = pagination.page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await transferService.getAll({ 
        ...filters, 
        page: pageNum, 
        limit: pagination.limit 
      });
      setTransfers(response.data);
      if (response.pagination) {
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transfers';
      setError(errorMessage);
      toast.error('Failed to fetch transfers');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.limit, pagination.page, toast]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const updateTransferStatus = useCallback(async (id: string, status: TransferStatus, details?: { carrierInfo?: string; notes?: string }) => {
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
    pagination,
    isLoading,
    error,
    fetchTransfers,
    updateTransferStatus,
    setPage
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
      // The backend returns a single SingleTransferResponse
      setTransfer(response.data || null);
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
