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
  const isClaimedByCurrentUser = 
    item.claimedBy && 
    (typeof item.claimedBy === 'object' ? item.claimedBy._id : item.claimedBy) === (isStaffOrAdmin ? null : currentUser?._id); 

  return (
    <div className="space-y-6">
      <Card className="p-6 border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="info" className="px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider">
            {ITEM_CATEGORIES[item.category as ItemCategory].label}
          </Badge>
          <Badge variant={ITEM_STATUS[item.status as ItemStatus].variant} className="px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider">
            {ITEM_STATUS[item.status as ItemStatus].label}
          </Badge>
          {item.isHighValue && (
            <Badge variant="warning" className="px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider">
              High Value Item
            </Badge>
          )}
          {isClaimedByCurrentUser && (
            <Badge variant="info" className="px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider border-blue-200 bg-blue-50 text-blue-700">
              Claimed by You
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
          {item.description}
        </h1>

        <div className="prose max-w-none">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Description</h3>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{item.description}</p>
        </div>
      </Card>

      {/* Identifying Features */}
      {item.identifyingFeatures && item.identifyingFeatures.length > 0 && (
        <Card className="p-6 border-none shadow-md bg-white">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
            Identifying Features
          </h2>
          <div className="flex flex-wrap gap-3">
            {item.identifyingFeatures.map((feature: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 shadow-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Keywords */}
      {item.keywords && item.keywords.length > 0 && (
        <Card className="p-6 border-none shadow-md bg-white">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
            Related Keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {item.keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-semibold border border-gray-100"
              >
                #{keyword.toLowerCase()}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ItemInfoCard;
