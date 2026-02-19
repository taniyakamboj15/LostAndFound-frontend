import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { itemService } from '@services/item.service';
import { useToast } from './useToast';
import { useDebounce } from './useDebounce';
import { getErrorMessage } from '@utils/errors';
import type { Item, ItemFilters as ServiceItemFilters, CreateItemData, UpdateItemData } from '../types/item.types';

import { AdminItemFilters } from '../types/ui.types';
import { ItemCategory } from '@constants/categories';
import { ItemStatus } from '@constants/status';

export const useItemDetail = (id: string | null) => {
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchItem = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await itemService.getById(id);
      setItem(response.data as Item);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return useMemo(() => ({
    item,
    isLoading,
    error,
    refresh: fetchItem,
  }), [item, isLoading, error, fetchItem]);
};

export const useItemsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  
  // Memoized initial filters to avoid recreation
  const initialFilters = useMemo<AdminItemFilters>(() => ({
    keyword: searchParams.get('keyword') || '',
    category: (searchParams.get('category') as ItemCategory) || '',
    status: (searchParams.get('status') as ItemStatus) || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
  }), []); // Only on mount

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminItemFilters>(initialFilters);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  
  const debouncedFilters = useDebounce(filters, 500);
  
  // Track active requests to avoid race conditions
  const requestCount = useRef(0);

  const fetchItems = useCallback(async (currentFilters: AdminItemFilters) => {
    const requestId = ++requestCount.current;
    setIsLoading(true);
    setError(null);

    try {
      const cleanFilters: ServiceItemFilters = {
        page: currentFilters.page,
        limit: currentFilters.limit
      };
      if (currentFilters.keyword) cleanFilters.keyword = currentFilters.keyword;
      if (currentFilters.category) cleanFilters.category = currentFilters.category as ItemCategory;
      if (currentFilters.status) cleanFilters.status = currentFilters.status as ItemStatus;

      const response = await itemService.getItems(cleanFilters);
      
      if (requestId === requestCount.current) {
        setItems(response.data);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            pages: response.pagination.totalPages
          });
        }
      }
    } catch (err: unknown) {
      if (requestId === requestCount.current) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message);
      }
    } finally {
      if (requestId === requestCount.current) {
        setIsLoading(false);
      }
    }
  }, [toast]);

  // Sync URL search params when filters change
  const updateFilters = useCallback((newFilters: AdminItemFilters) => {
    setFilters(newFilters);
    setIsLoading(true);

    const newParams = new URLSearchParams();
    if (newFilters.keyword) newParams.set('keyword', newFilters.keyword);
    if (newFilters.category) newParams.set('category', newFilters.category);
    if (newFilters.status) newParams.set('status', newFilters.status);
    if (newFilters.page && newFilters.page > 1) newParams.set('page', newFilters.page.toString());
    if (newFilters.limit && newFilters.limit !== 10) newParams.set('limit', newFilters.limit.toString());
    
    setSearchParams(newParams, { replace: true });
  }, [setSearchParams]);

  // Fetch when debounced filters change
  useEffect(() => {
    fetchItems(debouncedFilters);
  }, [debouncedFilters, fetchItems]);

  return useMemo(() => ({
    items,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: () => fetchItems(filters),
    pagination,
  }), [items, isLoading, error, filters, updateFilters, fetchItems, pagination]);
};

export const useCreateItem = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const createItem = useCallback(async (data: CreateItemData) => {
    setIsSubmitting(true);
    try {
      await itemService.create(data);
      toast.success('Item created successfully');
      navigate('/items');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, navigate]);

  return useMemo(() => ({ createItem, isSubmitting }), [createItem, isSubmitting]);
};

export const useUpdateItem = (id: string | null) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const updateItem = useCallback(async (data: UpdateItemData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await itemService.update(id, data);
      toast.success('Item updated successfully');
      navigate(`/items/${id}`);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [id, toast, navigate]);

  return useMemo(() => ({ updateItem, isSubmitting }), [updateItem, isSubmitting]);
};
