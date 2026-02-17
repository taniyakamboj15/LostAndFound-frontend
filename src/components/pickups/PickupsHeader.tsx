import { Package } from 'lucide-react';
import { Button } from '@components/ui';
import { useAuth } from '@hooks/useAuth';

interface PickupsHeaderProps {
  onVerifyClick: () => void;
}

const PickupsHeader = ({ onVerifyClick }: PickupsHeaderProps) => {
  const { user } = useAuth();
  const canVerify = user && ['staff', 'admin'].includes(user.role);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pickup Schedule</h1>
        <p className="text-gray-600 mt-1">Manage item pickup appointments</p>
      </div>
      {canVerify && (
        <Button variant="primary" onClick={onVerifyClick}>
          <Package className="h-4 w-4 mr-2" />
          Verify Pickup
        </Button>
      )}
    </div>
  );
};

export default PickupsHeader;
