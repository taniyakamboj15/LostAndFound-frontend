import { AlertCircle } from 'lucide-react';
import { Card } from '@components/ui';
import DispositionActions from '@components/items/DispositionActions';
import { formatDate } from '@utils/formatters';
import { ItemStatus } from '@constants/status';
import { Item } from '../../types/item.types';

interface RetentionAlertProps {
  item: Item;
  isAdminOrStaff: boolean;
  onDispositionComplete: () => void;
}

const RetentionAlert = ({ item, isAdminOrStaff, onDispositionComplete }: RetentionAlertProps) => {
  if (!item.retentionExpiryDate) return null;

  return (
    <Card className="bg-orange-50 border border-orange-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-orange-900">
            Retention Period
          </p>
          <p className="text-sm text-orange-700 mt-1">
            This item will be disposed on {formatDate(item.retentionExpiryDate)} if not claimed.
          </p>
        </div>
      </div>
      
      {/* Disposition Actions (Staff/Admin only) */}
      {isAdminOrStaff && new Date(item.retentionExpiryDate) < new Date() && item.status === ItemStatus.AVAILABLE && (
        <div className="mt-4 pt-4 border-t border-orange-200">
          <DispositionActions itemId={item._id} onDispositionComplete={onDispositionComplete} />
        </div>
      )}
    </Card>
  );
};

export default RetentionAlert;
