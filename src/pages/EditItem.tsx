import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Upload, X } from 'lucide-react';
import BackButton from '@components/ui/BackButton';
import { Button, Input, Select, Textarea, Card, Spinner } from '@components/ui';
import { editItemSchema } from '@validators';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { ItemStatus, ITEM_STATUS_LABELS } from '@constants/status';
import { useToast } from '@hooks/useToast';
import { useAuth } from '@hooks/useAuth';
import { useItemDetail, useUpdateItem } from '@hooks/useItems';
import { useStorage } from '@hooks/useStorage';
import { ComponentErrorBoundary } from '@components/feedback';
import { API_BASE_URL } from '../constants/api';
import type { UploadedFile } from '../types/item.types';
import { usePhotoUpload } from '@hooks/usePhotoUpload';

interface EditItemFormData {
  category: ItemCategory;
  description: string;
  locationFound: string;
  dateFound: string;
  finderName?: string;
  finderContact?: string;
  isHighValue: boolean;
  storageLocation?: string | null;
  status: ItemStatus;
}

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
        {/* Back Button */}
        {/* Back Button */}
        <BackButton label="Back to Item" />
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
          <p className="text-gray-600 mt-1">Update item information and status</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <Select
                label="Category"
                options={[
                  { value: '', label: 'Select a category' },
                  ...Object.entries(ITEM_CATEGORIES).map(([key, cat]) => ({
                    value: key,
                    label: cat.label,
                  })),
                ]}
                error={errors.category?.message}
                fullWidth
                required
                {...register('category')}
              />

              <Textarea
                label="Description"
                placeholder="Provide a detailed description of the item..."
                helperText="Include brand, color, model, distinguishing features, etc."
                error={errors.description?.message}
                fullWidth
                required
                rows={4}
                {...register('description')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Location Found"
                  placeholder="e.g., Main Library, 2nd Floor"
                  error={errors.locationFound?.message}
                  fullWidth
                  required
                  {...register('locationFound')}
                />

                <Input
                  label="Date Found"
                  type="date"
                  error={errors.dateFound?.message}
                  fullWidth
                  required
                  {...register('dateFound')}
                />
              </div>
            </div>
          </Card>

          {/* Photos */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Photos <span className="text-red-500">*</span>
            </h2>
            <div className="space-y-4">
              {/* Existing Photos */}
              {existingPhotos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Existing Photos</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src={photo.path.startsWith('http') ? photo.path : `${API_BASE_URL}/${photo.path}`} 
                            alt={photo.filename} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Photos */}
              {(existingPhotos.length + photos.length) < 5 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Add New Photos</p>
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-gray-300"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB ({existingPhotos.length + photos.length}/5 photos)
                      </p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              )}

              {/* New Photo Previews */}
              {photoPreviews.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">New Photos</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photoPreviews.map((preview: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewPhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                </div>
              )}
            </div>
          </Card>

          {/* Status Management (Staff/Admin only) */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Item Status
            </h2>
            <Select
              label="Status"
              options={Object.entries(ITEM_STATUS_LABELS).map(([key, label]) => ({
                value: key,
                label,
              }))}
              error={errors.status?.message}
              fullWidth
              required
              {...register('status')}
            />
            <p className="text-sm text-gray-500 mt-2">
              Update the item's current status in the system
            </p>
          </Card>

          {/* Finder Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Finder Information (Optional)
            </h2>
            <div className="space-y-4">
              <Input
                label="Finder Name"
                placeholder="Name of person who found the item"
                error={errors.finderName?.message}
                fullWidth
                {...register('finderName')}
              />

              <Input
                label="Finder Contact"
                placeholder="Email or phone number"
                error={errors.finderContact?.message}
                fullWidth
                {...register('finderContact')}
              />
            </div>
          </Card>

          {/* Additional Details */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Details
            </h2>
            <div className="space-y-4">
              <Select
                label="Storage Location"
                options={[
                  { value: '', label: 'Select a storage location' },
                  ...locations.map((loc) => ({
                    value: loc._id,
                    label: `${loc.name} (${loc.location})`,
                  })),
                ]}
                helperText="Where the item is currently stored"
                error={errors.storageLocation?.message}
                fullWidth
                {...register('storageLocation')}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isHighValue"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...register('isHighValue')}
                />
                <label htmlFor="isHighValue" className="text-sm text-gray-700">
                  Mark as high-value item (requires additional security)
                </label>
              </div>
            </div>
          </Card>

          {/* Actions */}
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
