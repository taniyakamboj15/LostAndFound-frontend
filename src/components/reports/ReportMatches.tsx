import { Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '@components/ui';
import { Match } from '../../types/match.types';
import { getConfidenceBadge } from '@utils/ui';
import { formatDate } from '@utils/formatters';

interface ReportMatchesProps {
  matches: Match[];
  isLoading: boolean;
}

const ReportMatches = ({ matches, isLoading }: ReportMatchesProps) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Potential Matches ({matches.length})
        </h2>
        {matches.length > 0 && (
          <TrendingUp className="h-5 w-5 text-green-600" />
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spinner size="md" />
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((match: Match) => {
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
                    {match.itemId?.status && (
                        <Badge variant={match.itemId.status === 'AVAILABLE' ? 'success' : 'default'}>
                            {match.itemId.status}
                        </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mb-3">
                  {/* Item Photo thumbnail */}
                  <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden border border-gray-200">
                    {match.itemId?.photos && match.itemId.photos.length > 0 ? (
                      <img
                        src={match.itemId.photos[0].path.startsWith('http') ? match.itemId.photos[0].path : `${apiUrl}/${match.itemId.photos[0].path}`}
                        alt="Item thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {match.itemId?.description || 'Item description unavailable'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
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
                      <Link to={`/items/${match.itemId._id}`} className="flex-1">
                        <Button variant="outline" size="sm" fullWidth>
                          View Item
                        </Button>
                      </Link>
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        className="flex-1"
                        disabled={match.itemId.status !== 'AVAILABLE'}
                        onClick={() => match.itemId && navigate(`/claims/create?itemId=${match.itemId._id}`)}
                      >
                        {match.itemId.status === 'AVAILABLE' ? 'File Claim' : 'Not Available'}
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
  );
};

export default ReportMatches;
