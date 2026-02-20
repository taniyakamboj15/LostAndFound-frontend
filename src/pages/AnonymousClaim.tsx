
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useMemo } from 'react';
import * as yup from 'yup';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button, Card, Input, Spinner, Select } from '@components/ui';
import { useItemDetail } from '@hooks/useItems';
import { useFileClaim } from '@hooks/useClaims';
import { useStorage } from '@hooks/useStorage';
import { ComponentErrorBoundary } from '@components/feedback';
import ClaimItemSummary from '@components/claims/ClaimItemSummary';
import ClaimDescriptionForm from '@components/claims/ClaimDescriptionForm';

import ClaimProofUpload from '@components/claims/ClaimProofUpload';

const anonymousClaimSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  description: yup.string().required('Description is required').min(10, 'Description too short'),
  itemId: yup.string().required(),
  preferredPickupLocation: yup.string().required('Please select a pickup branch'),
}).required();

type AnonymousClaimFormData = yup.InferType<typeof anonymousClaimSchema>;

const AnonymousClaim = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId');
  
  const { item, isLoading: isItemLoading, error: itemError } = useItemDetail(itemId);
  const { 
    fileAnonymousClaim, 
    isSubmitting, 
    proofFiles, 
    handleFileChange, 
    removeFile
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

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnonymousClaimFormData>({
    resolver: yupResolver(anonymousClaimSchema),
    defaultValues: {
      itemId: itemId || '',
      preferredPickupLocation: '',
    },
  });

  const onSubmit = useCallback(async (data: AnonymousClaimFormData) => {
      await fileAnonymousClaim(data);
  }, [fileAnonymousClaim]);

  if (!itemId) return <div className="text-center p-8">Invalid Item ID</div>;

  if (isItemLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="text-center p-8 text-red-500">
        Item not found or unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">File Anonymous Claim</h1>
        <p className="text-gray-600 mt-1">
          We need your email to communicate the status of your claim.
        </p>
      </div>

      <ComponentErrorBoundary title="Claim Form Error">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <ClaimItemSummary item={item} />

          <Card>
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <Input
                label="Email Address"
                placeholder="you@example.com"
                error={errors.email?.message}
                fullWidth
                required
                {...register('email')}
              />
          </Card>
          
          <ClaimDescriptionForm register={register} errors={errors} />

          {/* Pickup Location Selection (Copied exactly from FileClaim.tsx logic) */}
          <Card className="border-l-4 border-l-indigo-500">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-500" />
              Pickup Destination
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Select where you'd like to collect your item. We recommend picking a city closest to you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Step 1: Choose City"
                options={cityOptions}
                fullWidth
                required
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
              />

              <Select
                label="Step 2: Choose Branch"
                options={[
                  { value: '', label: selectedCity ? 'Select a branch' : 'Choose city first' },
                  ...filteredLocations.map((loc) => ({
                    value: loc._id,
                    label: loc.name
                  }))
                ]}
                disabled={!selectedCity}
                error={errors.preferredPickupLocation?.message}
                fullWidth
                required
                {...register('preferredPickupLocation')}
              />
            </div>

            {item.storageLocation && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs text-gray-500">
                <span>Current Location:</span>
                <span className="font-bold text-gray-700">
                  {typeof item.storageLocation === 'object' && item.storageLocation ? item.storageLocation.name : 'Central Branch'} ({typeof item.storageLocation === 'object' && item.storageLocation ? item.storageLocation.city : 'Main Office'})
                </span>
              </div>
            )}
          </Card>

          <ClaimProofUpload  
            proofFiles={proofFiles} 
            onFileChange={(e) => handleFileChange(Array.from(e.target.files || []))} 
            onRemoveFile={removeFile} 
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Submit Claim
            </Button>
          </div>
        </form>
      </ComponentErrorBoundary>
    </div>
  );
};

export default AnonymousClaim;
