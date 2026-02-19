import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, Input } from '@components/ui';
import { EditItemFormData } from '../../types/item.types';

interface FinderInfoFormProps {
  register: UseFormRegister<EditItemFormData>;
  errors: FieldErrors<EditItemFormData>;
}

const FinderInfoForm = ({ register, errors }: FinderInfoFormProps) => (
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
);

export default FinderInfoForm;
