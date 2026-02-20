import { useState, useCallback } from 'react';
import { usePickups } from './usePickups';

export const usePickupsListPage = () => {
  const { 
    pickups, 
    isLoading, 
    error, 
    filters, 
    updateFilters, 
    pagination, 
    handlePageChange, 
    refresh 
  } = usePickups();
  
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    updateFilters({ ...filters, [key]: value, page: 1 });
  }, [filters, updateFilters]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return {
    pickups,
    isLoading,
    error,
    filters,
    pagination,
    viewMode,
    setViewMode,
    showFilters,
    toggleFilters,
    handleSearch,
    handleFilterChange,
    handlePageChange
  };
};
