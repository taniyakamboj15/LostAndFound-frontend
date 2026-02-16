import { useState, useEffect, useCallback, useMemo } from 'react';
import { getErrorMessage } from '@utils/errors';
import { pickupService } from '@services/pickup.service';
import { useToast } from './useToast';
import type { Pickup } from '../types/pickup.types';
import { useAuth } from './useAuth';

export const usePickups = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchPickups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = user?.role === 'CLAIMANT'
        ? await pickupService.getMyPickups()
        : await pickupService.getAll();
      setPickups(response.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  return useMemo(() => ({
    pickups,
    isLoading,
    error,
    refresh: fetchPickups,
  }), [pickups, isLoading, error, fetchPickups]);
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
