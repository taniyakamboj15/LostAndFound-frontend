import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Badge } from '@components/ui';
import { ItemCardProps } from '@app-types/ui.types';
import { ITEM_CATEGORIES } from '@constants/categories';
import { ITEM_STATUS } from '@constants/status';
import { formatDate } from '@utils/formatters';
import { getItemImageUrl } from '@utils/image';

const ItemCard = memo(({ item }: ItemCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link to={`/items/${item._id}`}>
        <Card className="h-full overflow-hidden group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              {item.photos && item.photos.length > 0 ? (
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={getItemImageUrl(item.photos[0].path) || ''} 
                  alt={item.description} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <Package className="h-12 w-12 mb-2 stroke-[1.5]" />
                  <span className="text-xs font-medium">No Image Available</span>
                </div>
              )}
              
              {/* Status Badge Overlay */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <div className="backdrop-blur-md bg-white/70 rounded-full px-3 py-1 border border-white/50 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800">
                    {ITEM_CATEGORIES[item.category].label}
                  </span>
                </div>
              </div>

              {item.isHighValue && (
                <div className="absolute top-3 right-3">
                  <div className="bg-amber-100/90 backdrop-blur-sm border border-amber-200 text-amber-700 rounded-full px-2 py-1 shadow-sm">
                    <Package className="h-3 w-3" />
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="mb-3">
                <Badge 
                  variant={ITEM_STATUS[item.status]?.variant || 'default'} 
                  className="rounded-md font-bold text-[10px] px-2"
                >
                  {ITEM_STATUS[item.status]?.label || item.status}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                {item.description}
              </h3>

              <div className="mt-auto space-y-2.5">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium truncate">{item.locationFound}</span>
                </div>
                
                <div className="flex items-center gap-2.5 text-gray-500">
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium">Found {formatDate(item.dateFound)}</span>
                </div>
              </div>
              
              {/* Call to action hint */}
              <div className="mt-5 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                <span>View Details</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
});

ItemCard.displayName = 'ItemCard';

export default ItemCard;
