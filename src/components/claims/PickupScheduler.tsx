import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@components/ui';
import { format } from 'date-fns';
import { pickupService } from '@services/pickup.service';
import { useToast } from '@hooks/useToast';
import { PickupSlot } from '../../types/pickup.types';

interface PickupSchedulerProps {
  claimId: string;
  onScheduled: () => void;
}

const PickupScheduler = ({ claimId, onScheduled }: PickupSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<PickupSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setSelectedSlot(null);
      const res = await pickupService.getAvailableSlots(selectedDate);
      if (res.success) {
        setSlots(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch slots", error);
      setSlots([]);
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    
    try {
      setSubmitting(true);
      await pickupService.book({
        claimId,
        pickupDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      toast.success('Pickup scheduled successfully!');
      onScheduled();
    } catch (error) {
      // Error is handled by service/interceptor usually, or we can show generic
      toast.error('Failed to book pickup');
    } finally {
      setSubmitting(false);
    }
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
                className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                  selectedSlot === slot 
                    ? 'bg-primary-600 text-white border-primary-600'
                    : slot.available 
                      ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                }`}
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
        onClick={handleBook}
        variant="primary"
      >
        Confirm Booking
      </Button>
    </Card>
  );
};

export default PickupScheduler;
