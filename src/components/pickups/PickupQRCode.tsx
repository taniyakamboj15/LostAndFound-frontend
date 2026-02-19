import { Card } from '@components/ui';
import { Pickup } from '../../types/pickup.types';

interface PickupQRCodeProps {
  pickup: Pickup;
}

const PickupQRCode = ({ pickup }: PickupQRCodeProps) => {
  if (!pickup.qrCode || pickup.isCompleted) return null;

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Pickup QR Code
      </h2>
      <div className="text-center py-8">
        <div className="inline-block p-6 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
          <img 
            src={pickup.qrCode} 
            alt="Pickup QR Code" 
            className="h-40 w-40 mx-auto"
          />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Code: <span className="font-mono font-bold text-gray-900">{pickup.referenceCode}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
          Please show this QR code to the staff during your appointment for quick verification.
        </p>
      </div>
    </Card>
  );
};

export default PickupQRCode;
