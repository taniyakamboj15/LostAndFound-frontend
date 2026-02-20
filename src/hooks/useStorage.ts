import { useState, useEffect, useCallback, useMemo } from 'react';
import { storageService } from '../services/storage.service';
import { useToast } from './useToast';
import { useAuth } from './useAuth';
import { getErrorMessage } from '@utils/errors';
import type { Storage } from '../types';

export const useStorage = () => {
  const { isAdmin, isStaff } = useAuth();
  const [locations, setLocations] = useState<Storage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // If Staff/Admin, get all storage locations
      // If Claimant, get only sanctioned pickup points
      const response = (isAdmin() || isStaff())
        ? await storageService.getAll()
        : await storageService.getPickupPoints();
        
      setLocations(response.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, isStaff, toast]);

  const removeLocation = useCallback(async (id: string) => {
    try {
      await storageService.delete(id);
      setLocations(prev => prev.filter(loc => loc._id !== id));
      toast.success('Storage location deleted successfully');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  }, [toast]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return useMemo(() => ({
    locations,
    isLoading,
    error,
    refresh: fetchLocations,
    removeLocation,
  }), [locations, isLoading, error, fetchLocations, removeLocation]);
};
