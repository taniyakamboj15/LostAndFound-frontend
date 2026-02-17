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
  const { pickups, isLoading, error } = usePickups();
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

      {/* Calendar/List View Toggle */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {viewMode === 'list' ? 'Upcoming Pickups' : 'Calendar'}
          </h2>
          <div className="flex gap-2">
            <Button 
                variant={viewMode === 'calendar' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
            >
              List View
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


