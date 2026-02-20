
import { useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {X, Plus, Copy } from 'lucide-react';
import { Button, Input, Select, Textarea, Card } from '@components/ui';
import { itemSchema } from '@validators';
import { ITEM_CATEGORIES } from '@constants/categories';
import { useStorage } from '@hooks/useStorage';
import { usePhotoUpload } from '@hooks/usePhotoUpload';
import { useToast } from '@hooks/useToast';
import { CreateItemFormData } from '@/types/createItem.types';

const ITEM_COLORS = ['Black', 'White', 'Silver', 'Gold', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Grey', 'Beige', 'Multi'];
const ITEM_SIZES = [
  { value: 'SMALL', label: 'Small' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LARGE', label: 'Large' },
];

interface BulkItemFormProps {
  onAddItem: (item: CreateItemFormData & { photos: File[] }) => void;
  lastItem?: CreateItemFormData;
  defaultLocation?: string;
  defaultDate?: Date;
}

export const BulkItemForm = ({ 
  onAddItem, 
  lastItem,
  defaultLocation, 
  defaultDate 
}: BulkItemFormProps) => {
  const { locations } = useStorage();
  const toast = useToast();
  const { photos, photoPreviews, handlePhotoChange, removePhoto, clearPhotos } = usePhotoUpload();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<CreateItemFormData>({
    resolver: yupResolver(itemSchema) as Resolver<CreateItemFormData>,
    defaultValues: {
      locationFound: defaultLocation,
      dateFound: defaultDate ? defaultDate.toISOString().split('T')[0] : '',
      isHighValue: false
    }
  });

  const isHighValue = watch('isHighValue');
  const selectedSize = watch('itemSize') || 'MEDIUM';

  // Effect to set defaults when they change (if passed from parent)
  useEffect(() => {
    if (defaultLocation) setValue('locationFound', defaultLocation);
    if (defaultDate) setValue('dateFound', defaultDate.toISOString().split('T')[0]);
  }, [defaultLocation, defaultDate, setValue]);

  const handleDuplicate = () => {
      if (!lastItem) return;
      // Copy fields from last item
      setValue('category', lastItem.category);
      setValue('description', lastItem.description);
      setValue('locationFound', lastItem.locationFound);
      setValue('dateFound', lastItem.dateFound);
      setValue('storageLocation', lastItem.storageLocation);
      setValue('isHighValue', lastItem.isHighValue);
      setValue('estimatedValue', lastItem.estimatedValue);
      setValue('identifyingFeatures', lastItem.identifyingFeatures);
      toast.success('Duplicated details from previous item');
  };

  const onSubmit = (data: CreateItemFormData) => {
      if (photos.length === 0) {
          toast.error('Please upload at least one photo');
          return;
      }
      onAddItem({ ...data, photos });

      reset({
          locationFound: data.locationFound, // Keep location
          dateFound: data.dateFound,         // Keep date
          storageLocation: data.storageLocation // Keep storage
      });
      clearPhotos();
  };

  return (
    <Card className="p-6 border-2 border-dashed border-gray-200 bg-gray-50/50">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">New Item Entry</h3>
          {lastItem && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleDuplicate}
                className="flex items-center gap-2"
              >
                  <Copy className="h-4 w-4" />
                  Duplicate Previous
              </Button>
          )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
                label="Category"
                options={[
                    { value: '', label: 'Select Category' },
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
        </div>

        <Textarea
            label="Description"
            placeholder="Detailed description..."
            error={errors.description?.message}
            fullWidth
            required
            rows={2}
            {...register('description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Location Found"
                placeholder="e.g. Terminal 1"
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

        <Input
            label="Identifying Features"
            placeholder="e.g. Scratches on back, Sticker on case (Comma separated)"
            error={errors.identifyingFeatures?.message}
            fullWidth
            {...register('identifyingFeatures')}
        />

        {/* Structured Markers — quick capture for bulk intake */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
                label="Brand"
                placeholder="e.g. Apple, Nike"
                fullWidth
                {...register('brand')}
            />
            <Select
                label="Color"
                options={[
                    { value: '', label: 'Color' },
                    ...ITEM_COLORS.map(c => ({ value: c.toUpperCase(), label: c }))
                ]}
                fullWidth
                {...register('color')}
            />
            <Select
                label="Size"
                options={[{ value: '', label: 'Size' }, ...ITEM_SIZES]}
                fullWidth
                {...register('itemSize')}
            />
        </div>

        {watch('category') === 'BAGS' && (
            <Textarea
                label="Bag Contents"
                placeholder="e.g., Laptop, charger, wallet (comma-separated)"
                helperText="What was inside the bag when found? This helps claimants prove ownership."
                fullWidth
                rows={2}
                {...register('bagContents')}
            />
        )}

        <Textarea
            label="Secret Identifiers (Staff/Admin only)"
            placeholder="One per line — e.g. serial number, engraving text, hidden marking"
            helperText="PRIVATE: Not shown to public. Used for challenge-response verification."
            fullWidth
            rows={3}
            className="border-amber-200 bg-amber-50/30"
            {...register('secretIdentifiers')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Finder Name (Optional)"
                placeholder="Name of person who found the item"
                error={errors.finderName?.message}
                fullWidth
                {...register('finderName')}
            />
            <Input
                label="Finder Contact (Optional)"
                placeholder="Email or phone number"
                error={errors.finderContact?.message}
                fullWidth
                {...register('finderContact')}
            />
        </div>

        <div className="space-y-4 bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isHighValue"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    {...register('isHighValue')}
                />
                <label htmlFor="isHighValue" className="text-sm font-medium text-gray-700">
                    Mark as high-value item
                </label>
            </div>

            {isHighValue && (
                <Input
                    label="Estimated Value ($)"
                    type="number"
                    placeholder="e.g. 500"
                    error={errors.estimatedValue?.message}
                    fullWidth
                    required
                    {...register('estimatedValue')}
                />
            )}
        </div>

        {/* Photos Helper - Simplified for Bulk */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Min 1)</label>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {/* Upload Button */}
                <label className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                    <Plus className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Add</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handlePhotoChange} />
                </label>

                {/* Previews */}
                {photoPreviews.map((src, idx) => (
                    <div key={idx} className="relative flex-shrink-0 w-24 h-24 group">
                        <img src={src} alt="preview" className="w-full h-full object-cover rounded-lg" />
                        <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex justify-end pt-4">
             <Button type="submit" variant="primary" className="w-full md:w-auto">
                 <Plus className="h-4 w-4 mr-2" />
                 Add to Batch
             </Button>
        </div>
      </form>
    </Card>
  );
};
