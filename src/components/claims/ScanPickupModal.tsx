import { QrCode, Search, AlertCircle } from 'lucide-react';
import { Button, Spinner, Input, Modal } from '@components/ui';
import { useScanPickup } from '@hooks/useScanPickup';
import { cn } from '@utils/helpers';
import { ScanPickupModalProps } from '@app-types/ui.types';

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

  const tabs = [
    { id: 'scan', label: 'Scan QR', icon: QrCode },
    { id: 'manual', label: 'Manual Entry', icon: Search },
  ] as const;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Pickup"
      size="md"
    >
      <div className="flex border-b -mx-6 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              'flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {isVerifying ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 font-medium">Verifying code...</p>
          </div>
        ) : activeTab === 'scan' ? (
          <div className="text-center">
            <div id="reader" className="w-full overflow-hidden rounded-lg bg-gray-100 min-h-[250px]"></div>
            <p className="mt-4 text-sm text-gray-500">
              Point camera at the verification QR code
            </p>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <Input
              label="Reference Code"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="Ex: A1B2C3D4"
              maxLength={8}
              className="font-mono uppercase text-center text-lg tracking-widest"
              helperText="Enter the 8-character code from the pickup confirmation"
              fullWidth
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!manualCode || manualCode.length < 8}
            >
              Verify Code
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ScanPickupModal;
