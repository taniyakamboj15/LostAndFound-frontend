import { Card } from '@components/ui';
import { User, Mail, Phone, AlertCircle, CreditCard } from 'lucide-react';
import { formatDate } from '@utils/formatters';
import { Pickup } from '../../types/pickup.types';

interface PickupClaimantInfoProps {
  pickup: Pickup;
}

const PickupClaimantInfo = ({ pickup }: PickupClaimantInfoProps) => (
  <div className="space-y-6">
    {/* Claimant Information */}
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Claimant Details
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{pickup.claimantId?.name}</p>
            <p className="text-xs text-gray-500">Claimant</p>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{pickup.claimantId?.email}</span>
          </div>
          {pickup.claimantId?.phone && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{pickup.claimantId.phone}</span>
            </div>
          )}
        </div>
      </div>
    </Card>

    {/* Important Info */}
    {!pickup.isCompleted && (
      <Card className="bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Pickup Checklist
            </p>
            <ul className="text-sm text-amber-800 mt-2 space-y-2 list-disc list-inside">
              <li>Bring a valid government photo ID</li>
              <li>Have your QR code or reference ready</li>
              <li>Arrive within your scheduled time window</li>
              <li>Inspection of the item is required before sign-off</li>
            </ul>
          </div>
        </div>
      </Card>
    )}

    {/* Fee Paid Card */}
    {pickup.claimId?.paymentStatus === 'PAID' && pickup.claimId?.feeDetails && (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-emerald-600" />
          Fee Paid
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Handling Fee</span>
            <span className="font-medium text-gray-900">₹{pickup.claimId.feeDetails.handlingFee ?? '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Storage Fee</span>
            <span className="font-medium text-gray-900">₹{pickup.claimId.feeDetails.storageFee ?? '—'}</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t pt-2 mt-1">
            <span className="text-gray-700">Total</span>
            <span className="text-emerald-700">₹{pickup.claimId.feeDetails.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
          {pickup.claimId.feeDetails.paidAt && (
            <p className="text-xs text-gray-500 pt-1">
              Paid on {formatDate(pickup.claimId.feeDetails.paidAt)}
            </p>
          )}
          {pickup.claimId.feeDetails.transactionId && (
            <p className="text-xs text-gray-400 font-mono truncate">
              {`pi_...${pickup.claimId.feeDetails.transactionId.slice(-6)}`}
            </p>
          )}
        </div>
      </Card>
    )}
  </div>
);

export default PickupClaimantInfo;
