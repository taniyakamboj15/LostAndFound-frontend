import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card, Button, Spinner } from '@components/ui';
import { usePickups } from '@hooks/usePickups';
import ScanPickupModal from '@components/claims/ScanPickupModal';
import { usePickupVerification } from '@hooks/usePickupVerification';
import PickupsHeader from '@components/pickups/PickupsHeader';
import PickupCard from '@components/pickups/PickupCard';
import CalendarView from '@components/pickups/CalendarView';

const PickupsList = () => {
  const { pickups, isLoading, error, filters, updateFilters } = usePickups();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const {
    isScanModalOpen,
    openScanModal,
    closeScanModal,
    handleVerifySuccess
  } = usePickupVerification();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PickupsHeader onVerifyClick={openScanModal} />

      <ScanPickupModal
        isOpen={isScanModalOpen}
        onClose={closeScanModal}
        onVerifySuccess={handleVerifySuccess}
      />

      {/* Filters and View Toggle */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-1 gap-4">
             <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.isCompleted || ''}
                onChange={(e) => updateFilters({ isCompleted: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.pickupDate || ''}
                onChange={(e) => updateFilters({ pickupDate: e.target.value })}
              />
            </div>
             {(filters.isCompleted || filters.pickupDate) && (
              <div className="flex items-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => updateFilters({ isCompleted: '', pickupDate: '' })}
                  className="mb-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-2 self-end md:self-center">
            <Button 
                variant={viewMode === 'calendar' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 gap-4">
                {pickups.map(pickup => (
                  <PickupCard key={pickup._id} pickup={pickup} />
                ))}
              </div>
            ) : (
              <CalendarView pickups={pickups} />
            )}
          </div>
        )}

        {!isLoading && pickups.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No pickups scheduled
            </h3>
            <p className="text-gray-600">
              Pickups will appear here once claims are verified
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PickupsList;


