import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

import { PublicItem, ApiResponse } from '../types';

import { PublicSearchFilters } from '../types/ui.types';

export const usePublicSearch = () => {
  const [filters, setFilters] = useState<PublicSearchFilters>({
    keyword: '',
    category: '',
    location: '',
    dateFrom: '',
    dateTo: '',
  });
  const debouncedFilters = useDebounce(filters, 500);
  const [items, setItems] = useState<PublicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (currentFilters: PublicSearchFilters = debouncedFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (currentFilters.keyword) queryParams.append('keyword', currentFilters.keyword);
      if (currentFilters.category) queryParams.append('category', currentFilters.category);
      if (currentFilters.location) queryParams.append('location', currentFilters.location);
      if (currentFilters.dateFrom) queryParams.append('dateFoundFrom', currentFilters.dateFrom);
      if (currentFilters.dateTo) queryParams.append('dateFoundTo', currentFilters.dateTo);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/items/public/search?${queryParams.toString()}`);
      const data: ApiResponse<PublicItem[]> = await response.json();
      
      if (data.success && data.data) {
        setItems(data.data);
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to search items';
      console.error('Search failed', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters]);

  const updateFilters = useCallback((newFilters: PublicSearchFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    const cleared: PublicSearchFilters = {
      keyword: '',
      category: '',
      location: '',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(cleared);
    // Debounce will handle the fetch
  }, []);

  useEffect(() => {
    fetchItems(debouncedFilters);
  }, [debouncedFilters]); // Trigger fetch when debounced filters change

  return useMemo(() => ({
    items,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    search: fetchItems,
  }), [items, isLoading, error, filters, updateFilters, clearFilters, fetchItems]);
};
