import { Badge, Button } from '@components/ui';
import { CheckCircle, QrCode } from 'lucide-react';
import { formatDate } from '@utils/formatters';
import { Pickup } from '../../types/pickup.types';

interface PickupHeaderProps {
  pickup: Pickup;
  canAccessStaffRoutes: () => boolean;
  onScanClick: () => void;
  onCompleteClick: () => void;
  isCompleting: boolean;
}

const STATUS_BADGE_MAP = {
  true: { variant: 'success' as const, label: 'Completed' },
  false: { variant: 'info' as const, label: 'Scheduled' }
};

const PickupHeader = ({ 
  pickup, 
  canAccessStaffRoutes, 
  onScanClick, 
  onCompleteClick, 
  isCompleting 
}: PickupHeaderProps) => {
  const statusBadge = STATUS_BADGE_MAP[String(pickup.isCompleted) as keyof typeof STATUS_BADGE_MAP] || { variant: 'default', label: 'Unknown' };

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant={statusBadge.variant}>
            {statusBadge.label}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Pickup #{pickup.referenceCode || pickup._id.slice(-6).toUpperCase()}
        </h1>
        <p className="text-gray-600 mt-1">
          Scheduled for {formatDate(pickup.pickupDate)} at {pickup.startTime} - {pickup.endTime}
        </p>
      </div>

      {/* Actions (Staff/Admin only) */}
      {canAccessStaffRoutes() && !pickup.isCompleted && (
        <div className="flex gap-3 items-start">
           {!pickup.isVerified && (
            <Button
              variant="outline"
              onClick={onScanClick}
            >
              <QrCode className="h-5 w-5 mr-2" />
              Verify Pickup
            </Button>
          )}
          <div>
            <Button
              variant="primary"
              onClick={onCompleteClick}
              isLoading={isCompleting}
              disabled={!pickup.isVerified}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Pickup
            </Button>
            {!pickup.isVerified && (
              <p className="text-xs text-red-500 mt-1 text-right">
                * Verification required
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupHeader;
