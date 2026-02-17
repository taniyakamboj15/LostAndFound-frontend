import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pickupService } from '@services/pickup.service';
import { useToast } from '@hooks/useToast';
import { PickupSlot } from '../types/pickup.types';

export const usePickupManagement = (claimId: string, initialDate?: string) => {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || format(new Date(), 'yyyy-MM-dd'));
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

  const bookPickup = async (onSuccess?: () => void) => {
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
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to book pickup');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    slots,
    loading,
    selectedSlot,
    setSelectedSlot,
    submitting,
    bookPickup,
    refreshSlots: fetchSlots
  };
};
