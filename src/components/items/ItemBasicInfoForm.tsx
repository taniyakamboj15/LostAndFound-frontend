import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, Select, Textarea, Input } from '@components/ui';
import { ITEM_CATEGORIES } from '@constants/categories';
import { EditItemFormData } from '../../types/item.types';

interface ItemBasicInfoFormProps {
  register: UseFormRegister<EditItemFormData>;
  errors: FieldErrors<EditItemFormData>;
}

const ItemBasicInfoForm = ({ register, errors }: ItemBasicInfoFormProps) => (
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
);

export default ItemBasicInfoForm;
