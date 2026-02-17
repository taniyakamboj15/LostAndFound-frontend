import { useState, useEffect } from 'react';
import { useLoaderData, useRevalidator, useSubmit, useActionData } from 'react-router-dom';
import { MapPin, Plus, Package, Edit, Trash2 } from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { useStorageOperations } from '@hooks/useStorageOperations';
import { Storage, StorageFormData } from '../types';
import { ComponentErrorBoundary } from '@components/feedback';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { storageSchema } from '../validators';
import { useToast } from '@hooks/useToast';
import { STATUS_BADGE_CONFIG } from '@constants/ui';


const StorageList = () => {
  const { locations, error: loaderError } = useLoaderData() as {
    locations: Storage[];
    error: string | null;
  };
  const actionData = useActionData() as { success?: boolean; error?: string; message?: string } | undefined;
  const { isAdmin, isStaff } = useAuth();
  const { removeLocation, getOccupancyColor, getOccupancyBarColor, prepareStorageFormData } = useStorageOperations();
  const { revalidate } = useRevalidator();
  const submit = useSubmit();
  const toast = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Storage | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StorageFormData>({
    resolver: yupResolver(storageSchema),
    defaultValues: {
      isActive: true,
      capacity: 10,
    },
  });

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message || 'Operation successful');
      setIsModalOpen(false);
      setEditingLocation(null);
      reset();
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData, toast, reset]);

  const onSubmit = (data: StorageFormData) => {
    const formData = prepareStorageFormData(data, editingLocation?._id);
    submit(formData, { method: 'post' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this storage location?')) {
      await removeLocation(id);
      revalidate();
    }
  };

  useEffect(() => {
    if (editingLocation) {
      reset({
        name: editingLocation.name,
        location: editingLocation.location,
        shelfNumber: editingLocation.shelfNumber || '',
        binNumber: editingLocation.binNumber || '',
        capacity: editingLocation.capacity,
        isActive: editingLocation.isActive,
      });
    } else {
      reset({
        isActive: true,
        capacity: 10,
      });
    }
  }, [editingLocation, reset]);

  if (!isAdmin() && !isStaff()) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600">You don't have permission to view storage locations.</p>
      </Card>
    );
  }

  return (
    <ComponentErrorBoundary title="Storage Management Error">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Storage Locations</h1>
            <p className="text-gray-600 mt-1">Manage storage locations for found items</p>
          </div>
          {isAdmin() && (
            <Button variant="primary" onClick={() => {
              setEditingLocation(null);
              setIsModalOpen(true);
            }}>
              <Plus className="h-5 w-5 mr-2" />
              Add Location
            </Button>
          )}
        </div>

        {/* Error State */}
        {loaderError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {loaderError}
          </div>
        )}

        {/* Storage Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => {
             const statusConfig = STATUS_BADGE_CONFIG[String(location.isActive) as keyof typeof STATUS_BADGE_CONFIG];
             
             return (
            <Card key={location._id}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {location.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{location.location}</span>
                    </div>
                  </div>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </div>

                {/* Location Details */}
                <div className="space-y-2 text-sm">
                  {location.shelfNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shelf:</span>
                      <span className="font-medium text-gray-900">{location.shelfNumber}</span>
                    </div>
                  )}
                  {location.binNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bin:</span>
                      <span className="font-medium text-gray-900">{location.binNumber}</span>
                    </div>
                  )}
                </div>

                {/* Occupancy */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Occupancy</span>
                    <span className={`font-semibold ${getOccupancyColor(location.currentCount, location.capacity)}`}>
                      {location.currentCount} / {location.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getOccupancyBarColor(location.currentCount, location.capacity)}`}
                      style={{
                        width: `${Math.min((location.currentCount / location.capacity) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                {isAdmin() && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        setEditingLocation(location);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => handleDelete(location._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )})}
        </div>

        {/* Empty State */}
        {locations.length === 0 && (
          <Card className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No storage locations
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first storage location
            </p>
            {isAdmin() && (
              <Button variant="primary" onClick={() => {
                setEditingLocation(null);
                setIsModalOpen(true);
              }}>
                <Plus className="h-5 w-5 mr-2" />
                Add Location
              </Button>
            )}
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLocation(null);
          }}
          title={editingLocation ? 'Edit Storage Location' : 'Add Storage Location'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Location Name"
              placeholder="e.g., Main Office Safe"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Room / Building"
              placeholder="e.g., Room 101, Admin Building"
              error={errors.location?.message}
              {...register('location')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Shelf Number (Optional)"
                placeholder="e.g., S1"
                error={errors.shelfNumber?.message}
                {...register('shelfNumber')}
              />
              <Input
                label="Bin Number (Optional)"
                placeholder="e.g., B42"
                error={errors.binNumber?.message}
                {...register('binNumber')}
              />
            </div>
            <Input
              label="Capacity (Max Items)"
              type="number"
              error={errors.capacity?.message}
              {...register('capacity')}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                className="rounded border-gray-300 text-primary-600"
                {...register('isActive')}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active and accepting items
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingLocation(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingLocation ? 'Update Location' : 'Create Location'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ComponentErrorBoundary>
  );
};

export default StorageList;
