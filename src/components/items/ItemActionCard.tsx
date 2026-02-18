import { Link } from 'react-router-dom';
import { Button, Card } from '@components/ui';
import { ItemStatus } from '@constants/status';
import { Item } from '../../types/item.types';
import { User } from '../../types/user.types';
import { Claim } from '../../types/claim.types';
import { Match } from '../../types/match.types';

interface ItemActionCardProps {
  item: Item;
  user: User | null;
  isAdminOrStaff: boolean;
  claims: Claim[];
  matches: Match[];
  isLoadingClaims: boolean;
  isLoadingMatches: boolean;
  onClaimClick: () => void;
  onEditClick: () => void;
  onViewClaimsClick: () => void;
  onViewMatchesClick: () => void;
}

const ItemActionCard = ({
  item,
  user,
  isAdminOrStaff,
  claims,
  matches,
  isLoadingClaims,
  isLoadingMatches,
  onClaimClick,
  onEditClick,
  onViewClaimsClick,
  onViewMatchesClick,
}: ItemActionCardProps) => {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Actions
      </h2>
      <div className="space-y-3">
        {item.status === ItemStatus.AVAILABLE && (
          user ? (
            <Button
              variant="primary"
              fullWidth
              onClick={onClaimClick}
            >
              File a Claim
            </Button>
          ) : (
            <Link to={`/login?redirect=/items/${item._id}`}>
              <Button variant="primary" fullWidth>
                Login to Claim
              </Button>
            </Link>
          )
        )}
        {isAdminOrStaff && (
          <>
            <Button 
              variant="outline" 
              fullWidth
              onClick={onEditClick}
            >
              Edit Item
            </Button>
            
            {/* View Claims Button */}
            <Button 
                variant="outline" 
                fullWidth 
                onClick={onViewClaimsClick}
                disabled={claims.length === 0 || isLoadingClaims}
            >
                {isLoadingClaims ? 'Loading Claims...' : claims.length > 0 ? `View Active Claim${claims.length > 1 ? 's' : ''}` : 'No Active Claim'}
            </Button>

            {/* View Matches Button */}
            <Button 
                variant="outline" 
                fullWidth 
                onClick={onViewMatchesClick}
                disabled={matches.length === 0 || isLoadingMatches}
            >
                 {isLoadingMatches ? 'Loading Matches...' : matches.length > 0 ? `View ${matches.length} Match${matches.length !== 1 ? 'es' : ''}` : 'No Matches Found'}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default ItemActionCard;
