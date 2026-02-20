import { MapPin, Plus, Package, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '@components/ui';
import { ComponentErrorBoundary } from '@components/feedback';
import { STATUS_BADGE_CONFIG } from '@constants/ui';

// Hooks
import { useStorageListPage } from '@hooks/useStorageListPage';

const StorageList = () => {
  const {
    locations,
    loaderError,
    isAdmin,
    isStaff,
    groupedLocations,
    isModalOpen,
    editingLocation,
    overflowItems,
    isOverflowModalOpen,
    setIsOverflowModalOpen,
    isLoadingOverflow,
    availableCities,
    register,
    handleSubmit,
    setValue,
    errors,
    onSubmitHandler,
    handleDelete,
    handleSuggestOverflow,
    openAddModal,
    openEditModal,
    closeModal,
    getOccupancyColor,
    getOccupancyBarColor
  } = useStorageListPage();

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSuggestOverflow}
                isLoading={isLoadingOverflow}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Overflow Suggestions
              </Button>
              <Button variant="primary" onClick={openAddModal}>
                <Plus className="h-5 w-5 mr-2" />
                Add Location
              </Button>
            </div>
          )}
        </div>

        {/* Error State */}
        {loaderError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {loaderError}
          </div>
        )}

        {/* Storage Locations Grid by City */}
        <div className="space-y-12">
          {Object.entries(groupedLocations).map(([city, cityLocations]) => (
            <div key={city} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-800">{city}</h2>
                <Badge variant="info" className="ml-2">
                  {cityLocations.length} Location{cityLocations.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cityLocations.map((location) => {
                  const statusConfig = STATUS_BADGE_CONFIG[String(location.isActive) as keyof typeof STATUS_BADGE_CONFIG];
                  const isFull = (location.capacity.small > 0 && location.currentCount.small >= location.capacity.small) ||
                                (location.capacity.medium > 0 && location.currentCount.medium >= location.capacity.medium) ||
                                (location.capacity.large > 0 && location.currentCount.large >= location.capacity.large);
                  
                  return (
                    <Card key={location._id} className="hover:shadow-md transition-shadow duration-200">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {location.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">{location.location}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                            {isFull && <Badge variant="danger">Full</Badge>}
                            {location.isPickupPoint && <Badge variant="info">Pickup Point</Badge>}
                          </div>
                        </div>

                        {/* Location Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-gray-50 rounded px-2">
                          {location.shelfNumber && (
                            <div className="flex flex-col">
                              <span className="text-gray-500 uppercase font-bold tracking-tighter">Shelf</span>
                              <span className="font-medium text-gray-900">{location.shelfNumber}</span>
                            </div>
                          )}
                          {location.binNumber && (
                            <div className="flex flex-col">
                              <span className="text-gray-500 uppercase font-bold tracking-tighter">Bin</span>
                              <span className="font-medium text-gray-900">{location.binNumber}</span>
                            </div>
                          )}
                        </div>

                        {/* Occupancy */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Capacity</p>
                          
                          {/* Small Items */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Small</span>
                              <span className={`font-semibold ${getOccupancyColor(location.currentCount.small, location.capacity.small)}`}>
                                {location.currentCount.small} / {location.capacity.small}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getOccupancyBarColor(location.currentCount.small, location.capacity.small)}`}
                                style={{ width: `${Math.min((location.currentCount.small / (location.capacity.small || 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Medium Items */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Medium</span>
                              <span className={`font-semibold ${getOccupancyColor(location.currentCount.medium, location.capacity.medium)}`}>
                                {location.currentCount.medium} / {location.capacity.medium}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getOccupancyBarColor(location.currentCount.medium, location.capacity.medium)}`}
                                style={{ width: `${Math.min((location.currentCount.medium / (location.capacity.medium || 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Large Items */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Large</span>
                              <span className={`font-semibold ${getOccupancyColor(location.currentCount.large, location.capacity.large)}`}>
                                {location.currentCount.large} / {location.capacity.large}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getOccupancyBarColor(location.currentCount.large, location.capacity.large)}`}
                                style={{ width: `${Math.min((location.currentCount.large / (location.capacity.large || 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {isAdmin() && (
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              fullWidth
                               onClick={() => openEditModal(location)}
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
                  );
                })}
              </div>
            </div>
          ))}
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
              <Button variant="primary" onClick={openAddModal}>
                <Plus className="h-5 w-5 mr-2" />
                Add Location
              </Button>
            )}
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingLocation ? 'Edit Storage Location' : 'Add Storage Location'}
        >
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
            <Input
              label="Branch Name"
              placeholder="e.g., Downtown Hub, Terminal 1 Center"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Internal Location (Shelf/Room)"
              placeholder="e.g., Room 101, Cabinet B, shelf 3"
              error={errors.location?.message}
              {...register('location')}
            />
            <div className="space-y-1">
              <Input
                label="City"
                placeholder="e.g., Mumbai, New York"
                error={errors.city?.message}
                {...register('city')}
              />
              {availableCities.length > 0 && !editingLocation && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="text-[10px] text-gray-400 uppercase font-bold w-full">Fast Select City</p>
                  {availableCities.map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setValue('city', city)}
                      className="text-[10px] px-2 py-1 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full border border-gray-200 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Input
              label="Full Address (Optional)"
              placeholder="e.g., 123 Street Name, Area..."
              error={errors.address?.message}
              {...register('address')}
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
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Small Cap"
                type="number"
                error={errors.capacity?.small?.message}
                {...register('capacity.small')}
              />
              <Input
                label="Medium Cap"
                type="number"
                error={errors.capacity?.medium?.message}
                {...register('capacity.medium')}
              />
              <Input
                label="Large Cap"
                type="number"
                error={errors.capacity?.large?.message}
                {...register('capacity.large')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  className="rounded border-gray-300 text-primary-600"
                  {...register('isActive')}
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPickupPoint"
                  className="rounded border-gray-300 text-purple-600"
                  {...register('isPickupPoint')}
                />
                <label htmlFor="isPickupPoint" className="text-sm font-medium text-purple-700">
                  Is Pickup Point
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingLocation ? 'Update Location' : 'Create Location'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Overflow Suggestion Modal */}
        <Modal
          isOpen={isOverflowModalOpen}
          onClose={() => setIsOverflowModalOpen(false)}
          title="Overflow Suggestions"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-none" />
              <p>The following items are the oldest in storage and are candidates for transfer to overflow or secondary storage to free up capacity.</p>
            </div>
            {overflowItems.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No overflow candidates found. Storage is within normal capacity.</p>
            ) : (
              <ul className="divide-y">
                {overflowItems.map((itemId) => (
                  <li key={itemId} className="py-2 flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-gray-700">{itemId}</span>
                    <a
                      href={`/items/${itemId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto text-primary-600 hover:underline text-xs"
                    >
                      View →
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" fullWidth onClick={() => setIsOverflowModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      </div>
    </ComponentErrorBoundary>
  );
};

export default StorageList;
