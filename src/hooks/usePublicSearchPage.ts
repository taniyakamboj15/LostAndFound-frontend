import { useState, useCallback } from 'react';
import { usePublicSearch } from './usePublicSearch';

export const usePublicSearchPage = () => {
  const { 
    items, 
    isLoading, 
    error, 
    filters, 
    updateFilters, 
    clearFilters, 
    search 
  } = usePublicSearch();
  
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = useCallback((key: string, value: string) => {
    updateFilters({ ...filters, [key]: value });
  }, [filters, updateFilters]);

  const handleSearch = useCallback(() => {
    search(filters);
  }, [filters, search]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return {
    items,
    isLoading,
    error,
    filters,
    clearFilters,
    showFilters,
    toggleFilters,
    handleFilterChange,
    handleSearch
  };
};
