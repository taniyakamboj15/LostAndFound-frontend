import { useMemo, useCallback, useState, useEffect, useRef } from 'react';

/**
 * Custom hook for optimized filtering logic
 * Uses useMemo to cache filtered results and useCallback for stable filter functions
 */
export function useOptimizedFilter<T>(
  items: T[],
  filterFn: (item: T) => boolean
) {
  const filteredItems = useMemo(() => {
    return items.filter(filterFn);
  }, [items, filterFn]);

  return filteredItems;
}

/**
 * Custom hook for optimized sorting logic
 */
export function useOptimizedSort<T>(
  items: T[],
  sortFn: (a: T, b: T) => number
) {
  const sortedItems = useMemo(() => {
    return [...items].sort(sortFn);
  }, [items, sortFn]);

  return sortedItems;
}

/**
 * Custom hook for debounced search
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for stable event handlers
 */
export function useStableCallback<Args extends unknown[], R>(
  callback: (...args: Args) => R
): (...args: Args) => R {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Args) => {
    return callbackRef.current(...args);
  }, []);
}
