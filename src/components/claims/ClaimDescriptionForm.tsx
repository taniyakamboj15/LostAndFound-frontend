import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import { Card, Textarea } from '@components/ui';

interface ClaimDescriptionFormProps<T extends { description: string }> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const ClaimDescriptionForm = <T extends { description: string }>({ register, errors }: ClaimDescriptionFormProps<T>) => (
  <Card>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Why is this your item? <span className="text-red-500">*</span>
    </h2>
    <Textarea
      label="Description"
      placeholder="Describe how you can identify this item as yours. Include specific details like brand, model, unique features, when and where you lost it, etc."
      error={errors.description?.message as string | undefined}
      fullWidth
      required
      rows={6}
      {...register('description' as Path<T>)}
    />
    <p className="text-sm text-gray-500 mt-2">
      Be as specific as possible. This helps us verify your ownership.
    </p>
  </Card>
);

export default ClaimDescriptionForm;
