import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const isStaffOrAdmin = isAdmin() || isStaff();

  return (
    <ComponentErrorBoundary title="Item Detail Error">
      <div className="space-y-6">
        {/* Back Button */}
        <BackButton label="Back to Items" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos */}
            <ItemPhotos photos={item.photos} itemTitle={item.description} />

            {/* Description & Info */}
            <ItemInfoCard item={item} currentUser={user} isStaffOrAdmin={isStaffOrAdmin} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
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

            {/* Details */}
            <ItemDetailsSidebar item={item} />

            {/* Alert */}
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
          <div className="space-y-4">
            <p className="text-gray-600">
              To claim this item, you'll need to provide proof of ownership. Click continue to proceed with the claim process.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsClaimModalOpen(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsClaimModalOpen(false);
                  navigate(`/claims/create?itemId=${item._id}`);
                }}
                fullWidth
              >
                Continue
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
      </div>
    </ComponentErrorBoundary>
  );
};

export default ItemDetail;
