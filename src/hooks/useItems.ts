import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '@services/item.service';
import { useToast } from './useToast';
import { getErrorMessage } from '@utils/errors';
import type { Item, ItemFilters as ServiceItemFilters, CreateItemData, UpdateItemData } from '../types/item.types';
import type { ItemCategory } from '@constants/categories';

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

interface ItemFilters {
  keyword?: string;
  category?: ItemCategory | '';
  status?: string;
}

export const useItemsList = (initialFilters: ItemFilters = {}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ItemFilters>(initialFilters);
  const toast = useToast();

  const fetchItems = useCallback(async (currentFilters: ItemFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await itemService.getItems(currentFilters as ServiceItemFilters);
      setItems(response.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  const updateFilters = useCallback((newFilters: ItemFilters) => {
    setFilters(newFilters);
    fetchItems(newFilters);
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return useMemo(() => ({
    items,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: fetchItems,
  }), [items, isLoading, error, filters, updateFilters, fetchItems]);
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
