import { useState, useCallback } from 'react';
import { usePublicSearch } from './usePublicSearch';

export const usePublicSearchPage = () => {
  const { 
    items, 
    pagination,
    isLoading, 
    error, 
    filters, 
    updateFilters, 
    clearFilters, 
    setPage,
    search 
  } = usePublicSearch();
  
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((key: string, value: string) => {
    updateFilters({ ...filters, [key]: value });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    search(filters, 1); // Reset to page 1 on manual search
  }, [filters, search]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return {
    items,
    pagination,
    isLoading,
    error,
    filters,
    clearFilters,
    showFilters,
    toggleFilters,
    handleFilterChange,
    handleSearch,
    setPage
  };
};
