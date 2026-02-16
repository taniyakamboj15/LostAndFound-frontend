import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft,
  User as UserIcon,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  MapPin
} from 'lucide-react';
import { Card, Badge, Button, Modal, Textarea, Spinner } from '@components/ui';
import { ClaimStatus, CLAIM_STATUS_LABELS } from '@constants/status';
import { formatDate, formatRelativeTime } from '@utils/formatters';
import { useAuth } from '@hooks/useAuth';
import { useClaimActions } from '@hooks/useClaimActions';
import { ComponentErrorBoundary } from '@components/feedback';
import PickupScheduler from '@components/claims/PickupScheduler';
import { API_BASE_URL } from '../constants/api';
import { UploadedFile, ProofDocument, User } from '../types';

interface TimelineEvent {
  action: string;
  actor: string;
  timestamp: string;
}

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
    setRejectionReason
  } = useClaimActions(id || null);

  const getStatusBadgeVariant = (status: ClaimStatus) => {
    if (status === ClaimStatus.VERIFIED) return 'success';
    if (status === ClaimStatus.REJECTED) return 'danger';
    if (status === ClaimStatus.IDENTITY_PROOF_REQUESTED) return 'warning';
    if (status === ClaimStatus.PICKUP_BOOKED || status === ClaimStatus.RETURNED) return 'info';
    return 'default';
  };

  if (loading || !claim) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const claimantId = typeof claim.claimantId === 'object' ? (claim.claimantId as User)._id : claim.claimantId;
  const isClaimant = user?._id === claimantId || user?.id === claimantId;

  console.log('ClaimDetail Debug:', {
    claimStatus: claim.status,
    userId: user?._id,
    userAltId: user?.id,
    claimantId: claimantId,
    isClaimant,
    match_id: user?._id === claimantId,
    match_id_alt: user?.id === claimantId
  });

  return (
    <ComponentErrorBoundary title="Claim Detail Error">
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/claims">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Claims
          </Button>
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={getStatusBadgeVariant(claim.status)}>
                {CLAIM_STATUS_LABELS[claim.status as ClaimStatus]}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Claim #{claim._id}
            </h1>
            <p className="text-gray-600 mt-1">
              Filed {formatRelativeTime(claim.filedAt || claim.createdAt)}
            </p>
            {isClaimant && (
              <div className="mt-2">
                <Badge variant="info">Claimed by You</Badge>
              </div>
            )}
          </div>

          {/* Actions (Staff/Admin only) */}
          {(isAdmin() || isStaff()) && claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={openRejectModal}
                disabled={isSubmitting}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Reject
              </Button>
              <Button
                variant="primary"
                onClick={handleVerify}
                isLoading={isSubmitting}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Verify Claim
              </Button>
            </div>
          )}

          {/* Actions (Claimant only) */}
          {isClaimant && 
            claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED && (
            <Link to={`/claims/${claim._id}/proof`}>
              <Button variant="primary">
                <Upload className="h-5 w-5 mr-2" />
                Upload Supplemental Proof
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Information and Photos for Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Found Item Photos
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {claim.itemId.photos.map((photo: UploadedFile, index: number) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img 
                        src={photo.path.startsWith('http') ? photo.path : `${API_BASE_URL}/${photo.path}`} 
                        alt={`Found item ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {claim.itemId.photos.length === 0 && (
                    <div className="col-span-2 py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                      No photos available
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ownership Proof Photos
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {claim.proofDocuments
                    .filter((doc: ProofDocument) => doc.filename.match(/\.(jpg|jpeg|png|gif)$/i))
                    .map((doc: ProofDocument, index: number) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img 
                          src={doc.path.startsWith('http') ? doc.path : `${API_BASE_URL}/${doc.path}`} 
                          alt={`Proof ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  {claim.proofDocuments.filter((doc: ProofDocument) => doc.filename.match(/\.(jpg|jpeg|png|gif)$/i)).length === 0 && (
                    <div className="col-span-2 py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                      No proof images available
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Claim Identification Statement */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Statement of Ownership
              </h2>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="text-gray-900 whitespace-pre-wrap">{claim.description || 'No description provided.'}</p>
              </div>
            </Card>

            {/* Item Details */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Full Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Item Description</p>
                  <p className="text-gray-900">{claim.itemId.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Category</p>
                    <p className="text-gray-900">{claim.itemId.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date Found</p>
                    <p className="text-gray-900">{formatDate(claim.itemId.dateFound)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* All Documents List */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                All Documents ({claim.proofDocuments.length})
              </h2>
              {claim.proofDocuments.length > 0 ? (
                <div className="space-y-3">
                  {claim.proofDocuments.map((doc: ProofDocument) => (
                    <div
                      key={doc.path}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.type} • Uploaded {formatRelativeTime(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={doc.path.startsWith('http') ? doc.path : `${API_BASE_URL}/${doc.path}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          View Original
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No documents uploaded yet</p>
                </div>
              )}
            </Card>

            {/* Pickup Scheduling (Claimant only, when verified) */}
            {claim.status === ClaimStatus.VERIFIED && isClaimant && (
               <div className="mt-6">
                  <PickupScheduler claimId={claim._id || ''} onScheduled={() => navigate('/claims')} />
               </div>
            )}

            {/* Timeline */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Timeline
              </h2>
              <div className="space-y-4">
                {claim.timeline?.map((event: TimelineEvent, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full" />
                      {index < (claim.timeline?.length || 0) - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900">{event.action}</p>
                      <p className="text-sm text-gray-600">
                        by {event.actor} • {formatRelativeTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Claimant Information */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Claimant Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-sm text-gray-900">{(claim.claimantId as User).name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">{(claim.claimantId as User).email}</p>
                  </div>
                </div>
                {(claim.claimantId as User).phone && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-sm text-gray-900">{(claim.claimantId as User).phone}</p>
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
                  <p className="text-sm font-medium text-blue-900">
                    Current Status
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {claim.status === ClaimStatus.IDENTITY_PROOF_REQUESTED &&
                      'Waiting for staff verification of proof documents'}
                    {claim.status === ClaimStatus.VERIFIED &&
                      'Claim verified. Claimant can now book a pickup.'}
                    {claim.status === ClaimStatus.FILED &&
                      'Claim filed. Awaiting initial review.'}
                    {claim.status === ClaimStatus.PICKUP_BOOKED &&
                      'Pickup scheduled. Please visit the storage location at the scheduled time.'}
                    {claim.status === ClaimStatus.RETURNED &&
                      'Item has been returned to the claimant. Case closed.'}
                    {claim.status === ClaimStatus.REJECTED &&
                      `Claim rejected. Reason: ${claim.rejectionReason || 'No reason provided.'}`}
                  </p>
                </div>
              </div>
            </Card>

            {/* Storage/Owner Information (Verified only) */}
            {claim.status === ClaimStatus.VERIFIED && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Pickup Location
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-900">
                        {claim.itemId?.storageLocation?.name || 'Main Storage'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {claim.itemId?.storageLocation?.location || 'Central Office'}
                      </p>
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
            <p className="text-gray-600">
              Please provide a reason for rejecting this claim. This will be sent to the claimant.
            </p>
            <Textarea
              label="Rejection Reason"
              placeholder="Explain why this claim is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              fullWidth
              required
              rows={4}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={closeRejectModal}
                fullWidth
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                fullWidth
                isLoading={isSubmitting}
              >
                Reject Claim
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ComponentErrorBoundary>
  );
};

export default ClaimDetail;
