import { MapPin, Calendar, User, Package, Clock } from 'lucide-react';
import { Card } from '@components/ui';
import { formatDate, formatRelativeTime } from '@utils/formatters';
import { Item } from '../../types/item.types';
import { useAuth } from '@hooks/useAuth';

interface ItemDetailsSidebarProps {
  item: Item;
}

const ItemDetailsSidebar = ({ item }: ItemDetailsSidebarProps) => {
  const { isAdmin, isStaff } = useAuth();

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Details
      </h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Location Found</p>
            <p className="text-sm text-gray-600">{item.locationFound}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Date Found</p>
            <p className="text-sm text-gray-600">
              {formatDate(item.dateFound)} ({formatRelativeTime(item.dateFound)})
            </p>
          </div>
        </div>

        {item.registeredBy && (
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Registered By</p>
              <p className="text-sm text-gray-600">{item.registeredBy.name}</p>
            </div>
          </div>
        )}

        {item.finderName && (
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Found By</p>
              <p className="text-sm text-gray-600">{item.finderName}</p>
              {item.finderContact && (
                <p className="text-xs text-gray-500">{item.finderContact}</p>
              )}
            </div>
          </div>
        )}

        {item.storageLocation && (
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Storage Location</p>
              <p className="text-sm text-gray-600">
                {typeof item.storageLocation === 'object' 
                  ? `${item.storageLocation.name}${item.storageLocation.city ? `, ${item.storageLocation.city}` : ''}`
                  : item.storageLocation}
              </p>
              {(isAdmin() || isStaff()) && typeof item.storageLocation === 'object' && item.storageLocation.location && (
                <p className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-tighter">
                  Internal: {item.storageLocation.location}
                </p>
              )}
            </div>
          </div>
        )}

        {item.retentionExpiryDate && (
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Retention Expiry</p>
              <p className="text-sm text-gray-600">
                {formatDate(item.retentionExpiryDate)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ItemDetailsSidebar;
