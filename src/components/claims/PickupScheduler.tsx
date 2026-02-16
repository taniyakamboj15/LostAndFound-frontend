import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@components/ui'; // Assuming these exist
import { format } from 'date-fns';
import api from '@services/api';
import toast from 'react-hot-toast'; // Assuming usage

interface PickupSchedulerProps {
  claimId: string;
  onScheduled: () => void;
}

interface Slot {
  startTime: string;
  endTime: string;
  available: boolean;
}

const PickupScheduler = ({ claimId, onScheduled }: PickupSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/pickups/available-slots?date=${selectedDate}`);
      if (res.data.success) {
        setSlots(res.data.data);
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
      await api.post('/pickups', {
        claimId,
        pickupDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      toast.success('Pickup scheduled successfully!');
      onScheduled();
    } catch (error) {
      toast.error('Failed to book pickup');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Schedule Pickup</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <input 
          type="date" 
          value={selectedDate}
          min={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Available Slots</h4>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {slots.map((slot, idx) => (
              <button
                key={idx}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot)}
                className={`p-2 text-sm rounded-md border ${
                  selectedSlot === slot 
                    ? 'bg-primary-600 text-white border-primary-600'
                    : slot.available 
                      ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                }`}
              >
                {slot.startTime} - {slot.endTime}
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
      >
        Confirm Booking
      </Button>
    </Card>
  );
};

export default PickupScheduler;
