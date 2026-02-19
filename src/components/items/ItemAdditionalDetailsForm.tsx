import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, Select } from '@components/ui';
import { EditItemFormData } from '../../types/item.types';
import { StorageLocation } from '../../types/storage.types';

interface ItemAdditionalDetailsFormProps {
  register: UseFormRegister<EditItemFormData>;
  errors: FieldErrors<EditItemFormData>;
  locations: StorageLocation[];
}

const ItemAdditionalDetailsForm = ({ register, errors, locations }: ItemAdditionalDetailsFormProps) => (
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
);

export default ItemAdditionalDetailsForm;
