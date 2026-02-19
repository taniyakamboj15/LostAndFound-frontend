import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '@components/ui/BackButton';
import { 
  CheckCircle,
  XCircle,
  Upload,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Card, Badge, Button, Modal, Textarea, Spinner } from '@components/ui';
import { ClaimStatus, CLAIM_STATUS_LABELS } from '@constants/status';
import FeeBreakdown from '@components/payment/FeeBreakdown';
import PaymentModal from '@components/payment/PaymentModal';

import { formatRelativeTime } from '@utils/formatters';
import { useAuth } from '@hooks/useAuth';
import { useClaimActions } from '@hooks/useClaimActions';
import { useClaimPayment } from '@hooks/useClaimPayment';
import { ComponentErrorBoundary } from '@components/feedback';
import PickupScheduler from '@components/claims/PickupScheduler';
import { User } from '../types';

// Components
import ClaimPhotos from '@components/claims/ClaimPhotos';
import ClaimTimeline from '@components/claims/ClaimTimeline';
import ClaimSidebar from '@components/claims/ClaimSidebar';

const ClaimDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, isStaff } = useAuth();
  
  const { 
    claim, 
    isLoading: loading, 
    handleVerify, 
    handleReject, 
    isSubmitting,
    isRejectModalOpen,
    openRejectModal,
    closeRejectModal,
    rejectionReason,
    setRejectionReason,
    refresh
  } = useClaimActions(id || null);

  const claimantId = claim ? (typeof claim.claimantId === 'object' ? (claim.claimantId as User)._id : claim.claimantId) : null;
  const isClaimant = !!(user && claimantId && (user._id === claimantId || user.id === claimantId));

  const {
    feeBreakdown,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    clientSecret,
    loadingFee,
    isPayLoading,
    handlePayClick,
    handlePaymentSuccess
  } = useClaimPayment(claim, isClaimant, refresh);

  const getStatusBadgeVariant = (status: ClaimStatus) => {
    if (status === ClaimStatus.VERIFIED) return 'success';
    if (status === ClaimStatus.REJECTED) return 'danger';
    if (status === ClaimStatus.IDENTITY_PROOF_REQUESTED) return 'warning';
    if (status === ClaimStatus.PICKUP_BOOKED || status === ClaimStatus.RETURNED) return 'info';
    return 'default';
  };

  if (loading || !claim) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-gray-400 font-medium animate-pulse">Retrieving claim details...</p>
      </div>
    );
  }

  return (
    <ComponentErrorBoundary title="Claim Detail Error">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 max-w-7xl mx-auto px-4 py-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <BackButton label="Back to Claims list" />
           
           <div className="flex items-center gap-3">
              {/* Actions (Staff/Admin only) */}
              {(isAdmin() || isStaff()) && claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={openRejectModal}
                    disabled={isSubmitting}
                    className="h-11 rounded-xl"
                  >
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleVerify}
                    isLoading={isSubmitting}
                    className="h-11 rounded-xl shadow-lg shadow-blue-100"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve Claim
                  </Button>
                </div>
              )}

              {/* Actions (Claimant only) */}
              {isClaimant && claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED && (
                <Link to={`/claims/${claim._id}/proof`}>
                  <Button variant="primary" className="h-11 rounded-xl shadow-lg shadow-blue-100">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload More Proof
                  </Button>
                </Link>
              )}
           </div>
        </div>

        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <ShieldCheck className="h-32 w-32" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={getStatusBadgeVariant(claim.status)} className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                  {CLAIM_STATUS_LABELS[claim.status as ClaimStatus]}
                </Badge>
                {isClaimant && (
                   <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-blue-100">
                     <ShieldCheck className="h-3 w-3" />
                     Your Claim
                   </span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {claim.itemId.description}
                </h1>
                <div className="flex items-center gap-4 mt-3 text-gray-400 font-medium">
                   <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>Filed {formatRelativeTime(claim.filedAt || claim.createdAt)}</span>
                   </div>
                   <div className="h-1 w-1 rounded-full bg-gray-300" />
                   <span className="text-gray-900 font-bold">Ref: #{claim._id}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photos & Evidence */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <h2 className="text-xl font-bold text-gray-900">Visual Evidence</h2>
                 <div className="h-px flex-1 bg-gray-100 ml-2" />
              </div>
              <ClaimPhotos 
                itemPhotos={claim.itemId.photos} 
                proofDocuments={claim.proofDocuments} 
              />
            </section>

            {/* Description Card */}
            <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
              <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <AlertTriangle className="h-5 w-5 text-amber-500" />
                   Claimant Statement
                 </h3>
              </div>
              <div className="p-6">
                 <p className="text-gray-700 leading-relaxed italic">
                   "{claim.description || 'No statement provided.'}"
                 </p>
              </div>
            </Card>

            {/* Pickup/Payment Integration */}
            {claim.status === ClaimStatus.VERIFIED && isClaimant && (
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
               >
                  {claim.paymentStatus === 'PAID' ? (
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
                           <FeeBreakdown breakdown={feeBreakdown} isLoading={loadingFee} />
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
            )}

            {/* Timeline */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <h2 className="text-xl font-bold text-gray-900">Processing Timeline</h2>
                 <div className="h-px flex-1 bg-gray-100 ml-2" />
              </div>
              <ClaimTimeline timeline={claim.timeline} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <ClaimSidebar claim={claim} showAdminActions={isAdmin() || isStaff()} />
            
            {/* Help/Support Box */}
            <Card className="bg-gray-900 text-white p-6 border-none rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="h-20 w-20" />
               </div>
               <h4 className="font-bold text-lg mb-2 relative z-10">Verification Security</h4>
               <p className="text-gray-400 text-xs leading-relaxed mb-4 relative z-10">
                 Our staff manually verifies all claims against security footage and internal reports to ensure zero-risk item handovers.
               </p>
               <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0 h-auto text-xs font-bold">
                 Learn about our process →
               </Button>
            </Card>
          </div>
        </div>

        {/* Reject Modal */}
        <Modal
          isOpen={isRejectModalOpen}
          onClose={closeRejectModal}
          title="Reject Claim"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600 font-medium">
              Please provide a clear reason for rejecting this claim. This explanation will be shared with the claimant.
            </p>
            <Textarea
              label="Rejection Reason"
              placeholder="e.g. Identity proof doesn't match, or incorrect item description..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              fullWidth
              required
              rows={4}
              className="rounded-xl border-gray-100 focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                variant="outline"
                onClick={closeRejectModal}
                disabled={isSubmitting}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                isLoading={isSubmitting}
                className="rounded-xl shadow-lg shadow-red-100"
              >
                Reject Claim
              </Button>
            </div>
          </div>
        </Modal>

        {/* Payment Modal */}
        {feeBreakdown && clientSecret && (
          <PaymentModal 
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            clientSecret={clientSecret}
            breakdown={feeBreakdown}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </motion.div>
    </ComponentErrorBoundary>
  );
};

export default ClaimDetail;
