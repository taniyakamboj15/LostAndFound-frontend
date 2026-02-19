import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '@utils/errors';
import { pickupService } from '@services/pickup.service';
import { useToast } from './useToast';
import { useQueryFilters } from './useQueryFilters';
import type { Pickup, PickupFilters } from '../types/pickup.types';
import { useAuth } from './useAuth';



export const usePickups = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Initialize filters from URL
  const initialFilters: PickupFilters = useMemo(() => ({
    isCompleted: searchParams.get('isCompleted') || undefined,
    pickupDate: searchParams.get('pickupDate') || undefined,
  }), []); // Run once on mount

  const { filters, setFilters, debouncedFilters } = useQueryFilters<PickupFilters>(initialFilters);

  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchPickups = useCallback(async (currentFilters: PickupFilters = debouncedFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) return;

      let response;
      // Admin/Staff can see all, Claimant sees theirs
      // The backend now supports filters for both endpoints
      if (user.role === 'CLAIMANT') {
        response = await pickupService.getMyPickups(currentFilters);
      } else if (user.role === 'STAFF' || user.role === 'ADMIN') {
        response = await pickupService.getAll(currentFilters);
      } else {
        return;
      }
      setPickups(response.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [toast, user, debouncedFilters]); // Dependencies

  // Fetch when debounced filters change or user changes
  useEffect(() => {
    if (user?.role) {
      fetchPickups(debouncedFilters);
    }
  }, [fetchPickups, user?.role, debouncedFilters]);

  // Update filters wrapper to handle undefined (optional)
  const updateFilters = useCallback((newFilters: PickupFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  return useMemo(() => ({
    pickups,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: () => fetchPickups(filters),
  }), [pickups, isLoading, error, filters, updateFilters, fetchPickups]);
};

export const usePickupDetail = (id: string | undefined) => {
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchPickup = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await pickupService.getById(id);
      setPickup(response.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  const completePickup = useCallback(async (referenceCode: string, notes?: string) => {
    if (!id) return;
    setIsCompleting(true);
    try {
      await pickupService.complete(id, { referenceCode, notes });
      toast.success('Pickup marked as completed!');
      await fetchPickup();
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
      return false;
    } finally {
      setIsCompleting(false);
    }
  }, [id, toast, fetchPickup]);

  useEffect(() => {
    fetchPickup();
  }, [fetchPickup]);

  return useMemo(() => ({
    pickup,
    isLoading,
    isCompleting,
    error,
    refresh: fetchPickup,
    completePickup,
  }), [pickup, isLoading, isCompleting, error, fetchPickup, completePickup]);
};
