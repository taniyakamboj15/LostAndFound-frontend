import { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { useLoaderData, useActionData, useSubmit, useNavigation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { ComponentErrorBoundary } from '@components/feedback';
import { userSchema } from '@validators';
import { UserRole } from '@constants/roles';
import { User, AddStaffData } from '../types';

// Sub-components
import StaffHeader from '@components/admin/staff/StaffHeader';
import StaffTable from '@components/admin/staff/StaffTable';
import AddStaffModal from '@components/admin/staff/AddStaffModal';

const AdminStaff = () => {
  const { users, error } = useLoaderData() as { users: User[]; error: string | null };
  const actionData = useActionData() as { success?: boolean; error?: string } | undefined;
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddStaffData>({
    resolver: yupResolver(userSchema) as Resolver<AddStaffData>,
    defaultValues: {
      role: UserRole.STAFF,
    },
  });

  useEffect(() => {
    if (actionData?.success) {
      setIsAddModalOpen(false);
      reset();
    }
  }, [actionData, reset]);

  const onSubmit = (data: AddStaffData) => {
    submit({ ...data, intent: 'add-staff' }, { method: 'post' });
  };

  return (
    <ComponentErrorBoundary title="Staff Management Error">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <StaffHeader onAddStaff={() => setIsAddModalOpen(true)} />

        {error && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-2xl text-red-700 text-sm font-semibold shadow-sm flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <StaffTable users={users} />

        <AddStaffModal 
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            reset();
          }}
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </ComponentErrorBoundary>
  );
};

export default AdminStaff;
