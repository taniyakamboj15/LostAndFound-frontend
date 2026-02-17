import { AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@components/ui';
import { DISPOSITION_UI_CONFIG } from '@constants/ui';
import { DispositionType } from '@constants/status';
import { useDisposition } from '@hooks/useDisposition';
import { DispositionActionsProps } from '@app-types/ui.types';

const DispositionActions = ({ itemId, onDispositionComplete }: DispositionActionsProps) => {
  const {
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
  } = useDisposition(itemId, onDispositionComplete);

  const currentConfig = DISPOSITION_UI_CONFIG[type];

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
                {(Object.entries(DISPOSITION_UI_CONFIG) as [DispositionType, typeof currentConfig][]).map(([key, config]) => {
                  const Icon = config.icon;
                  const isActive = type === key;
                  return (
                    <button
                      key={key}
                      className={`p-2 rounded border text-sm flex flex-col items-center justify-center gap-1 transition-colors ${
                        isActive ? config.colorClass : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setType(key)}
                    >
                      <Icon size={16} /> {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {(() => {
                  const labels = {
                    [DispositionType.DONATE]: 'Charity / Recipient',
                    [DispositionType.AUCTION]: 'Auction House / URL',
                    [DispositionType.DISPOSE]: 'Disposal Method'
                  };
                  return labels[type];
                })()}
              </label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={currentConfig.placeholder}
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
                Confirm {currentConfig.label}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DispositionActions;
