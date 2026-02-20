import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { StorageFormData } from '../types/storage.types';

export const useStorageOperations = () => {
  const { removeLocation } = useStorage();

  const getOccupancyColor = useCallback((count: number, capacity: number) => {
    if (capacity === 0) return 'text-gray-600 bg-gray-50';
    const percentage = (count / capacity) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  }, []);

  const getOccupancyBarColor = useCallback((count: number, capacity: number) => {
      if (capacity === 0) return 'bg-gray-600';
      const percentage = (count / capacity) * 100;
      if (percentage >= 90) return 'bg-red-600';
      if (percentage >= 70) return 'bg-yellow-600';
      return 'bg-green-600';
  }, []);

  const prepareStorageFormData = useCallback((data: StorageFormData, editingId?: string) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'capacity' && typeof value === 'object') {
        Object.entries(value).forEach(([size, amount]) => {
          formData.append(`capacity.${size}`, (amount as number | string).toString());
        });
      } else {
        formData.append(key, value.toString());
      }
    });
    formData.append('intent', editingId ? 'update-storage' : 'create-storage');
    if (editingId) {
      formData.append('id', editingId);
    }
    return formData;
  }, []);

  return {
    getOccupancyColor,
    getOccupancyBarColor,
    prepareStorageFormData,
    removeLocation
  };
};
