import { useState } from 'react';
import api from '@services/api';
import toast from 'react-hot-toast';
import { DispositionType } from '@constants/status';

export const useDisposition = (itemId: string, onDispositionComplete: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<DispositionType>(DispositionType.DONATE);
  const [recipient, setRecipient] = useState('');
  const [notes, setNotes] = useState('');

  const handleDispose = async () => {
    try {
      setLoading(true);
      await api.post('/dispositions', {
        itemId,
        type,
        recipient,
        notes
      });
      toast.success('Item processed successfully');
      setIsModalOpen(false);
      onDispositionComplete();
    } catch (error) {
      toast.error('Failed to process item');
    } finally {
      setLoading(false);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    loading,
    type,
    setType,
    recipient,
    setRecipient,
    notes,
    setNotes,
    handleDispose
  };
};
