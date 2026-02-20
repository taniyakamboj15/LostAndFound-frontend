import { Edit3, Eye, Search, HeartHandshake } from 'lucide-react';
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
    <Card className="p-6 border-none shadow-lg bg-white sticky top-24">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-5">
        Manage Item
      </h2>
      <div className="space-y-4">
        {item.status === ItemStatus.AVAILABLE && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            className="py-6 shadow-md shadow-blue-200 hover:shadow-lg transition-all"
            onClick={onClaimClick}
          >
            <HeartHandshake className="mr-2 h-5 w-5" />
            {user ? 'File a Claim' : 'Claim This Item'}
          </Button>
        )}
        
        {isAdminOrStaff && (
          <div className="grid grid-cols-1 gap-3 pt-2">
            <Button 
              variant="outline" 
              fullWidth
              onClick={onEditClick}
              className="justify-start px-4 h-12"
            >
              <Edit3 className="mr-3 h-4 w-4 text-gray-500" />
              Edit Item Details
            </Button>
            
            <Button 
                variant="outline" 
                fullWidth 
                onClick={onViewClaimsClick}
                disabled={claims.length === 0 || isLoadingClaims}
                className="justify-start px-4 h-12"
            >
                {isLoadingClaims ? (
                  <span className="flex items-center italic text-gray-400">Loading...</span>
                ) : (
                  <>
                    <Eye className={`mr-3 h-4 w-4 ${claims.length > 0 ? 'text-blue-500' : 'text-gray-300'}`} />
                    <span className={claims.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                      {claims.length > 0 ? `View ${claims.length} Active Claim${claims.length > 1 ? 's' : ''}` : 'No Active Claims'}
                    </span>
                  </>
                )}
            </Button>

            <Button 
                variant="outline" 
                fullWidth 
                onClick={onViewMatchesClick}
                disabled={matches.length === 0 || isLoadingMatches}
                className="justify-start px-4 h-12"
            >
                 {isLoadingMatches ? (
                   <span className="flex items-center italic text-gray-400">Loading...</span>
                 ) : (
                   <>
                    <Search className={`mr-3 h-4 w-4 ${matches.length > 0 ? 'text-purple-500' : 'text-gray-300'}`} />
                    <span className={matches.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                      {matches.length > 0 ? `View ${matches.length} Match${matches.length !== 1 ? 'es' : ''}` : 'No Matches Found'}
                    </span>
                   </>
                 )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ItemActionCard;
