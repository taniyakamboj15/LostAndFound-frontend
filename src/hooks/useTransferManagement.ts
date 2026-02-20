import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTransfers } from './useTransfers';
import { Transfer, TransferStatus, Item, Claim } from '@app-types/index';

export type FilterStatus = 'ALL' | TransferStatus;

export const useTransferManagement = () => {
  const { transfers, isLoading, fetchTransfers, updateTransferStatus } = useTransfers();
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
    fetchTransfers();
  }, [fetchTransfers]);

  const filteredTransfers = useMemo(() => {
    return transfers.filter(t => {
      const item = typeof t.itemId === 'object' ? (t.itemId as Item) : null;
      const claim = typeof t.claimId === 'object' ? (t.claimId as Claim) : null;
      
      const itemDesc = item?.description?.toLowerCase() || '';
      const claimDesc = claim?.description?.toLowerCase() || '';
      
      const matchesSearch = 
        itemDesc.includes(searchTerm.toLowerCase()) || 
        claimDesc.includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === 'ALL' || t.status === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [transfers, searchTerm, activeFilter]);

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
    isLoading,
    fetchTransfers,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    filteredTransfers,
    selectedTransfer,
    isUpdateModalOpen,
    updateData,
    setUpdateData,
    handleOpenUpdate,
    handleUpdateStatus,
    closeUpdateModal
  };
};
