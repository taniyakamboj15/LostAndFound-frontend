import { MapPin, Calendar, User, Package, Clock, AlertCircle } from 'lucide-react';
import BackButton from '@components/ui/BackButton';
import { Card, Badge, Button, Modal, Spinner } from '@components/ui';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { ItemStatus, ITEM_STATUS } from '@constants/status';
import { formatDate, formatRelativeTime } from '@utils/formatters';
import { useAuth } from '@hooks/useAuth';
import { useItemDetail } from '@hooks/useItems';
import { ComponentErrorBoundary } from '@components/feedback';
import DispositionActions from '@components/items/DispositionActions';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { UploadedFile } from '../types';
import { API_BASE_URL } from '../constants/api';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isStaff, user } = useAuth();
  const { item, isLoading: loading } = useItemDetail(id || null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);

  const getStatusBadgeVariant = (status: ItemStatus) => {
    return ITEM_STATUS[status].variant;
  };

  if (loading || !item) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ComponentErrorBoundary title="Item Detail Error">
      <div className="space-y-6">
        {/* Back Button */}
        <BackButton label="Back to Items" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos */}
            <Card>
              {/* Main Photo */}
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {item.photos && item.photos.length > 0 ? (
                  <img
                    src={item.photos[selectedPhoto].path.startsWith('http') ? item.photos[selectedPhoto].path : `${API_BASE_URL}/${item.photos[selectedPhoto].path}`}
                    alt={item.photos[selectedPhoto].filename}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Package className="h-16 w-16 text-gray-400" />
                )}
              </div>

              {/* Thumbnail Gallery */}
              {item.photos && item.photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.photos.map((photo: UploadedFile, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhoto(index)}
                      className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 ${
                        selectedPhoto === index ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={photo.path.startsWith('http') ? photo.path : `${API_BASE_URL}/${photo.path}`}
                        alt={photo.filename}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Description */}
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="info">
                    {ITEM_CATEGORIES[item.category as ItemCategory].label}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(item.status as ItemStatus)}>
                    {ITEM_STATUS[item.status as ItemStatus].label}
                  </Badge>
                  {item.isHighValue && (
                    <Badge variant="warning">High Value</Badge>
                  )}
                  {item.claimedBy && (typeof item.claimedBy === 'object' ? item.claimedBy._id : item.claimedBy) === (isStaff() ? null : user?._id) && (
                     <Badge variant="info">Claimed by You</Badge>
                  )}
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {ITEM_CATEGORIES[item.category as ItemCategory].label} - {item.description.substring(0, 50)}...
              </h1>

              <div className="prose max-w-none">
                <p className="text-gray-700">{item.description}</p>
              </div>
            </Card>

            {/* Keywords */}
            {item.keywords && item.keywords.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h2>
              <div className="space-y-3">
                {item.status === ItemStatus.AVAILABLE && (
                  user ? (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => setIsClaimModalOpen(true)}
                    >
                      File a Claim
                    </Button>
                  ) : (
                    <Link to={`/login?redirect=/items/${id}`}>
                      <Button variant="primary" fullWidth>
                        Login to Claim
                      </Button>
                    </Link>
                  )
                )}
                {(isAdmin() || isStaff()) && (
                  <>
                    <Button 
                      variant="outline" 
                      fullWidth
                      onClick={() => navigate(`/items/${id}/edit`)}
                    >
                      Edit Item
                    </Button>
                    <Button variant="outline" fullWidth onClick={() => navigate(`/claims?itemId=${id}`)}>
                      View Claims
                    </Button>
                    <Button variant="outline" fullWidth onClick={() => navigate(`/reports?category=${item.category}`)}>
                      View Matches
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Details */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location Found</p>
                    <p className="text-sm text-gray-600">{item.locationFound}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date Found</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(item.dateFound)} ({formatRelativeTime(item.dateFound)})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Registered By</p>
                    <p className="text-sm text-gray-600">{item.registeredBy?.name || 'Unknown'}</p>
                  </div>
                </div>

                {item.finderName && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Found By</p>
                      <p className="text-sm text-gray-600">{item.finderName}</p>
                      {item.finderContact && (
                        <p className="text-xs text-gray-500">{item.finderContact}</p>
                      )}
                    </div>
                  </div>
                )}

                {item.storageLocation && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Storage Location</p>
                      <p className="text-sm text-gray-600">
                        {typeof item.storageLocation === 'object' ? item.storageLocation.name : item.storageLocation}
                      </p>
                    </div>
                  </div>
                )}

                {item.retentionExpiryDate && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Retention Expiry</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(item.retentionExpiryDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Alert */}
            {item.retentionExpiryDate && (
              <Card className="bg-orange-50 border border-orange-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">
                      Retention Period
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      This item will be disposed on {formatDate(item.retentionExpiryDate)} if not claimed.
                    </p>
                  </div>
                </div>
                
                {/* Disposition Actions (Staff/Admin only) */}
                {(isAdmin() || isStaff()) && new Date(item.retentionExpiryDate) < new Date() && item.status === ItemStatus.AVAILABLE && (
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <DispositionActions itemId={item._id || ''} onDispositionComplete={() => navigate('/items')} />
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Claim Modal */}
        <Modal
          isOpen={isClaimModalOpen}
          onClose={() => setIsClaimModalOpen(false)}
          title="File a Claim"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              To claim this item, you'll need to provide proof of ownership. Click continue to proceed with the claim process.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsClaimModalOpen(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsClaimModalOpen(false);
                  navigate(`/claims/create?itemId=${item._id}`);
                }}
                fullWidth
              >
                Continue
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ComponentErrorBoundary>
  );
};

export default ItemDetail;
