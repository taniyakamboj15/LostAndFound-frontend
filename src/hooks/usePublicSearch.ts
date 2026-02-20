
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import api from '../services/api';
import { PublicItem, ApiResponse } from '../types';
import { PublicSearchFilters } from '../types/ui.types';

import { API_ENDPOINTS } from '../constants/api';

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

      const response = await api.get<ApiResponse<PublicItem[]>>(
        `${API_ENDPOINTS.PUBLIC.ITEMS}?${queryParams.toString()}`
      );
      
      if (response.data.success && response.data.data) {
        setItems(response.data.data);
      } else {
        throw new Error(response.data.message || 'Search failed');
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
  }, []);

  useEffect(() => {
    fetchItems(debouncedFilters);
  }, [debouncedFilters, fetchItems]);

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
