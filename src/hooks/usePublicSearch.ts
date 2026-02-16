import { useState, useEffect, useCallback, useMemo } from 'react';
import { ItemCategory } from '@constants/categories';
import { PublicItem, ApiResponse } from '../types';

interface SearchFilters {
  keyword: string;
  category: ItemCategory | '';
  location: string;
  dateFrom: string;
  dateTo: string;
}

export const usePublicSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    category: '',
    location: '',
    dateFrom: '',
    dateTo: '',
  });
  const [items, setItems] = useState<PublicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (currentFilters: SearchFilters = filters) => {
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
  }, [filters]);

  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    const cleared = {
      keyword: '',
      category: '' as const,
      location: '',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(cleared);
    fetchItems(cleared);
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, []); // Initial fetch only on mount

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
