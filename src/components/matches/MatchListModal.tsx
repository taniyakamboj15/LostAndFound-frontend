import { useNavigate } from 'react-router-dom';
import { X, Calendar, MapPin, Search } from 'lucide-react';
import { Button, Badge } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { ROUTES } from '@/constants';
import { MatchListModalProps} from '@/types/match.types';
 
const MatchListModal = ({
  isOpen,
  onClose,
  matches,
  title = 'Potential Matches',
}: MatchListModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No matches found.</p>
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match._id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        match.confidenceScore > 0.8
                          ? 'success'
                          : match.confidenceScore > 0.5
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {Math.round(match.confidenceScore * 100)}% Match
                    </Badge>
                     {(match.featureScore || 0) > 0.8 && (
                        <Badge variant="info">Feature Match</Badge>
                     )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onClose();
                        navigate(`${ROUTES.REPORTS}/${match.lostReportId._id}`);
                    }}
                  >
                    View Report
                  </Button>
                </div>

                <p className="text-gray-900 font-medium mb-2 line-clamp-2">
                  {match.lostReportId.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Lost: {formatDate(match.lostReportId.dateLost)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{match.lostReportId.locationLost}</span>
                  </div>
                </div>
                {match.lostReportId.identifyingFeatures && match.lostReportId.identifyingFeatures.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500">Features:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {match.lostReportId.identifyingFeatures.map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchListModal;
