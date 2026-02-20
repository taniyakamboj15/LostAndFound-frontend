import { Modal, Input, Select, Button } from '@components/ui';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { AddStaffData } from '@/types';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  register: UseFormRegister<AddStaffData>;
  errors: FieldErrors<AddStaffData>;
  handleSubmit: UseFormHandleSubmit<AddStaffData>;
  onSubmit: (data: AddStaffData) => void;
  isSubmitting: boolean;
}

const AddStaffModal = ({
  isOpen,
  onClose,
  register,
  errors,
  handleSubmit,
  onSubmit,
  isSubmitting
}: AddStaffModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Add New Staff Member"
    size="md"
  >
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
      <div className="grid gap-5">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          {...register('name')}
          error={errors.name?.message}
          fullWidth
          className="rounded-xl"
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="staff@example.com"
          {...register('email')}
          error={errors.email?.message}
          fullWidth
          className="rounded-xl"
        />
        <Input
          label="Initial Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
          fullWidth
          className="rounded-xl"
        />
        <Select
          label="Account Role"
          {...register('role')}
          error={errors.role?.message}
          options={[
            { value: 'STAFF', label: 'Staff Member' },
            { value: 'ADMIN', label: 'Systems Administrator' },
          ]}
          fullWidth
          className="rounded-xl"
        />
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
        <Button 
          variant="outline" 
          onClick={onClose} 
          type="button"
          disabled={isSubmitting}
          className="rounded-xl px-8"
        >
          Discard
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="rounded-xl px-8 shadow-md">
          Create Account
        </Button>
      </div>
    </form>
  </Modal>
);

export default AddStaffModal;
