
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (currentFilters: PublicSearchFilters = debouncedFilters, pageNum: number = pagination.page) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (currentFilters.keyword) queryParams.append('keyword', currentFilters.keyword);
      if (currentFilters.category) queryParams.append('category', currentFilters.category);
      if (currentFilters.location) queryParams.append('location', currentFilters.location);
      if (currentFilters.dateFrom) queryParams.append('dateFoundFrom', currentFilters.dateFrom);
      if (currentFilters.dateTo) queryParams.append('dateFoundTo', currentFilters.dateTo);
      
      queryParams.append('page', pageNum.toString());
      queryParams.append('limit', pagination.limit.toString());

      const response = await api.get<ApiResponse<PublicItem[]>>(
        `${API_ENDPOINTS.PUBLIC.ITEMS}?${queryParams.toString()}`
      );
      
      if (response.data.success && response.data.data) {
        setItems(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
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
  }, [debouncedFilters, pagination.limit, pagination.page]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const updateFilters = useCallback((newFilters: PublicSearchFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
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
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  useEffect(() => {
    fetchItems(debouncedFilters, pagination.page);
  }, [debouncedFilters, pagination.page, fetchItems]);

  return useMemo(() => ({
    items,
    pagination,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    setPage,
    search: fetchItems,
  }), [items, pagination, isLoading, error, filters, updateFilters, clearFilters, setPage, fetchItems]);
};
