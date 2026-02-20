import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { claimSchema } from '@validators';
import { useItemDetail } from './useItems';
import { useFileClaim } from './useClaims';
import { useStorage } from './useStorage';


export interface FileClaimFormData {
  description: string;
  itemId: string;
  lostReportId?: string;
  preferredPickupLocation: string;
}

export const useFileClaimPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId');

  const { item, isLoading: isItemLoading, error: itemError } = useItemDetail(itemId);
  const { 
    proofFiles, 
    isSubmitting, 
    handleFileChange, 
    removeFile, 
    submitClaim 
  } = useFileClaim(itemId);

  const { locations } = useStorage();
  const pickupLocations = useMemo(() => 
    locations.filter(loc => loc.isActive && loc.isPickupPoint), 
    [locations]
  );

  const [selectedCity, setSelectedCity] = useState<string>('');

  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(pickupLocations.map(loc => loc.city).filter(Boolean))).sort();
    return [{ value: '', label: 'Select City' }, ...cities.map(c => ({ value: c as string, label: c as string }))];
  }, [pickupLocations]);

  const filteredLocations = useMemo(() => {
    if (!selectedCity) return [];
    return pickupLocations.filter(loc => loc.city === selectedCity);
  }, [pickupLocations, selectedCity]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FileClaimFormData>({
    resolver: yupResolver(claimSchema) as Resolver<FileClaimFormData>,
    defaultValues: {
      itemId: itemId || '',
      preferredPickupLocation: '',
      description: ''
    },
  });

  // Auto-select if only one branch exists in the city
  useEffect(() => {
    if (filteredLocations.length === 1) {
      setValue('preferredPickupLocation', filteredLocations[0]._id);
    }
  }, [filteredLocations, setValue]);

  const onFileSelectorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileChange(files);
  }, [handleFileChange]);

  const onSubmitHandler = useCallback(async (data: FileClaimFormData) => {
    await submitClaim(data.description, data.preferredPickupLocation);
  }, [submitClaim]);

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setValue('preferredPickupLocation', ''); // Reset location when city changes
  }, [setValue]);

  return {
    itemId,
    item,
    isItemLoading,
    itemError,
    proofFiles,
    isSubmitting,
    removeFile,
    selectedCity,
    cityOptions,
    filteredLocations,
    register,
    handleSubmit,
    errors,
    onFileSelectorChange,
    onSubmitHandler,
    handleCityChange,
    navigate
  };
};
