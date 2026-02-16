import { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Package } from 'lucide-react';
import { Card, Button, Badge, Spinner } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { usePickups } from '@hooks/usePickups';



const PickupsList = () => {
  const { pickups, isLoading, error } = usePickups();

  const getStatusBadge = useCallback((isCompleted: boolean) => {
    if (isCompleted) return { variant: 'success' as const, label: 'Completed' };
    return { variant: 'info' as const, label: 'Scheduled' };
  }, []);

  const renderedPickups = useMemo(() => {
    return pickups.map((pickup) => {
      const statusBadge = getStatusBadge(pickup.isCompleted);
      return (
        <Link key={pickup._id} to={`/pickups/${pickup._id}`}>
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
                    <span>{pickup.claimantId?.name || 'Unknown Claimant'}</span>
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
    });
  }, [pickups, getStatusBadge]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pickup Schedule</h1>
          <p className="text-gray-600 mt-1">Manage item pickup appointments</p>
        </div>
      </div>

      {/* Calendar View Placeholder */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Pickups</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button variant="ghost" size="sm">
              List View
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {renderedPickups}
          </div>
        )}

        {!isLoading && pickups.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No pickups scheduled
            </h3>
            <p className="text-gray-600">
              Pickups will appear here once claims are verified
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PickupsList;
