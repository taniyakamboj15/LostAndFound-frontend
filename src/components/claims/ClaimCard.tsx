import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, User as UserIcon } from 'lucide-react';
import { Card, Badge } from '@components/ui';
import { ClaimCardProps } from '@app-types/ui.types';
import { formatDate } from '@utils/formatters';
import { CLAIM_STATUS_VARIANT_MAP } from '@constants/ui';
import { ClaimStatus } from '@constants/status';

const ClaimCard = memo(({ claim }: ClaimCardProps) => {
  const statusVariant = CLAIM_STATUS_VARIANT_MAP[claim.status as ClaimStatus] || 'default';

  return (
    <Link to={`/claims/${claim._id}`}>
      <Card hover>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant={statusVariant}>
              {claim.status}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDate(claim.createdAt)}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            Claim #{claim._id.slice(-6)}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FileCheck className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Item: {claim.itemId.description}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <UserIcon className="h-4 w-4 flex-shrink-0" />
              <span>Claimant: {claim.claimantId.name}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});

ClaimCard.displayName = 'ClaimCard';

export default ClaimCard;
