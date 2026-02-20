import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileCheck, User as UserIcon, Calendar, ArrowRight, MapPin, Trash2 } from 'lucide-react';
import { Card, Badge } from '@components/ui';
import { formatRelativeTime } from '@utils/formatters';
import { Claim } from '@app-types/claim.types';
import { CLAIM_STATUS_LABELS } from '@constants/status';
import { CLAIM_STATUS_VARIANT_MAP } from '@constants/ui';
import { useAuth } from '@hooks/useAuth';

interface ClaimCardProps {
  claim: Claim;
  onDelete?: (id: string) => void;
}

const ClaimCard = ({ claim, onDelete }: ClaimCardProps) => {
  const { user } = useAuth();
  
  const getStatusVariant = (status: string) => {
    return CLAIM_STATUS_VARIANT_MAP[status as keyof typeof CLAIM_STATUS_VARIANT_MAP] || 'default';
  };

  const isMyClaim = user && (claim.claimantId && typeof claim.claimantId === 'object' 
    ? (claim.claimantId._id === user.id || claim.claimantId._id === user._id)
    : (claim.claimantId === user.id || claim.claimantId === user._id));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={`/claims/${claim._id}`}>
        <Card className="group border-none shadow-md hover:shadow-xl bg-white overflow-hidden transition-all duration-300">
          <div className="flex flex-col h-full">
            {/* Top Bar with Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50/50">
              <Badge variant={getStatusVariant(claim.status)} className="shadow-sm">
                {CLAIM_STATUS_LABELS[claim.status as keyof typeof CLAIM_STATUS_LABELS] || claim.status}
              </Badge>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Calendar className="h-3 w-3" />
                  {formatRelativeTime(claim.filedAt || claim.createdAt)}
                </div>
                
                {(user?.role === 'ADMIN' || user?.role === 'STAFF' || isMyClaim) && onDelete && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (window.confirm('Delete this claim?')) onDelete(claim._id);
                    }}
                    className="p-1.5 bg-gray-100/50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-1"
                    title="Delete Claim"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                   <FileCheck className="h-4 w-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Claim ID: {claim._id.slice(-6)}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {claim.itemId?.description || 'Item Claim'}
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  <div className="p-1.5 bg-white rounded-md shadow-sm">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Claimant</span>
                    <span className="font-semibold text-gray-700 truncate">
                      {isMyClaim ? 'You' : (claim.claimantId && typeof claim.claimantId === 'object' ? claim.claimantId.name : 'Claimant')}
                    </span>
                  </div>
                </div>

                {claim.itemId?.storageLocation && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <MapPin className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Branch</span>
                      <span className="font-semibold text-blue-700 truncate">
                        {claim.itemId.storageLocation && typeof claim.itemId.storageLocation === 'object' 
                          ? `${claim.itemId.storageLocation.name}${claim.itemId.storageLocation.city ? `, ${claim.itemId.storageLocation.city}` : ''}`
                          : claim.itemId.storageLocation}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
              <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">View full details</span>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

ClaimCard.displayName = 'ClaimCard';

export default ClaimCard;

