import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

export function useQueryFilters<T extends Record<string, unknown>>(
  initialFilters: T,
  delay = 500,
  preserveParams = false
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setInternalFilters] = useState<T>(initialFilters);
  const debouncedFilters = useDebounce(filters, delay);

  const setFilters = useCallback((newFilters: Partial<T> | ((prev: T) => Partial<T>)) => {
    setInternalFilters((prev) => {
      const updated = typeof newFilters === 'function' ? { ...prev, ...newFilters(prev) } : { ...prev, ...newFilters };
      
      const params = new URLSearchParams(preserveParams ? searchParams : undefined);
      
      Object.entries(updated).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });
      
      setSearchParams(params, { replace: true });
      return updated as T;
    });
  }, [searchParams, setSearchParams, preserveParams]);

  return {
    filters,
    setFilters,
    debouncedFilters,
    searchParams
  };
}
