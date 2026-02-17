import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Package } from 'lucide-react';
import { Card, Badge } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { Pickup } from '@app-types/pickup.types';
import { useAuth } from '@hooks/useAuth';

interface PickupCardProps {
  pickup: Pickup;
}

const PickupCard = ({ pickup }: PickupCardProps) => {
  const { user } = useAuth();

  const getStatusBadge = (isCompleted: boolean) => {
    if (isCompleted) return { variant: 'success' as const, label: 'Completed' };
    return { variant: 'info' as const, label: 'Scheduled' };
  };

  const getClaimantName = (pickup: Pickup) => {
    const claimantId = typeof pickup.claimantId === 'object' ? pickup.claimantId._id : pickup.claimantId;
    // Handle both _id and id properties for user
    const userId = user?.id || user?._id;
    
    // Check if the current user is the claimant
    const isMe = user && (claimantId === userId);
    
    if (isMe) return 'You';
    return (typeof pickup.claimantId === 'object' ? pickup.claimantId.name : 'Unknown Claimant');
  };

  const statusBadge = getStatusBadge(pickup.isCompleted);

  return (
    <Link to={`/pickups/${pickup._id}`}>
      <Card hover padding="sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={statusBadge.variant}>
                {statusBadge.label}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {pickup.itemId?.description || pickup.claimId?.itemId?.description || 'Item Handoff'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4 flex-shrink-0" />
                <span>
                  {getClaimantName(pickup)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{formatDate(pickup.pickupDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{pickup.startTime} - {pickup.endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Main Office</span>
              </div>
            </div>
          </div>

          <div className="ml-4">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PickupCard;
