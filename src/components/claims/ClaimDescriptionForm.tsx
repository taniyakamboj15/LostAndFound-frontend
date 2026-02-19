import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, Textarea } from '@components/ui';

interface FileClaimFormData {
  description: string;
  itemId: string;
  lostReportId?: string;
}

interface ClaimDescriptionFormProps {
  register: UseFormRegister<FileClaimFormData>;
  errors: FieldErrors<FileClaimFormData>;
}

const ClaimDescriptionForm = ({ register, errors }: ClaimDescriptionFormProps) => (
  <Card>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Why is this your item? <span className="text-red-500">*</span>
    </h2>
    <Textarea
      placeholder="Describe how you can identify this item as yours. Include specific details like brand, model, unique features, when and where you lost it, etc."
      error={errors.description?.message}
      fullWidth
      required
      rows={6}
      {...register('description')}
    />
    <p className="text-sm text-gray-500 mt-2">
      Be as specific as possible. This helps us verify your ownership.
    </p>
  </Card>
);

export default ClaimDescriptionForm;
