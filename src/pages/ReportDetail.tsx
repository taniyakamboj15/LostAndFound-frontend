import { useParams, useNavigate, Link } from 'react-router-dom';
import BackButton from '@components/ui/BackButton';
import { 
  MapPin,
  Calendar,
  User,
  Package,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Card, Badge, Button, Spinner } from '@components/ui';
import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { formatDate, formatRelativeTime } from '@utils/formatters';
import { useReportDetail } from '@hooks/useReports';
import { ComponentErrorBoundary } from '@components/feedback';
import { Match } from '../types/match.types';
import { getConfidenceBadge } from '@utils/ui';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { report, isLoading: loading } = useReportDetail(id || null);



  if (loading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ComponentErrorBoundary title="Report Detail Error">
      <div className="space-y-6">
        {/* Back Button */}
        <BackButton label="Back to Reports" />
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="info">
              {ITEM_CATEGORIES[report.category as ItemCategory].label}
            </Badge>
            {(report.matches?.length || 0) > 0 && (
              <Badge variant="success">
                {report.matches?.length} {(report.matches?.length || 0) === 1 ? 'Match' : 'Matches'}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Lost Report #{report._id}
          </h1>
          <p className="text-gray-600 mt-1">
            Submitted {formatRelativeTime(report.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Item Description
              </h2>
              <p className="text-gray-700">{report.description}</p>
            </Card>

            {/* Keywords */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
              {report.keywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>

            {/* Matches */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Potential Matches ({report.matches?.length || 0})
                </h2>
                {(report.matches?.length || 0) > 0 && (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                )}
              </div>

              {(report.matches?.length || 0) > 0 ? (
                <div className="space-y-4">
                  {(report.matches as unknown as Match[])?.map((match: Match) => {
                    const confidenceBadge = getConfidenceBadge(match.confidenceScore);
                    return (
                      <div
                        key={match._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={confidenceBadge.variant}>
                              {confidenceBadge.label}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {(match.confidenceScore * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2">
                          {match.itemId?.description || 'Item description unavailable'}
                        </h3>

                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{match.itemId?.locationFound || 'Unknown Location'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>
                              {match.itemId?.dateFound 
                                ? `Found ${formatDate(match.itemId.dateFound)}` 
                                : 'Unknown Date'}
                            </span>
                          </div>
                        </div>

                        {match.reasons && match.reasons.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Match Reasons:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {match.reasons.map((reason: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded"
                                >
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {match.itemId && (
                            <>
                              <Link to={`/items/${match.itemId._id}`}>
                                <Button variant="outline" size="sm">
                                  View Item
                                </Button>
                              </Link>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => match.itemId && navigate(`/claims/create?itemId=${match.itemId._id}`)}
                              >
                                File Claim
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No matches found yet</p>
                  <p className="text-sm mt-1">
                    We'll notify you when we find potential matches
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Loss Details */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Loss Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location Lost</p>
                    <p className="text-sm text-gray-900">{report.locationLost}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date Lost</p>
                    <p className="text-sm text-gray-900">{formatDate(report.dateLost)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Submitted By</p>
                    <p className="text-sm text-gray-900">{(report.submittedBy || report.reportedBy)?.name || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{report.contactEmail}</p>
                </div>
                {report.contactPhone && (
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{report.contactPhone}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Info */}
            <Card className="bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Automatic Matching
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Our system automatically searches for matching found items. You'll receive email notifications for high-confidence matches.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ComponentErrorBoundary>
  );
};

export default ReportDetail;
