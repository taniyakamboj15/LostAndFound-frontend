import { Link } from 'react-router-dom';
import { User, FileText, Clock, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { Card, Button } from '@components/ui';
import { ClaimStatus } from '../../constants/status';
import { formatDate } from '@utils/formatters';
import type { Claim, User as UserType } from '../../types';
import { useAuth } from '@hooks/useAuth';

interface ClaimSidebarProps {
  claim: Claim;
  showAdminActions?: boolean;
}

const ClaimSidebar = ({ claim, showAdminActions = false }: ClaimSidebarProps) => {
  const { isAdmin, isStaff } = useAuth();
  const claimantName = (claim.claimantId as UserType).name;
  const claimantEmail = (claim.claimantId as UserType).email;
  const claimantPhone = (claim.claimantId as UserType).phone;

  return (
    <div className="space-y-6">
      {/* Claimant Information */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Claimant Information</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Name</p>
              <p className="text-sm text-gray-900">{claimantName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-900">{claimantEmail}</p>
            </div>
          </div>
          {claimantPhone && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-sm text-gray-900">{claimantPhone}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Status Info */}
      <Card className="bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Current Status</p>
            <p className="text-sm text-blue-700 mt-1">
              {claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED &&
                'Waiting for staff verification of proof documents'}
              {claim.status === ClaimStatus.VERIFIED &&
                'Claim verified. Claimant can now book a pickup.'}
              {claim.status === ClaimStatus.FILED && 'Claim filed. Awaiting initial review.'}
              {claim.status === ClaimStatus.PICKUP_BOOKED &&
                'Pickup scheduled. Please visit the storage location at the scheduled time.'}
              {claim.status === ClaimStatus.RETURNED &&
                'Item has been returned to the claimant. Case closed.'}
              {claim.status === ClaimStatus.REJECTED &&
                `Claim rejected. Reason: ${claim.rejectionReason || 'No reason provided.'}`}
            </p>
            {claim.status === ClaimStatus.PICKUP_BOOKED && (
              <Link to={`/pickups`}>
                <Button variant="primary" size="sm" className="mt-2">
                  View Pickup
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* Storage/Owner Information (Verified only) */}
      {claim.status === ClaimStatus.VERIFIED && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pickup Location</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-sm text-gray-900">
                  {typeof claim.itemId?.storageLocation === 'object' 
                    ? claim.itemId.storageLocation.name 
                    : (claim.itemId?.storageLocation || 'Main Storage')}
                  {typeof claim.itemId?.storageLocation === 'object' && claim.itemId.storageLocation.city && (
                    <span className="text-gray-500 font-normal">, {claim.itemId.storageLocation.city}</span>
                  )}
                </p>
                {(isAdmin() || isStaff()) && typeof claim.itemId?.storageLocation === 'object' && claim.itemId.storageLocation.location && (
                  <p className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-tighter">
                    Internal: {claim.itemId.storageLocation.location}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Hours</p>
                <p className="text-sm text-gray-900">Mon-Fri, 9AM - 5PM</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Status (Staff / Admin only) */}
      {showAdminActions && claim.status === ClaimStatus.VERIFIED && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-500" />
            Payment Status
          </h2>
          {claim.paymentStatus === 'PAID' && claim.feeDetails ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  ✅ PAID
                </span>
                <span className="font-bold text-emerald-700">
                  ₹{claim.feeDetails.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
              {claim.feeDetails.paidAt && (
                <p className="text-xs text-gray-500">
                  Paid on {formatDate(claim.feeDetails.paidAt)}
                </p>
              )}
            </div>
          ) : claim.paymentStatus === 'FAILED' ? (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                FAILED
              </span>
              <p className="text-xs text-gray-500 ml-1">Payment attempt failed</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                PENDING
              </span>
              <p className="text-xs text-gray-500 ml-1">Awaiting payment from claimant</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ClaimSidebar;
