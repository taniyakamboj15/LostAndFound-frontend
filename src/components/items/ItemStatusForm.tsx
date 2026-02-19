import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, Select } from '@components/ui';
import { ITEM_STATUS_LABELS } from '@constants/status';
import { EditItemFormData } from '../../types/item.types';

interface ItemStatusFormProps {
  register: UseFormRegister<EditItemFormData>;
  errors: FieldErrors<EditItemFormData>;
}

const ItemStatusForm = ({ register, errors }: ItemStatusFormProps) => (
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
);

export default ItemStatusForm;
