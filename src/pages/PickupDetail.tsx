import { useParams,  Link } from 'react-router-dom';
import { 
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Package,
  CheckCircle,
  Mail,
  Phone,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { Card, Badge, Button, Spinner } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { useAuth } from '@hooks/useAuth';
import { usePickupActions } from '@hooks/usePickupActions';
import { usePickupVerification } from '@hooks/usePickupVerification';
import ScanPickupModal from '@components/claims/ScanPickupModal';
import { ComponentErrorBoundary } from '@components/feedback';

const PickupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { canAccessStaffRoutes } = useAuth();

  const { pickup, isLoading, isCompleting, error, handleCompletePickup } = usePickupActions(id);
  const { 
    isScanModalOpen, 
    openScanModal, 
    closeScanModal, 
    handleVerifySuccess 
  } = usePickupVerification(() => window.location.reload());

  const STATUS_BADGE_MAP = {
    true: { variant: 'success' as const, label: 'Completed' },
    false: { variant: 'info' as const, label: 'Scheduled' }
  };

  const statusBadge = pickup ? STATUS_BADGE_MAP[String(pickup.isCompleted) as keyof typeof STATUS_BADGE_MAP] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !pickup || !statusBadge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'Pickup not found'}
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          We couldn't retrieve the details for this pickup. It might have been deleted or you may not have permission to view it.
        </p>
        <Link to="/pickups">
          <Button variant="outline">Back to Pickups</Button>
        </Link>
      </div>
    );
  }

  return (
    <ComponentErrorBoundary title="Pickup Detail Error">
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/pickups">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Pickups
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={statusBadge.variant}>
                {statusBadge.label}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pickup #{pickup.referenceCode || pickup._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-gray-600 mt-1">
              Scheduled for {formatDate(pickup.pickupDate)} at {pickup.startTime} - {pickup.endTime}
            </p>
          </div>

          {/* Actions (Staff/Admin only) */}
          {canAccessStaffRoutes() && !pickup.isCompleted && (
            <div className="flex gap-3 items-start">
               {!pickup.isVerified && (
                <Button
                  variant="outline"
                  onClick={openScanModal}
                >
                  <QrCode className="h-5 w-5 mr-2" />
                  Verify Pickup
                </Button>
              )}
              <div>
                <Button
                  variant="primary"
                  onClick={handleCompletePickup}
                  isLoading={isCompleting}
                  disabled={!pickup.isVerified}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Complete Pickup
                </Button>
                {!pickup.isVerified && (
                  <p className="text-xs text-red-500 mt-1 text-right">
                    * Verification required
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Information */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Item Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-lg text-gray-900">{pickup.itemId?.description || pickup.claimId?.itemId?.description || 'N/A'}</p>
                </div>
                <Link to={`/items/${pickup.itemId?._id || pickup.claimId?.itemId?._id}`}>
                  <Button variant="outline" size="sm">
                    View Full Item Details
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Pickup Details */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pickup Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Scheduled Date</p>
                    <p className="text-gray-900 font-medium">{formatDate(pickup.pickupDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Scheduled Time</p>
                    <p className="text-gray-900 font-medium">{pickup.startTime} - {pickup.endTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">Main Office, Lost & Found Dept.</p>
                  </div>
                </div>

                {pickup.referenceCode && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reference Code</p>
                      <p className="text-gray-900 font-medium font-mono">{pickup.referenceCode}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {pickup.notes && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">Additional Notes</p>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic">"{pickup.notes}"</p>
                </div>
              )}
            </Card>

            {/* QR Code - Hide for Staff/Admin (or rather, hide if backend didn't send it) */}
            {pickup.qrCode && !pickup.isCompleted && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Pickup QR Code
                </h2>
                <div className="text-center py-8">
                  <div className="inline-block p-6 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
                    <img 
                      src={pickup.qrCode} 
                      alt="Pickup QR Code" 
                      className="h-40 w-40 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Code: <span className="font-mono font-bold text-gray-900">{pickup.referenceCode}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                    Please show this QR code to the staff during your appointment for quick verification.
                  </p>
                </div>
              </Card>
            )}

            {pickup.isCompleted && pickup.completedAt && (
               <Card className="bg-green-50 border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Pickup Completed</h3>
                      <p className="text-sm text-green-700">
                        This item was handed over on {formatDate(pickup.completedAt)}
                      </p>
                    </div>
                  </div>
               </Card>
            )}
          </div>

          {/* Sidebar */}
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
          </div>
        </div>
      </div>
      
      <ScanPickupModal
        isOpen={isScanModalOpen}
        onClose={closeScanModal}
        onVerifySuccess={handleVerifySuccess}
      />
    </ComponentErrorBoundary>
  );
};

export default PickupDetail;
