import { useState } from 'react';
import { Button, Modal } from '@components/ui';
import api from '@services/api';
import toast from 'react-hot-toast';
import { Trash2, Gift, AlertTriangle } from 'lucide-react';

interface DispositionActionsProps {
  itemId: string;
  onDispositionComplete: () => void;
}

const DispositionActions = ({ itemId, onDispositionComplete }: DispositionActionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'DONATE' | 'AUCTION' | 'DISPOSE'>('DONATE');
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

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => setIsModalOpen(true)}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Process Disposition
        </Button>
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Process Item Disposition"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disposition Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`p-2 rounded border text-sm flex flex-col items-center justify-center gap-1 ${type === 'DONATE' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200'}`}
                  onClick={() => setType('DONATE')}
                >
                  <Gift size={16} /> Donate
                </button>
                <button
                  className={`p-2 rounded border text-sm flex flex-col items-center justify-center gap-1 ${type === 'AUCTION' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200'}`}
                  onClick={() => setType('AUCTION')}
                >
                  <span className="font-bold">$</span> Auction
                </button>
                <button
                  className={`p-2 rounded border text-sm flex flex-col items-center justify-center gap-1 ${type === 'DISPOSE' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200'}`}
                  onClick={() => setType('DISPOSE')}
                >
                  <Trash2 size={16} /> Dispose
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === 'DONATE' ? 'Charity / Recipient' : type === 'AUCTION' ? 'Auction House / url' : 'Disposal Method'}
              </label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={type === 'DONATE' ? 'e.g. Goodwill' : 'e.g. Incinerator'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleDispose} isLoading={loading} variant="primary">
                Confirm {type}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DispositionActions;
