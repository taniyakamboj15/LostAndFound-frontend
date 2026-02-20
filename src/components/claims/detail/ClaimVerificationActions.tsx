import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Card, Button } from '@components/ui';
import FeeBreakdownComponent from '@components/payment/FeeBreakdown';
import PickupScheduler from '@components/claims/PickupScheduler';
import { ClaimStatus } from '@constants/status';
import { Claim } from '@/types/claim.types';

import { FeeBreakdown } from '@/types/ui.types';

interface ClaimVerificationActionsProps {
  claim: Claim;
  isClaimant: boolean;
  feeBreakdown: FeeBreakdown | null;
  loadingFee: boolean;
  isPayLoading: boolean;
  handlePayClick: () => void;
  navigate: (path: string) => void;
}

const ClaimVerificationActions = ({
  claim,
  isClaimant,
  feeBreakdown,
  loadingFee,
  isPayLoading,
  handlePayClick,
  navigate
}: ClaimVerificationActionsProps) => {
  if (!isClaimant) return null;
  const validStatuses = [
    ClaimStatus.VERIFIED, 
    ClaimStatus.ARRIVED, 
    ClaimStatus.AWAITING_TRANSFER, 
    ClaimStatus.IN_TRANSIT
  ];
  if (!validStatuses.includes(claim.status as ClaimStatus)) return null;

  const isTransferring = claim.status === ClaimStatus.AWAITING_TRANSFER || claim.status === ClaimStatus.IN_TRANSIT;

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
       {isTransferring ? (
          <Card className="border-2 border-indigo-100 bg-indigo-50/30 p-8 text-center sm:text-left">
             <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="flex-1">
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Item En Route</h2>
                   <p className="text-indigo-800 font-medium leading-relaxed">
                     Your claim has been verified, but the item is currently located at a different branch. 
                     We are transferring it to your preferred pickup location. You will be able to schedule a pickup 
                     as soon as it arrives!
                   </p>
                </div>
             </div>
          </Card>
       ) : claim.paymentStatus === 'PAID' ? (
          <PickupScheduler claimId={claim._id || ''} onScheduled={() => navigate('/pickups')} />
       ) : (
          <Card className="border-2 border-blue-100 bg-blue-50/30 p-8 text-center sm:text-left">
             <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="flex-1">
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Verified!</h2>
                   <p className="text-blue-800 font-medium leading-relaxed">
                     Your claim has been approved. Please complete the recovery fee payment to schedule your item pickup.
                   </p>
                </div>
             </div>
             
             <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                <FeeBreakdownComponent breakdown={feeBreakdown} isLoading={loadingFee} />
                <div className="mt-6 flex justify-end">
                   <Button 
                     onClick={handlePayClick} 
                     disabled={!feeBreakdown || isPayLoading} 
                     isLoading={isPayLoading}
                     className="px-10 h-12 rounded-xl shadow-lg shadow-blue-200"
                   >
                      Proceed to Secure Payment
                   </Button>
                </div>
             </div>
          </Card>
       )}
    </motion.div>
  );
};

export default ClaimVerificationActions;
