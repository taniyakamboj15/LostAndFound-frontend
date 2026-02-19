import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Package, ArrowRight } from 'lucide-react';
import { Card, Badge } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { Pickup } from '@app-types/pickup.types';
import { useAuth } from '@hooks/useAuth';

interface PickupCardProps {
  pickup: Pickup;
}

const PickupCard = ({ pickup }: PickupCardProps) => {
  const { user } = useAuth();

  const getStatusBadge = (isCompleted: boolean) => {
    if (isCompleted) return { variant: 'success' as const, label: 'Completed' };
    return { variant: 'info' as const, label: 'Scheduled' };
  };

  const getClaimantName = (pickup: Pickup) => {
    const claimantId = typeof pickup.claimantId === 'object' ? pickup.claimantId._id : pickup.claimantId;
    const userId = user?.id || user?._id;
    const isMe = user && (claimantId === userId);
    
    if (isMe) return 'You';
    return (typeof pickup.claimantId === 'object' ? pickup.claimantId.name : 'Unknown Claimant');
  };

  const statusBadge = getStatusBadge(pickup.isCompleted);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={`/pickups/${pickup._id}`}>
        <Card className="group border-none shadow-md hover:shadow-xl bg-white overflow-hidden transition-all duration-300">
          <div className="flex flex-col h-full">
             {/* Status Header */}
             <div className="flex items-center justify-between p-4 bg-gray-50/50">
                <Badge variant={statusBadge.variant} className="shadow-sm">
                  {statusBadge.label}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   <Calendar className="h-3 w-3" />
                   {formatDate(pickup.pickupDate)}
                </div>
             </div>

             {/* Content */}
             <div className="p-5 flex-1 space-y-5">
                <div className="flex items-start gap-4">
                   <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-blue-600" />
                   </div>
                   <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {pickup.itemId?.description || pickup.claimId?.itemId?.description || 'Item Handoff'}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-sm font-medium">
                         <User className="h-3.5 w-3.5" />
                         <span>{getClaimantName(pickup)}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Time Slot</span>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                         <Clock className="h-4 w-4 text-blue-500" />
                         <span>{pickup.startTime} - {pickup.endTime}</span>
                      </div>
                   </div>
                   <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Location</span>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                         <MapPin className="h-4 w-4 text-red-500" />
                         <span className="truncate">Main Office</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Footer Action */}
             <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest">Pickup Logistics</span>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
             </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default PickupCard;
