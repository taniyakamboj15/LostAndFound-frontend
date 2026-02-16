import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Select, Textarea, Card } from '@components/ui';
import { itemSchema } from '@validators';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { useCreateItem } from '@hooks/useItems';
import { useStorage } from '@hooks/useStorage';
import { useToast } from '@hooks/useToast';
import { ComponentErrorBoundary } from '@components/feedback';
import { cn } from '@utils/helpers';

interface CreateItemFormData {
  category: ItemCategory;
  description: string;
  locationFound: string;
  dateFound: string;
  finderName?: string;
  finderContact?: string;
  isHighValue: boolean;
  estimatedValue?: number;
  storageLocation?: string | null;
}

const CreateItem = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createItem, isSubmitting } = useCreateItem();
  const { locations } = useStorage();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateItemFormData>({
    resolver: yupResolver(itemSchema) as Resolver<CreateItemFormData>,
  });

  const isHighValue = watch('isHighValue');

  // Debug errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
    }
  }, [errors]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    // Limit to 5 photos total
    const remainingSlots = 5 - photos.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      toast.error(`You can only upload up to 5 photos`);
    }

    // Create previews
    const newPreviews: string[] = [];
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === filesToAdd.length) {
          setPhotoPreviews([...photoPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setPhotos([...photos, ...filesToAdd]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateItemFormData) => {
    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    await createItem(formData);
  };

  return (
    <ComponentErrorBoundary title="Register Item Error">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Register Found Item</h1>
          <p className="text-gray-600 mt-1">
            Add a new found item to the system
          </p>
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
              {/* Upload Button */}
              <div>
                <label
                  htmlFor="photo-upload"
                  className={cn(
                    'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer',
                    'hover:bg-gray-50 transition-colors',
                    photos.length >= 5
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                      : 'border-gray-300'
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB ({photos.length}/5 photos)
                    </p>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    disabled={photos.length >= 5}
                  />
                </label>
              </div>

              {/* Photo Previews */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photoPreviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No photos uploaded yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Finder Information (Optional) */}
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

              {isHighValue && (
                <Input
                  label="Estimated Value ($)"
                  type="number"
                  placeholder="e.g., 500"
                  error={errors.estimatedValue?.message}
                  fullWidth
                  required
                  {...register('estimatedValue')}
                />
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/items')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Register Item
            </Button>
          </div>
        </form>
      </div>
    </ComponentErrorBoundary>
  );
};

export default CreateItem;
