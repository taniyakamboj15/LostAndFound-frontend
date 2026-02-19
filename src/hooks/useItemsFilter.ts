import { useState, useMemo, useCallback } from 'react';
import { ITEM_CATEGORIES } from '@constants/categories';
import { ITEM_STATUS } from '@constants/status';
import { AdminItemFilters } from '../types/ui.types';
import { useItemsList } from './useItems';

export const useItemsFilter = () => {
  const { items, isLoading, error, filters, updateFilters, refresh, pagination } = useItemsList();
  const [showFilters, setShowFilters] = useState(false);

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'All Categories' },
      ...Object.entries(ITEM_CATEGORIES).map(([key, cat]) => ({
        value: key,
        label: cat.label,
      })),
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'All Statuses' },
      ...Object.entries(ITEM_STATUS).map(([key, status]) => ({
        value: key,
        label: status.label,
      })),
    ],
    []
  );

  const handleFilterChange = useCallback(
    (key: keyof AdminItemFilters, value: string) => {
      updateFilters({ ...filters, [key]: value, page: 1 }); // Reset to page 1 on filter change
    },
    [filters, updateFilters]
  );

  const handlePageChange = useCallback((page: number) => {
    updateFilters({ ...filters, page });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    refresh();
  }, [refresh]);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    updateFilters({ keyword: '', category: '', status: '', page: 1 });
  }, [updateFilters]);

  return {
    items,
    isLoading,
    error,
    filters,
    showFilters,
    categoryOptions,
    statusOptions,
    handleFilterChange,
    handleSearch,
    toggleFilters,
    clearFilters,
    pagination: pagination || { page: 1, limit: 10, total: 0, pages: 1 },
    handlePageChange
  };
};
