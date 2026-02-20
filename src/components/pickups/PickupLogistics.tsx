import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Card } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { Pickup } from '../../types/pickup.types';
import { useAuth } from '@hooks/useAuth';

interface PickupLogisticsProps {
  pickup: Pickup;
}

const PickupLogistics = ({ pickup }: PickupLogisticsProps) => {
  const { isStaff, isAdmin } = useAuth();

  return (
    <Card className="p-6 rounded-[1.5rem] border-none shadow-lg shadow-gray-100/50 bg-white border border-gray-100">
      <h2 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2">
        <div className="p-1.5 bg-indigo-50 rounded-lg">
          <Calendar className="h-4 w-4 text-indigo-600" />
        </div>
        Logistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <Calendar className="h-4 w-4 text-indigo-400 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Date</p>
            <p className="text-xs font-black text-gray-900">{formatDate(pickup.pickupDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <Clock className="h-4 w-4 text-indigo-400 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Window</p>
            <p className="text-xs font-black text-gray-900">{pickup.startTime} - {pickup.endTime}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <MapPin className="h-4 w-4 text-indigo-400 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Point</p>
            <p className="text-xs font-black text-gray-900 truncate">
              {typeof pickup.claimId?.preferredPickupLocation === 'object'
                ? `${pickup.claimId.preferredPickupLocation.name}${pickup.claimId.preferredPickupLocation.city ? `, ${pickup.claimId.preferredPickupLocation.city}` : ''}`
                : typeof pickup.itemId?.storageLocation === 'object'
                ? `${pickup.itemId.storageLocation.name}${pickup.itemId.storageLocation.city ? `, ${pickup.itemId.storageLocation.city}` : ''}`
                : 'Main Security Office, Central Branch'}
            </p>
            {(isAdmin() || isStaff()) && (
              (typeof pickup.claimId?.preferredPickupLocation === 'object' && pickup.claimId.preferredPickupLocation.location) ||
              (typeof pickup.itemId?.storageLocation === 'object' && pickup.itemId.storageLocation.location)
            ) && (
              <p className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-tighter">
                Internal: {
                  (typeof pickup.claimId?.preferredPickupLocation === 'object' && pickup.claimId.preferredPickupLocation.location) ||
                  (typeof pickup.itemId?.storageLocation === 'object' && pickup.itemId.storageLocation.location)
                }
              </p>
            )}
          </div>
        </div>
      </div>
    
    {pickup.notes && (
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-500 mb-2">Additional Notes</p>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic">"{pickup.notes}"</p>
      </div>
    )}

    {pickup.isCompleted && pickup.completedAt && (
       <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Pickup Completed</h3>
              <p className="text-sm text-green-700">
                This item was handed over on {formatDate(pickup.completedAt)}
              </p>
            </div>
          </div>
       </div>
    )}
  </Card>
  );
};

export default PickupLogistics;
