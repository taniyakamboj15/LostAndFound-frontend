import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '@components/ui/BackButton';
import { 
  CheckCircle,
  XCircle,
  Upload,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Truck,
  Package,
  CheckCircle2
} from 'lucide-react';
import { Card, Badge, Button, Modal, Textarea, Spinner } from '@components/ui';
import { ClaimStatus, CLAIM_STATUS_LABELS } from '@constants/status';
import FeeBreakdown from '@components/payment/FeeBreakdown';
import PaymentModal from '@components/payment/PaymentModal';
import { formatRelativeTime } from '@utils/formatters';
import { ComponentErrorBoundary } from '@components/feedback';
import PickupScheduler from '@components/claims/PickupScheduler';
import { format } from 'date-fns';

// Hooks
import { useClaimDetailPage } from '@hooks/useClaimDetailPage';

// Utilities
import { getClaimStatusVariant, getTransferStatusVariant } from '@utils/ui';

// Components
import ClaimPhotos from '@components/claims/ClaimPhotos';
import ClaimTimeline from '@components/claims/ClaimTimeline';
import ClaimSidebar from '@components/claims/ClaimSidebar';

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
    openRejectModal
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
              {(isAdmin || isStaff) && claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED && (
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
                <Badge variant={getClaimStatusVariant(claim.status)} className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                  {CLAIM_STATUS_LABELS[claim.status]}
                </Badge>
                {isClaimant && (
                   <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-blue-100">
                     <ShieldCheck className="h-3 w-3" />
                     Your Claim
                   </span>
                )}
                {/* Fraud risk badge for Staff/Admin */}
                {(isAdmin || isStaff) && (claim.fraudRiskScore || 0) > 0 && (
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
                      (claim.fraudRiskScore || 0) >= 70
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <ShieldAlert className="h-3 w-3" />
                    Risk: {claim.fraudRiskScore}/100
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
            
            {/* Structured Item Details in Hero */}
            <div className="flex flex-wrap gap-3 mt-4">
               {claim.itemId.brand && <Badge variant="default" className="bg-gray-100 text-gray-600 border border-gray-200">Brand: {claim.itemId.brand}</Badge>}
               {claim.itemId.color && <Badge variant="default" className="bg-gray-100 text-gray-600 border border-gray-200">Color: {claim.itemId.color}</Badge>}
               {claim.itemId.itemSize && <Badge variant="default" className="bg-gray-100 text-gray-600 border border-gray-200">Size: {claim.itemId.itemSize}</Badge>}
            </div>
          </div>
        </motion.div>

        {/* Privacy Redaction Banner for Claimants */}
        {!(isAdmin || isStaff) && claim.status !== ClaimStatus.VERIFIED && claim.status !== ClaimStatus.PICKUP_BOOKED && claim.status !== ClaimStatus.RETURNED && claim.status !== ClaimStatus.AWAITING_TRANSFER && claim.status !== ClaimStatus.AWAITING_RECOVERY && claim.status !== ClaimStatus.IN_TRANSIT && claim.status !== ClaimStatus.ARRIVED && (
          <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl flex items-start gap-3 shadow-md border border-slate-700">
             <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-sm mb-1">Privacy Protection Active</h4>
                <p className="text-xs text-slate-300">
                  Because this claim is pending verification, some specific details of the found item (like brand, serial numbers, and contents) are hidden. This prevents fraudulent actors from learning about item specifics from the public portal. 
                </p>
             </div>
          </div>
        )}

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
            {(claim.status === ClaimStatus.AWAITING_TRANSFER || 
              claim.status === ClaimStatus.AWAITING_RECOVERY ||
              claim.status === ClaimStatus.IN_TRANSIT || 
              claim.status === ClaimStatus.ARRIVED) && transfer && (
              <Card className="border-blue-100 bg-blue-50/30 p-6 rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Truck className="h-32 w-32" />
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-blue-100 rounded-2xl">
                      <Truck className="h-6 w-6 text-blue-600" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {claim.status === ClaimStatus.AWAITING_RECOVERY ? 'Recovery Attempt' : 'Transfer in Progress'}
                      </h3>
                       <p className="text-sm text-gray-500 font-medium">
                        {claim.status === ClaimStatus.AWAITING_RECOVERY 
                          ? 'Staff are locating your item in our archive' 
                          : `Moving item to ${toStorage?.city || 'your selected location'}`}
                      </p>
                   </div>
                </div>

                <div className="relative mb-10 px-2">
                   {/* Track Line */}
                   <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 rounded-full" />
                   <div 
                      className="absolute top-5 left-8 h-1 bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                      style={{ 
                        width: claim.status === ClaimStatus.ARRIVED ? 'calc(100% - 64px)' : 
                               claim.status === ClaimStatus.IN_TRANSIT ? '50%' : '0%' 
                      }} 
                   />

                   <div className="flex justify-between items-start relative px-1">
                      <div className="flex flex-col items-center">
                         <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                            claim.status === ClaimStatus.AWAITING_RECOVERY ? 'bg-amber-400 animate-pulse' :
                            claim.status !== ClaimStatus.AWAITING_TRANSFER ? 'bg-blue-600' : 'bg-amber-400'
                         }`}>
                            <Package className="h-5 w-5 text-white" />
                         </div>
                         <div className="mt-3 text-center">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Step 1</p>
                            <p className="text-xs font-bold text-gray-900">
                              {claim.status === ClaimStatus.AWAITING_RECOVERY ? 'Recovering' : 'Preparing'}
                            </p>
                         </div>
                      </div>

                      <div className="flex flex-col items-center">
                         <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm transition-all ${
                            claim.status === ClaimStatus.IN_TRANSIT ? 'bg-blue-600 animate-pulse scale-110 shadow-lg' : 
                            claim.status === ClaimStatus.ARRIVED ? 'bg-blue-600' : 'bg-white text-gray-300'
                         }`}>
                            <Truck className={`h-5 w-5 ${claim.status === ClaimStatus.AWAITING_TRANSFER || claim.status === ClaimStatus.AWAITING_RECOVERY ? 'text-gray-200' : 'text-white'}`} />
                         </div>
                         <div className="mt-3 text-center">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Step 2</p>
                            <p className="text-xs font-bold text-gray-900">In Transit</p>
                         </div>
                      </div>

                      <div className="flex flex-col items-center">
                         <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                            claim.status === ClaimStatus.ARRIVED ? 'bg-emerald-500' : 'bg-white'
                         }`}>
                            <CheckCircle2 className={`h-5 w-5 ${claim.status === ClaimStatus.ARRIVED ? 'text-white' : 'text-gray-200'}`} />
                         </div>
                         <div className="mt-3 text-center">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Step 3</p>
                            <p className="text-xs font-bold text-gray-900">Arrived</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8 p-5 bg-white/60 rounded-2xl border border-white">
                   <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Destination</p>
                       <p className="text-sm font-bold text-gray-900 leading-tight">
                        {toStorage?.name || 'Local Archive'}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {toStorage?.city || 'Selected Branch'}
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 text-right">Carrier Info</p>
                      <p className="text-sm font-bold text-blue-600">
                        {transfer.carrierInfo || (claim.status === ClaimStatus.AWAITING_TRANSFER ? 'Awaiting Dispatch' : 'Internal Logistics')}
                      </p>
                      {transfer.estimatedArrival && (
                        <p className="text-xs text-gray-500 font-bold mt-1">
                          Est. {format(new Date(transfer.estimatedArrival), 'MMM d, p')}
                        </p>
                      )}
                   </div>
                </div>
              </Card>
            )}
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
            {(isAdmin || isStaff) && claim.lostReportId && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <h2 className="text-xl font-bold text-gray-900">Attribute Comparison</h2>
                   <div className="h-px flex-1 bg-gray-100 ml-2" />
                </div>
                <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {/* Found Item Column */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="info" className="text-[10px] font-bold">Found Item</Badge>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Brand</p>
                          <p className={`font-bold ${typeof claim.lostReportId === 'object' && claim.itemId.brand?.toLowerCase() === claim.lostReportId.brand?.toLowerCase() ? 'text-green-600' : 'text-gray-900'}`}>
                            {claim.itemId.brand || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Color</p>
                          <p className={`font-bold ${typeof claim.lostReportId === 'object' && claim.itemId.color?.toLowerCase() === claim.lostReportId.color?.toLowerCase() ? 'text-green-600' : 'text-gray-900'}`}>
                            {claim.itemId.color || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Size</p>
                          <p className={`font-bold ${typeof claim.lostReportId === 'object' && claim.itemId.itemSize === claim.lostReportId.itemSize ? 'text-green-600' : 'text-gray-900'}`}>
                            {claim.itemId.itemSize || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lost Report Column */}
                    <div className="p-6 bg-blue-50/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="warning" className="text-[10px] font-bold">Lost Report</Badge>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Brand</p>
                          <p className="font-bold text-gray-900">{typeof claim.lostReportId === 'object' ? claim.lostReportId.brand : 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Color</p>
                          <p className="font-bold text-gray-900">{typeof claim.lostReportId === 'object' ? claim.lostReportId.color : 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Size</p>
                          <p className="font-bold text-gray-900">{typeof claim.lostReportId === 'object' ? claim.lostReportId.itemSize : 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {typeof claim.lostReportId === 'object' && claim.lostReportId.bagContents && claim.lostReportId.bagContents.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-amber-50/30">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Claimant's Reported Bag Contents</p>
                      <div className="flex flex-wrap gap-2">
                        {claim.lostReportId.bagContents.map((content, idx) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-600 border border-amber-100">
                            {content}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-amber-500 mt-2 font-medium italic">Verify these against the physical item if possible.</p>
                    </div>
                  )}
                </Card>
              </section>
            )}

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
            {(claim.status === ClaimStatus.VERIFIED || claim.status === ClaimStatus.ARRIVED) && isClaimant && (
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

            {/* In-Transit Message for Paid Claims */}
            {isClaimant && 
             claim.paymentStatus === 'PAID' && 
             (claim.status === ClaimStatus.AWAITING_TRANSFER || claim.status === ClaimStatus.IN_TRANSIT) && (
              <Card className="border border-blue-100 bg-blue-50/50 p-6 rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Payment Confirmed</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your recovery fee has been received. We are currently transporting your item to the pickup point. 
                      <strong> You will be able to book your pickup slot as soon as the item arrives.</strong>
                    </p>
                    {transfer?.estimatedArrival && (
                      <div className="mt-3 flex items-center gap-2 text-blue-700 font-bold text-xs bg-white/60 w-fit px-3 py-1.5 rounded-full border border-blue-100">
                        <Truck className="h-3.5 w-3.5" />
                        Estimated Availability: {format(new Date(transfer.estimatedArrival), 'EEEE, MMM do')}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Challenge-Response Verification (Staff/Admin only) */}
            {(isAdmin || isStaff) && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Challenge-Response Verification</h2>
                  <div className="h-px flex-1 bg-gray-100 ml-2" />
                  <Button size="sm" variant="outline" onClick={() => setIsChallengeOpen(!isChallengeOpen)}>
                    {isChallengeOpen ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
                {isChallengeOpen && (
                  <Card className="p-6 space-y-4 bg-slate-50">
                    <p className="text-sm text-slate-600">Ask the claimant a question whose answer only the true owner would know (e.g., a hidden serial number or a specific detail about the item). They will receive a notification and can answer it from their claim view.</p>
                    
                    {/* Display Item's secretIdentifiers */}
                    {claim.itemId.secretIdentifiers && claim.itemId.secretIdentifiers.length > 0 && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <h4 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                          <ShieldAlert className="h-4 w-4" /> Secret Identifiers
                        </h4>
                        <ul className="list-disc pl-5 text-xs text-amber-700">
                          {claim.itemId.secretIdentifiers.map((secret, i) => (
                            <li key={i}>{secret}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Question asked</label>
                      <input
                        type="text"
                        value={challengeQuestion}
                        onChange={e => setChallengeQuestion(e.target.value)}
                        placeholder="e.g. What is the serial number on the back of the laptop?"
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSubmitChallengeQuestion}
                      disabled={challengeLoadingId === 'new' || !challengeQuestion.trim()}
                    >
                      {challengeLoadingId === 'new' ? 'Sending…' : 'Send Challenge'}
                    </Button>
                    
                    {/* Previous challenge history */}
                    {claim.challengeHistory && claim.challengeHistory.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-slate-500 mb-2">Challenge History</p>
                        {claim.challengeHistory.map((c, i) => (
                          <div key={c._id || i} className={`text-sm p-3 mb-2 rounded-lg border ${
                            c.passed === true ? 'bg-green-50 border-green-200' :
                            c.passed === false ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                          }`}>
                            <p className="font-medium text-gray-800">Q: {c.question}</p>
                            {c.answer ? (
                              <div className="mt-1">
                                <p className="text-gray-600">A: {c.answer}</p>
                                <p className={`text-xs mt-1 font-semibold ${c.passed ? 'text-green-700' : 'text-red-700'}`}>
                                  Score: {c.matchScore}/100 — {c.passed ? 'Passed ✓' : 'Failed ✗'}
                                </p>
                              </div>
                            ) : (
                              <p className="mt-1 text-xs text-amber-600 font-medium italic">Waiting for claimant to answer...</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}
              </section>
            )}

            {/* Challenge-Response Action (Claimant only) */}
            {isClaimant && claim.challengeHistory?.some((c) => !c.answer) && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                     <AlertTriangle className="h-5 w-5 text-amber-500" />
                     Action Required: Answer Challenge
                   </h2>
                   <div className="h-px flex-1 bg-gray-100 ml-2" />
                </div>
                <Card className="p-6 space-y-4 border-2 border-amber-200 bg-amber-50">
                  <p className="text-sm text-slate-700 font-medium">Please answer the following security question(s) to verify your claim.</p>
                  {claim.challengeHistory.filter(c => !c.answer).map((c) => (
                    <div key={c._id} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                      <p className="font-bold text-gray-900 mb-2">Question: {c.question}</p>
                      <input
                        type="text"
                        value={challengeAnswers[c._id] || ''}
                        onChange={e => setChallengeAnswers(prev => ({ ...prev, [c._id]: e.target.value }))}
                        placeholder="Type your answer here..."
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-3 bg-amber-500 hover:bg-amber-600 border-none w-full"
                        onClick={() => handleSubmitChallengeAnswer(c._id)}
                        disabled={challengeLoadingId === c._id || !(challengeAnswers[c._id]?.trim())}
                      >
                        {challengeLoadingId === c._id ? 'Submitting…' : 'Submit Answer'}
                      </Button>
                    </div>
                  ))}
                </Card>
              </section>
            )}

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
               /* Transfer Management Tab */
               <section className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                            <Badge variant={getTransferStatusVariant(transfer?.status || '')}>
                                {(transfer?.status || 'PENDING').replace('_', ' ')}
                            </Badge>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Route</p>
                            <p className="font-bold text-gray-900 text-sm">{fromStorage?.name || 'Local'} → {toStorage?.name || 'Local'}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                        <p className="font-medium text-blue-800 text-sm mb-4">
                            Update the transfer status to automatically notify the claimant and handle inventory routing.
                        </p>

                        {transfer?.status === 'RECOVERY_REQUIRED' && (
                            <Button className="w-full h-12 rounded-xl text-md" variant="primary" onClick={() => window.open('/admin/transfers', '_blank')}>
                                Go to Main Transfer Board
                            </Button>
                        )}
                        {transfer?.status === 'PENDING' && (
                             <Button className="w-full h-12 rounded-xl text-md" variant="primary" onClick={() => window.open('/admin/transfers', '_blank')}>
                                Go to Main Transfer Board (Dispatch)
                             </Button>
                        )}
                        {transfer?.status === 'IN_TRANSIT' && (
                             <Button className="w-full h-12 rounded-xl text-md" variant="primary" onClick={() => window.open('/admin/transfers', '_blank')}>
                                Go to Main Transfer Board (Receive)
                             </Button>
                        )}
                        {transfer?.status === 'ARRIVED' && (
                            <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl">
                                <CheckCircle2 className="h-5 w-5" /> Transfer Complete
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-4 text-center">
                            Full controls including carrier updates and notes are available in the dedicated Transfer Dashboard.
                        </p>
                    </div>
               </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <ClaimSidebar claim={claim} showAdminActions={isAdmin || isStaff} />

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
