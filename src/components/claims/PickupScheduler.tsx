import { Card, Button, Spinner } from '@components/ui';
import { format } from 'date-fns';
import { usePickupManagement } from '@hooks/usePickupManagement';
import { PICKUP_SLOT_VARIANT_MAP } from '@constants/ui';
import { PickupSlot } from '../../types/pickup.types';
import { PickupSchedulerProps } from '@app-types/ui.types';

const PickupScheduler = ({ claimId, onScheduled }: PickupSchedulerProps) => {
  const {
    selectedDate,
    setSelectedDate,
    slots,
    loading,
    selectedSlot,
    setSelectedSlot,
    submitting,
    bookPickup
  } = usePickupManagement(claimId);

  const getSlotStyles = (slot: PickupSlot) => {
    if (selectedSlot === slot) return PICKUP_SLOT_VARIANT_MAP.selected;
    if (slot.available) return PICKUP_SLOT_VARIANT_MAP.available;
    return PICKUP_SLOT_VARIANT_MAP.unavailable;
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Schedule Pickup</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <div className="flex gap-2">
            <input 
            type="date" 
            value={selectedDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-medium mb-2 text-gray-900">Available Slots</h4>
        {loading ? (
             <div className="flex justify-center py-4">
                <Spinner size="sm" />
             </div>
        ) : slots.length === 0 ? (
            <p className="text-gray-500 text-sm">No slots available for this date.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {slots.map((slot, idx) => (
              <button
                key={idx}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot)}
                className={`p-2 text-xs font-medium rounded-md border transition-colors ${getSlotStyles(slot)}`}
              >
                {slot.startTime}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button 
        fullWidth 
        disabled={!selectedSlot} 
        isLoading={submitting}
        onClick={() => bookPickup(onScheduled)}
        variant="primary"
      >
        Confirm Booking
      </Button>
    </Card>
  );
};

export default PickupScheduler;
