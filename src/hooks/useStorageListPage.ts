import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLoaderData, useRevalidator, useSubmit, useActionData } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from './useAuth';
import { useStorageOperations } from './useStorageOperations';
import { useToast } from './useToast';
import { storageService } from '../services/storage.service';
import api from '../services/api';
import { Storage, StorageFormData } from '../types';
import { storageSchema } from '../validators';

export const useStorageListPage = () => {
  const { locations, error: loaderError } = useLoaderData() as {
    locations: Storage[];
    error: string | null;
  };
  const actionData = useActionData() as { success?: boolean; error?: string; message?: string } | undefined;
  const { isAdmin, isStaff } = useAuth();
  const { removeLocation, getOccupancyColor, getOccupancyBarColor, prepareStorageFormData } = useStorageOperations();
  const { revalidate } = useRevalidator();
  const submit = useSubmit();
  const toast = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Storage | null>(null);
  const [overflowItems, setOverflowItems] = useState<string[]>([]);
  const [isOverflowModalOpen, setIsOverflowModalOpen] = useState(false);
  const [isLoadingOverflow, setIsLoadingOverflow] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const groupedLocations = useMemo(() => {
    return locations.reduce((acc, loc) => {
      const city = loc.city || 'Other';
      if (!acc[city]) acc[city] = [];
      acc[city].push(loc);
      return acc;
    }, {} as Record<string, Storage[]>);
  }, [locations]);

  useEffect(() => {
    if (isModalOpen) {
      storageService.getCities().then(response => {
        if (response.success && response.data) {
          setAvailableCities(response.data);
        }
      });
    }
  }, [isModalOpen]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StorageFormData>({
    resolver: yupResolver(storageSchema) as Resolver<StorageFormData>,
    defaultValues: {
      isActive: true,
      capacity: {
        small: 10,
        medium: 5,
        large: 2,
      },
    },
  });

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message || 'Operation successful');
      setIsModalOpen(false);
      setEditingLocation(null);
      reset();
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData, toast, reset]);

  const onSubmitHandler = useCallback((data: StorageFormData) => {
    const formData = prepareStorageFormData(data, editingLocation?._id);
    submit(formData, { method: 'post' });
  }, [editingLocation?._id, prepareStorageFormData, submit]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this storage location?')) {
      await removeLocation(id);
      revalidate();
    }
  }, [removeLocation, revalidate]);

  const handleSuggestOverflow = useCallback(async () => {
    setIsLoadingOverflow(true);
    try {
      const res = await api.get('/api/storage/overflow-suggestions');
      setOverflowItems(res.data?.data?.suggestedItemIds || []);
      setIsOverflowModalOpen(true);
    } catch {
      toast.error('Could not fetch overflow suggestions. Please try again.');
    } finally {
      setIsLoadingOverflow(false);
    }
  }, [toast]);

  useEffect(() => {
    if (editingLocation) {
      reset({
        name: editingLocation.name,
        location: editingLocation.location,
        shelfNumber: editingLocation.shelfNumber || '',
        binNumber: editingLocation.binNumber || '',
        capacity: {
          small: editingLocation.capacity.small,
          medium: editingLocation.capacity.medium,
          large: editingLocation.capacity.large,
        },
        isActive: editingLocation.isActive,
        isPickupPoint: editingLocation.isPickupPoint,
        city: editingLocation.city || '',
        address: editingLocation.address || '',
      });
    } else {
      reset({
        isActive: true,
        isPickupPoint: true,
        city: '',
        address: '',
        capacity: {
          small: 10,
          medium: 5,
          large: 2,
        },
      });
    }
  }, [editingLocation, reset]);

  const openAddModal = useCallback(() => {
    setEditingLocation(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((location: Storage) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingLocation(null);
  }, []);

  return {
    locations,
    loaderError,
    isAdmin,
    isStaff,
    groupedLocations,
    isModalOpen,
    editingLocation,
    overflowItems,
    isOverflowModalOpen,
    setIsOverflowModalOpen,
    isLoadingOverflow,
    availableCities,
    register,
    handleSubmit,
    setValue,
    errors,
    onSubmitHandler,
    handleDelete,
    handleSuggestOverflow,
    openAddModal,
    openEditModal,
    closeModal,
    getOccupancyColor,
    getOccupancyBarColor
  };
};
