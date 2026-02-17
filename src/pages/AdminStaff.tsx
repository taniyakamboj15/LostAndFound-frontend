import { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { useLoaderData, useActionData, useSubmit, useNavigation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Button, Input, Select, Modal, Badge } from '@components/ui';
import { Plus, Shield, User as UserIcon, Mail, } from 'lucide-react';
import { ComponentErrorBoundary } from '@components/feedback';
import { userSchema } from '@validators';
import { UserRole } from '@constants/roles';
import { User, AddStaffData } from '../types';

import { ROLE_BADGE_CONFIG, STATUS_BADGE_CONFIG } from '@constants/ui';

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary-600" />
              Staff Management
            </h1>
            <p className="text-gray-600">Manage system administrators and staff members.</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Staff Member
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        No staff members found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const roleConfig = ROLE_BADGE_CONFIG[u.role as keyof typeof ROLE_BADGE_CONFIG] || ROLE_BADGE_CONFIG.STAFF;
                      const statusConfig = STATUS_BADGE_CONFIG[String(u.isEmailVerified) as keyof typeof STATUS_BADGE_CONFIG];
                      const RoleIcon = roleConfig.icon;

                      return (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{u.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2 opacity-50" />
                            {u.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={roleConfig.variant} className="flex items-center w-fit gap-1">
                            <RoleIcon className="w-3 h-3" />
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )}) 
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Add Staff Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            reset();
          }}
          title="Add New Staff Member"
          size="md"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter staff full name"
              {...register('name')}
              error={errors.name?.message}
              fullWidth
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="staff@example.com"
              {...register('email')}
              error={errors.email?.message}
              fullWidth
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              fullWidth
            />
            <Select
              label="System Role"
              {...register('role')}
              error={errors.role?.message}
              options={[
                { value: 'STAFF', label: 'Staff' },
                { value: 'ADMIN', label: 'Administrator' },
              ]}
              fullWidth
            />
            
            <div className="flex justify-end gap-3 mt-8">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  reset();
                }} 
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Create Account
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ComponentErrorBoundary>
  );
};

export default AdminStaff;
