import { Pickup } from '../../types/pickup.types';

interface PickupQRCodeProps {
  pickup: Pickup;
}

const PickupQRCode = ({ pickup }: PickupQRCodeProps) => {
  if (!pickup.qrCode) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 mb-1">
        <img 
          src={pickup.qrCode} 
          alt="Pickup QR Code" 
          className="h-24 w-24 mx-auto"
        />
      </div>
      <p className="text-[10px] text-gray-900 font-mono font-black">
        {pickup.referenceCode}
      </p>
    </div>
  );
};

export default PickupQRCode;
