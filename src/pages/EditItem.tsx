import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BackButton from '@components/ui/BackButton';
import { Button, Card, Spinner } from '@components/ui';
import { editItemSchema } from '@validators';
import { useToast } from '@hooks/useToast';
import { useAuth } from '@hooks/useAuth';
import { useItemDetail, useUpdateItem } from '@hooks/useItems';
import { useStorage } from '@hooks/useStorage';
import { ComponentErrorBoundary } from '@components/feedback';
import type { UploadedFile, EditItemFormData } from '../types/item.types';
import { usePhotoUpload } from '@hooks/usePhotoUpload';

// Components
import ItemBasicInfoForm from '@components/items/ItemBasicInfoForm';
import ItemPhotosForm from '@components/items/ItemPhotosForm';
import ItemStatusForm from '@components/items/ItemStatusForm';
import FinderInfoForm from '@components/items/FinderInfoForm';
import ItemAdditionalDetailsForm from '@components/items/ItemAdditionalDetailsForm';

const EditItem = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAdmin, isStaff } = useAuth();
  
  const { item: existingItem, isLoading: isLoadingItem } = useItemDetail(id || null);
  const { updateItem, isSubmitting } = useUpdateItem(id || null);
  const { locations } = useStorage();

  const [existingPhotos, setExistingPhotos] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (existingItem) {
      setExistingPhotos(existingItem.photos || []);
    }
  }, [existingItem]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditItemFormData>({
    resolver: yupResolver(editItemSchema) as Resolver<EditItemFormData>,
  });

  useEffect(() => {
    if (existingItem) {
      reset({
        category: existingItem.category,
        description: existingItem.description,
        locationFound: existingItem.locationFound,
        dateFound: existingItem.dateFound,
        finderName: existingItem.finderName,
        finderContact: existingItem.finderContact,
        isHighValue: existingItem.isHighValue,
        storageLocation: typeof existingItem.storageLocation === 'object' ? existingItem.storageLocation._id : existingItem.storageLocation,
        status: existingItem.status,
        identifyingFeatures: existingItem.identifyingFeatures?.join(', '),
      });
    }
  }, [existingItem, reset]);

  const { 
    photos, 
    photoPreviews, 
    handlePhotoChange, 
    removePhoto: removeNewPhoto 
  } = usePhotoUpload({
    maxPhotos: 5 - existingPhotos.length,
    maxSizeMB: 5,
    acceptedTypes: ['image/']
  });

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EditItemFormData) => {
    const totalPhotos = existingPhotos.length + photos.length;
    if (totalPhotos === 0) {
      toast.error('Please keep at least one photo');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value.toString());
    });
    
    // Add existing photo paths to keep
    formData.append('existingPhotos', JSON.stringify(existingPhotos.map((p) => p.path)));
    
    // Add new photos
    photos.forEach((photo: File) => {
      formData.append('photos', photo);
    });

    await updateItem(formData);
  };

  if (isLoadingItem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin() && !isStaff()) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600">You don't have permission to edit items.</p>
        <Button variant="primary" onClick={() => navigate('/items')} className="mt-4">
          Back to Items
        </Button>
      </Card>
    );
  }

  return (
    <ComponentErrorBoundary title="Edit Item Error">
      <div className="max-w-3xl mx-auto space-y-6">
        <BackButton label="Back to Item" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
          <p className="text-gray-600 mt-1">Update item information and status</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ItemBasicInfoForm register={register} errors={errors} />
          
          <ItemPhotosForm 
            existingPhotos={existingPhotos}
            photos={photos}
            photoPreviews={photoPreviews}
            onRemoveExisting={removeExistingPhoto}
            onRemoveNew={removeNewPhoto}
            onPhotoChange={handlePhotoChange}
          />

          <ItemStatusForm register={register} errors={errors} />
          
          <FinderInfoForm register={register} errors={errors} />
          
          <ItemAdditionalDetailsForm register={register} errors={errors} locations={locations} />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/items/${id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </ComponentErrorBoundary>
  );
};

export default EditItem;
