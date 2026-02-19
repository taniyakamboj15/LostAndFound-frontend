import { Link } from 'react-router-dom';
import { Card, Button } from '@components/ui';
import { Pickup } from '../../types/pickup.types';

interface PickupItemInfoProps {
  pickup: Pickup;
}

const PickupItemInfo = ({ pickup }: PickupItemInfoProps) => (
  <Card>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Item Information
    </h2>
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Description</p>
        <p className="text-lg text-gray-900">{pickup.itemId?.description || pickup.claimId?.itemId?.description || 'N/A'}</p>
      </div>
      <Link to={`/items/${pickup.itemId?._id || pickup.claimId?.itemId?._id}`}>
        <Button variant="outline" size="sm">
          View Full Item Details
        </Button>
      </Link>
    </div>
  </Card>
);

export default PickupItemInfo;
