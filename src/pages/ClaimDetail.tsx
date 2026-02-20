import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '@components/ui/BackButton';
import { 
  CheckCircle,
  XCircle,
  Upload,
  Clock,
  ShieldCheck,
  Truck,
  Trash2
} from 'lucide-react';
import { Button, Modal, Textarea, Spinner } from '@components/ui';
import { ClaimStatus } from '@constants/status';
import PaymentModal from '@components/payment/PaymentModal';
import { ComponentErrorBoundary } from '@components/feedback';

// Hooks
import { useClaimDetailPage } from '@hooks/useClaimDetailPage';

// Components
import ClaimPhotos from '@components/claims/ClaimPhotos';
import ClaimTimeline from '@components/claims/ClaimTimeline';
import ClaimSidebar from '@components/claims/ClaimSidebar';

// Sub-components
import ClaimDetailHero from '@components/claims/detail/ClaimDetailHero';
import ClaimPrivacyBanner from '@components/claims/detail/ClaimPrivacyBanner';
import ClaimTransferTracking from '@components/claims/detail/ClaimTransferTracking';
import ClaimAttributeComparison from '@components/claims/detail/ClaimAttributeComparison';
import ClaimantStatement from '@components/claims/detail/ClaimantStatement';
import ClaimVerificationActions from '@components/claims/detail/ClaimVerificationActions';
import ClaimChallengeVerification from '@components/claims/detail/ClaimChallengeVerification';
import ClaimAnswerChallenge from '@components/claims/detail/ClaimAnswerChallenge';
import ClaimTransferManagement from '@components/claims/detail/ClaimTransferManagement';

const ClaimDetail = () => {
  const {
    navigate,
    isAdmin,
    isStaff,
    claim,
    loading,
    handleVerify,
    handleReject,
    isSubmitting,
    isRejectModalOpen,
    closeRejectModal,
    rejectionReason,
    setRejectionReason,
    challengeQuestion,
    setChallengeQuestion,
    challengeAnswers,
    setChallengeAnswers,
    challengeLoadingId,
    isChallengeOpen,
    setIsChallengeOpen,
    activeTab,
    setActiveTab,
    handleSubmitChallengeQuestion,
    handleSubmitChallengeAnswer,
    isClaimant,
    feeBreakdown,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    clientSecret,
    loadingFee,
    isPayLoading,
    handlePayClick,
    handlePaymentSuccess,
    transfer,
    toStorage,
    fromStorage,
    openRejectModal,
    handleRequestProof,
    handleDelete
  } = useClaimDetailPage();


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
              {(isAdmin || isStaff) && (claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED || claim.status === ClaimStatus.FILED) && (
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
                  {claim.status === ClaimStatus.FILED && (
                    <Button
                      variant="outline"
                      onClick={handleRequestProof}
                      disabled={isSubmitting}
                      className="h-11 rounded-xl"
                    >
                      <Upload className="h-5 w-5 mr-2 text-yellow-500" />
                      Request Proof
                    </Button>
                  )}
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
              {isClaimant && (claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED || claim.status === ClaimStatus.FILED) && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this claim? This action cannot be undone.')) {
                        await handleDelete();
                        navigate('/claims');
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Claim
                  </Button>
                  <Link to={`/claims/${claim._id}/proof`}>
                    <Button variant="primary" className="h-11 rounded-xl shadow-lg shadow-blue-100">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload More Proof
                    </Button>
                  </Link>
                </div>
              )}
           </div>
        </div>

        {/* Hero Header */}
        <ClaimDetailHero 
          claim={claim} 
          isAdmin={isAdmin} 
          isStaff={isStaff} 
          isClaimant={isClaimant} 
        />

        {/* Privacy Redaction Banner for Claimants */}
        <ClaimPrivacyBanner 
          status={claim.status} 
          isAdmin={isAdmin} 
          isStaff={isStaff} 
        />

        {/* Multi-Tab Navigation for Staff/Admin */}
        {(isAdmin || isStaff) && transfer && (
          <div className="flex bg-gray-50 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('DETAILS')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'DETAILS'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Claim Details
            </button>
            <button
              onClick={() => setActiveTab('TRANSFER')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'TRANSFER'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Truck className="h-4 w-4" />
              Manage Transfer
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'DETAILS' ? (
              <>
            
            {/* Transfer Tracking */}
            <ClaimTransferTracking 
              status={claim.status} 
              transfer={transfer} 
              toStorage={toStorage} 
            />

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

            {/* Matcher Comparison (Staff/Admin only) */}
            {(isAdmin || isStaff) && (
              <ClaimAttributeComparison claim={claim} />
            )}

            {/* Description Card */}
            <ClaimantStatement description={claim.description} />

            {/* Pickup/Payment Integration */}
            <ClaimVerificationActions 
              claim={claim}
              isClaimant={isClaimant}
              feeBreakdown={feeBreakdown}
              loadingFee={loadingFee}
              isPayLoading={isPayLoading}
              handlePayClick={handlePayClick}
              navigate={navigate}
            />

            {/* In-Transit Message for Paid Claims */}
            {isClaimant && 
             claim.paymentStatus === 'PAID' && 
             (claim.status === ClaimStatus.AWAITING_TRANSFER || claim.status === ClaimStatus.IN_TRANSIT) && (
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Payment Confirmed</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your recovery fee has been received. We are currently transporting your item to the pickup point. 
                      <strong> You will be able to book your pickup slot as soon as the item arrives.</strong>
                    </p>
                  </div>
              </div>
            )}

            {/* Challenge-Response Verification (Staff/Admin only) */}
            <ClaimChallengeVerification 
              claim={claim}
              isAdmin={isAdmin}
              isStaff={isStaff}
              isChallengeOpen={isChallengeOpen}
              setIsChallengeOpen={setIsChallengeOpen}
              challengeQuestion={challengeQuestion}
              setChallengeQuestion={setChallengeQuestion}
              handleSubmitChallengeQuestion={handleSubmitChallengeQuestion}
              challengeLoadingId={challengeLoadingId}
            />

            {/* Challenge-Response Action (Claimant only) */}
            <ClaimAnswerChallenge 
              claim={claim}
              isClaimant={isClaimant}
              challengeAnswers={challengeAnswers}
              setChallengeAnswers={setChallengeAnswers}
              handleSubmitChallengeAnswer={handleSubmitChallengeAnswer}
              challengeLoadingId={challengeLoadingId}
            />

            {/* Timeline */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <h2 className="text-xl font-bold text-gray-900">Processing Timeline</h2>
                 <div className="h-px flex-1 bg-gray-100 ml-2" />
              </div>
              <ClaimTimeline timeline={claim.timeline} />
            </section>
            
            </>
            ) : (
              <ClaimTransferManagement 
                activeTab={activeTab} 
                transfer={transfer} 
                fromStorage={fromStorage} 
                toStorage={toStorage} 
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <ClaimSidebar claim={claim} showAdminActions={isAdmin || isStaff} />

            {/* Help/Support Box */}
            <div className="bg-gray-900 text-white p-6 rounded-3xl relative overflow-hidden">
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
            </div>
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
