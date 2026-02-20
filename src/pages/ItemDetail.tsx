import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ShieldCheck, Clock } from 'lucide-react';
import { Modal, Spinner, Button } from '@components/ui';
import BackButton from '@components/ui/BackButton';
import MatchListModal from '@components/matches/MatchListModal';

import { useAuth } from '@hooks/useAuth';
import { useItemDetail } from '@hooks/useItems';
import { ComponentErrorBoundary } from '@components/feedback';
import matchService from '@services/match.service';
import { claimService } from '@services/claim.service';
import ItemPhotos from '@components/items/ItemPhotos';
import ItemInfoCard from '@components/items/ItemInfoCard';
import ItemActionCard from '@components/items/ItemActionCard';
import ItemDetailsSidebar from '@components/items/ItemDetailsSidebar';
import RetentionAlert from '@components/items/RetentionAlert';
import { Match } from '../types/match.types';
import { Claim } from '../types/claim.types';
import { formatDate } from '@utils/formatters';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isStaff, user } = useAuth();
  const { item, isLoading: loading } = useItemDetail(id || null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Match and Claim state
  const [matches, setMatches] = useState<Match[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);

  useEffect(() => {
    const fetchRelatedData = async () => {
      if ((isAdmin() || isStaff()) && id) {
        try {
          setIsLoadingMatches(true);
          const matchData = await matchService.getMatchesForItem(id);
          setMatches(matchData);
        } catch (error) {
          console.error('Error fetching matches:', error);
        } finally {
          setIsLoadingMatches(false);
        }

        try {
          setIsLoadingClaims(true);
          const claimResponse = await claimService.getAll({ itemId: id });
          setClaims(claimResponse.data);
        } catch (error) {
          console.error('Error fetching claims:', error);
        } finally {
          setIsLoadingClaims(false);
        }
      }
    };

    if (item) {
        fetchRelatedData();
    }
  }, [id, isAdmin, isStaff, item]);

  if (loading || !item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const isStaffOrAdmin = isAdmin() || isStaff();

  return (
    <ComponentErrorBoundary title="Item Detail Error">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Navigation & Breadcrumbs */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <BackButton label="Back to Items Gallery" />
          
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
             <div className="flex items-center gap-1.5">
               <Calendar className="h-4 w-4" />
               <span>Reported {formatDate(item.createdAt)}</span>
             </div>
             <div className="flex items-center gap-1.5">
               <ShieldCheck className="h-4 w-4 text-green-500" />
               <span className="text-gray-900">Verified Listing</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visuals & Description Section */}
          <div className="lg:col-span-8 space-y-8">
            {/* Photos Section */}
            <ItemPhotos photos={item.photos} itemTitle={item.description} />

            {/* Details & Information */}
            <ItemInfoCard item={item} currentUser={user} isStaffOrAdmin={isStaffOrAdmin} />
            
            {/* Quick Metadata Grid (Optional but modern) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location Found</p>
                  <p className="text-gray-900 font-semibold">{item.locationFound}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-purple-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Reported</p>
                  <p className="text-gray-900 font-semibold">{formatDate(item.dateFound)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Interaction Section */}
          <div className="lg:col-span-4 space-y-8">
            <ItemActionCard
                item={item}
                user={user}
                isAdminOrStaff={isStaffOrAdmin}
                claims={claims}
                matches={matches}
                isLoadingClaims={isLoadingClaims}
                isLoadingMatches={isLoadingMatches}
                onClaimClick={() => setIsClaimModalOpen(true)}
                onEditClick={() => navigate(`/items/${id}/edit`)}
                onViewClaimsClick={() => {
                    if (claims.length > 0) {
                        navigate(`/claims/${claims[0]._id}`);
                    }
                }}
                onViewMatchesClick={() => setIsMatchModalOpen(true)}
            />

            <ItemDetailsSidebar item={item} />

            <RetentionAlert 
                item={item} 
                isAdminOrStaff={isStaffOrAdmin}
                onDispositionComplete={() => navigate('/items')} 
            />
          </div>
        </div>

        {/* Claim Modal */}
        <Modal
          isOpen={isClaimModalOpen}
          onClose={() => setIsClaimModalOpen(false)}
          title="File a Claim"
          size="md"
        >
          <div className="p-2 space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-4">
               <ShieldCheck className="h-6 w-6 text-blue-600 mt-1" />
               <div>
                  <h4 className="font-bold text-blue-900">Identity Verification Required</h4>
                  <p className="text-sm text-blue-700 leading-relaxed mt-1">
                    To maintain security, we require proof of ownership such as unique features descriptions or purchase receipts.
                  </p>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsClaimModalOpen(false)}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsClaimModalOpen(false);
                  if (user) {
                    navigate(`/claims/create?itemId=${item._id}`);
                  } else {
                    navigate(`/claims/anonymous?itemId=${item._id}`);
                  }
                }}
                className="flex-1 shadow-md shadow-blue-200"
              >
                Proceed to Claim
              </Button>
            </div>
          </div>
        </Modal>

        {/* Match List Modal */}
        <MatchListModal
            isOpen={isMatchModalOpen}
            onClose={() => setIsMatchModalOpen(false)}
            matches={matches}
        />
      </motion.div>
    </ComponentErrorBoundary>
  );
};

export default ItemDetail;
