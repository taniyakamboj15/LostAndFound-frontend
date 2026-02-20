import { useNavigate } from 'react-router-dom';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Select, Textarea, Card } from '@components/ui';
import { itemSchema } from '@validators';
import { ITEM_CATEGORIES } from '@constants/categories';
import { useCreateItem } from '@hooks/useItems';
import { useStorage } from '@hooks/useStorage';
import { useToast } from '@hooks/useToast';
import { ComponentErrorBoundary } from '@components/feedback';
import { cn } from '@utils/helpers';
import { usePhotoUpload } from '@hooks/usePhotoUpload';
import { CreateItemFormData } from '@/types/createItem.types';
import { useAuth } from '@hooks/useAuth';

const ITEM_COLORS = ['Black', 'White', 'Silver', 'Gold', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Multicolor'];
const ITEM_SIZES = [
  { value: 'SMALL', label: 'Small (fits in a hand)' },
  { value: 'MEDIUM', label: 'Medium (briefcase-sized)' },
  { value: 'LARGE', label: 'Large (suitcase-sized)' },
];

const CreateItem = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createItem, isSubmitting } = useCreateItem();
  const { locations } = useStorage();
  const { isAdmin, isStaff } = useAuth();
  const isPrivileged = isAdmin() || isStaff();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateItemFormData>({
    resolver: yupResolver(itemSchema) as Resolver<CreateItemFormData>,
  });

  const isHighValue = watch('isHighValue');
  const selectedCategory = watch('category');
  const selectedSize = watch('itemSize') || 'MEDIUM';
  const { photos, photoPreviews, handlePhotoChange, removePhoto } = usePhotoUpload();

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

              <Textarea
                label="Identifying Features"
                placeholder="e.g., Scratches on back, Sticker on case (Comma separated)"
                helperText="List unique features separated by commas"
                error={errors.identifyingFeatures?.message}
                fullWidth
                rows={2}
                {...register('identifyingFeatures')}
              />
            </div>
          </Card>

          {/* Structured Markers */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Structured Markers</h2>
            <p className="text-sm text-gray-500 mb-4">These fields feed the matching engine with precise, weighted data.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Brand"
                  placeholder="e.g., Apple, Samsung, Nike"
                  fullWidth
                  {...register('brand')}
                />
                <Select
                  label="Color"
                  options={[
                    { value: '', label: 'Select color' },
                    ...ITEM_COLORS.map(c => ({ value: c.toUpperCase(), label: c }))
                  ]}
                  fullWidth
                  {...register('color')}
                />
                <Select
                  label="Size"
                  options={[{ value: '', label: 'Select size' }, ...ITEM_SIZES]}
                  fullWidth
                  {...register('itemSize')}
                />
              </div>
              {selectedCategory === 'BAGS' && (
                <Textarea
                  label="Bag Contents"
                  placeholder="e.g., Laptop, charger, wallet (comma-separated)"
                  helperText="What was inside the bag when found? This helps claimants prove ownership."
                  fullWidth
                  rows={2}
                  {...register('bagContents')}
                />
              )}
              {isPrivileged && (
                <Textarea
                  label="Secret Identifiers (Staff/Admin only)"
                  placeholder="One per line — e.g. serial number, engraving text, hidden marking"
                  helperText="PRIVATE: Not shown to public. Used for challenge-response verification."
                  fullWidth
                  rows={3}
                  className="border-amber-200 bg-amber-50/30"
                  {...register('secretIdentifiers')}
                />
              )}
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
                  ...locations
                    .filter(loc => (loc.capacity[selectedSize.toLowerCase() as 'small' | 'medium' | 'large'] || 0) > 0)
                    .map((loc) => {
                      const sizeKey = selectedSize.toLowerCase() as 'small' | 'medium' | 'large';
                      const currentCount = loc.currentCount[sizeKey] || 0;
                      const capacity = loc.capacity[sizeKey] || 0;
                      const isFull = currentCount >= capacity;
                      
                      return {
                        value: loc._id,
                        label: `${loc.name} (${loc.city || 'Unknown City'}) - [${loc.location}] | ${selectedSize}: ${currentCount}/${capacity}`,
                        disabled: isFull,
                      };
                    }),
                ]}
                helperText={locations.length === 0 ? "No storage locations found" : "Only showing branches with available capacity for " + selectedSize}
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
