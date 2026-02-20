import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTransfers } from './useTransfers';
import { Transfer, TransferStatus} from '@app-types/index';

export type FilterStatus = 'ALL' | TransferStatus;

export const useTransferManagement = () => {
  const { 
    transfers, 
    pagination,
    isLoading, 
    fetchTransfers, 
    updateTransferStatus,
    setPage
  } = useTransfers();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
  
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({ 
    status: '' as TransferStatus | '', 
    carrierInfo: '', 
    notes: '' 
  });

  useEffect(() => {
    fetchTransfers({
      status: activeFilter === 'ALL' ? undefined : activeFilter,
      keyword: searchTerm
    }, pagination.page);
  }, [fetchTransfers, activeFilter, searchTerm, pagination.page]);

  const handleFilterChange = useCallback((filter: FilterStatus) => {
    setActiveFilter(filter);
    setPage(1);
  }, [setPage]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, [setPage]);

  const filteredTransfers = useMemo(() => {
    // Backend now handles filtering and pagination, but we keep this for initial consistency if needed
    // or just return transfers
    return transfers;
  }, [transfers]);

  const handleOpenUpdate = useCallback((transfer: Transfer, nextStatus: TransferStatus) => {
    setSelectedTransfer(transfer);
    setUpdateData({ 
      status: nextStatus, 
      carrierInfo: transfer.carrierInfo || '', 
      notes: '' 
    });
    setIsUpdateModalOpen(true);
  }, []);

  const handleUpdateStatus = useCallback(async () => {
    if (!selectedTransfer || !updateData.status) return;
    try {
      await updateTransferStatus(selectedTransfer._id, updateData.status, {
        carrierInfo: updateData.carrierInfo,
        notes: updateData.notes
      });
      setIsUpdateModalOpen(false);
    } catch (err) {
      // Error handled by hook
    }
  }, [selectedTransfer, updateData, updateTransferStatus]);

  const closeUpdateModal = useCallback(() => {
    setIsUpdateModalOpen(false);
    setSelectedTransfer(null);
  }, []);

  return {
    transfers,
    pagination,
    isLoading,
    fetchTransfers,
    searchTerm,
    setSearchTerm: handleSearchChange, // Use the one that resets page
    activeFilter,
    setActiveFilter: handleFilterChange, // Use the one that resets page
    filteredTransfers,
    selectedTransfer,
    isUpdateModalOpen,
    updateData,
    setUpdateData,
    handleOpenUpdate,
    handleUpdateStatus,
    closeUpdateModal,
    setPage,
    updateTransferStatus
  };
};
