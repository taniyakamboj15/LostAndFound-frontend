import { Badge, Card } from '@components/ui';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { ItemStatus, ITEM_STATUS } from '@constants/status';
import { Item } from '../../types/item.types';
import { User } from '../../types/user.types';

interface ItemInfoCardProps {
  item: Item;
  currentUser: User | null;
  isStaffOrAdmin: boolean;
}

const ItemInfoCard = ({ item, currentUser, isStaffOrAdmin }: ItemInfoCardProps) => {
  const getStatusBadgeVariant = (status: ItemStatus) => {
    return ITEM_STATUS[status].variant;
  };

  const isClaimedByCurrentUser = 
    item.claimedBy && 
    (typeof item.claimedBy === 'object' ? item.claimedBy._id : item.claimedBy) === (isStaffOrAdmin ? null : currentUser?._id); 

 
  return (
    <>
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="info">
              {ITEM_CATEGORIES[item.category as ItemCategory].label}
            </Badge>
            <Badge variant={getStatusBadgeVariant(item.status as ItemStatus)}>
              {ITEM_STATUS[item.status as ItemStatus].label}
            </Badge>
            {item.isHighValue && (
              <Badge variant="warning">High Value</Badge>
            )}
            {/* Logic for 'Claimed by You' might need specific user ID comparison. 
                Using simplistic check here based on passed boolean or logic in parent if needed, 
                but let's try to replicate logic. 
            */}
             {isClaimedByCurrentUser && (
                 <Badge variant="info">Claimed by You</Badge>
             )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {ITEM_CATEGORIES[item.category as ItemCategory].label} - {item.description.substring(0, 50)}...
        </h1>

        <div className="prose max-w-none">
          <p className="text-gray-700">{item.description}</p>
        </div>
      </Card>

      {/* Identifying Features */}
      {item.identifyingFeatures && item.identifyingFeatures.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Identifying Features
          </h2>
          <div className="flex flex-wrap gap-2">
            {item.identifyingFeatures.map((feature: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Keywords */}
      {item.keywords && item.keywords.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {item.keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </Card>
      )}
    </>
  );
};

export default ItemInfoCard;
