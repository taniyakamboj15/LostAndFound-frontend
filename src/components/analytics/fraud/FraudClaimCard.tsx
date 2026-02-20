import { AlertTriangle, AlertOctagon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '@components/ui';
import { format } from 'date-fns';
import { FLAG_LABELS } from '@constants/fraud';
import { getRiskLevel } from '@utils/getRiskLevel';

import { FraudClaim } from '@app-types/analytics.types';

interface FraudClaimCardProps {
  claim: FraudClaim;
}

const FraudClaimCard = ({ claim }: FraudClaimCardProps) => {
  const riskScore = claim.fraudRiskScore ?? 0;
  const risk = getRiskLevel(riskScore);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between p-4">
        {/* Left: fraud info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className={`w-5 h-5 flex-shrink-0 ${riskScore >= 85 ? 'text-red-600' : 'text-amber-500'}`} />
            <span className="font-semibold text-slate-900">Risk Score: {riskScore}/100</span>
            <Badge variant={risk.color}>{risk.label}</Badge>
            <Badge variant="default">{claim.status}</Badge>
          </div>

          {/* Item info */}
          {claim.itemId && (
            <p className="text-sm text-slate-600 truncate mb-1">
              <span className="font-medium">{claim.itemId.category}</span>: {claim.itemId.description}
            </p>
          )}

          {/* Claimant info */}
          {claim.claimantId && (
            <p className="text-xs text-slate-500 mb-2">
              Claimant: {claim.claimantId.name} ({claim.claimantId.email})
            </p>
          )}

          {/* Fraud flags */}
          <div className="flex flex-wrap gap-1">
            {claim.fraudFlags?.map((flag: string) => (
              <span key={flag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                <AlertTriangle className="w-3 h-3" />
                {FLAG_LABELS[flag] ?? flag}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-2">Filed {format(new Date(claim.createdAt), 'PPP p')}</p>
        </div>

        {/* Right: score bar + link */}
        <div className="flex flex-col items-end gap-3 ml-4">
          <div className="w-24">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Risk</span>
              <span>{riskScore}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${riskScore >= 85 ? 'bg-red-500' : 'bg-amber-400'}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>
          <Link to={`/claims/${claim._id}`}>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              View <ChevronRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default FraudClaimCard;
