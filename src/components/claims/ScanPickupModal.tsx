import { QrCode, Search, AlertCircle, X } from 'lucide-react';
import { Button, Spinner, Input } from '@components/ui';
import { Pickup } from '../../types/pickup.types';
import { useScanPickup } from '@hooks/useScanPickup';

interface ScanPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: (pickupData: Pickup) => void;
}

const ScanPickupModal = ({ isOpen, onClose, onVerifySuccess }: ScanPickupModalProps) => {
  const {
    activeTab,
    setActiveTab,
    manualCode,
    setManualCode,
    isVerifying,
    error,
    handleManualSubmit
  } = useScanPickup(isOpen, onVerifySuccess, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Verify Pickup</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'scan'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('scan')}
          >
            <div className="flex items-center justify-center gap-2">
              <QrCode className="h-4 w-4" />
              Scan QR
            </div>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'manual'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('manual')}
          >
            <div className="flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Manual Entry
            </div>
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {isVerifying ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Verifying code...</p>
            </div>
          ) : activeTab === 'scan' ? (
            <div className="text-center">
              <div id="reader" className="w-full overflow-hidden rounded-lg bg-gray-100 min-h-[250px]"></div>
              <p className="mt-4 text-sm text-gray-500">
                Point camera at the verification QR code
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Code
                </label>
                <Input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="Ex: A1B2C3D4"
                  maxLength={8}
                  className="font-mono uppercase"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the 8-character code from the pickup confirmation
                </p>
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!manualCode || manualCode.length < 8}
              >
                Verify Code
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanPickupModal;
