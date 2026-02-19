import { Calendar, Clock, MapPin, Package, CheckCircle } from 'lucide-react';
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
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Pickup Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Scheduled Date</p>
            <p className="text-gray-900 font-medium">{formatDate(pickup.pickupDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Scheduled Time</p>
            <p className="text-gray-900 font-medium">{pickup.startTime} - {pickup.endTime}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-gray-900 font-medium">Main Office, Lost & Found Dept.</p>
          </div>
        </div>

        {pickup.referenceCode && !isStaff() && !isAdmin() && (
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Reference Code</p>
              <p className="text-gray-900 font-medium font-mono">{pickup.referenceCode}</p>
            </div>
          </div>
        )}
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
