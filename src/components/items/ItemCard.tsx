import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Calendar } from 'lucide-react';
import { Card, Badge } from '@components/ui';
import type { Item } from '../../types/item.types';
import { ITEM_CATEGORIES } from '@constants/categories';
import { ITEM_STATUS } from '@constants/status';
import { formatDate } from '@utils/formatters';
import { getItemImageUrl } from '@utils/image';

interface ItemCardProps {
  item: Item;
}

const ItemCard = memo(({ item }: ItemCardProps) => {
  return (
    <Link to={`/items/${item._id}`}>
      <Card hover className="h-full">
        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {item.photos && item.photos.length > 0 ? (
              <img 
                src={getItemImageUrl(item.photos[0].path) || ''} 
                alt={item.description} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <Package className="h-10 w-10 text-gray-400" />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="info">
                {ITEM_CATEGORIES[item.category].label}
              </Badge>
              <Badge variant={ITEM_STATUS[item.status].color as "success" | "warning" | "info" | "danger" | "default"}>
                {ITEM_STATUS[item.status].label}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {item.description}
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.locationFound}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Found on {formatDate(item.dateFound)}</span>
              </div>
            </div>

            {item.isHighValue && (
              <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                <Package className="h-4 w-4" />
                <span>High-value item</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
});

ItemCard.displayName = 'ItemCard';

export default ItemCard;
