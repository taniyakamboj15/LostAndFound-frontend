import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Badge, Spinner } from '@components/ui';
import BackButton from '@components/ui/BackButton';
import { ComponentErrorBoundary } from '@components/feedback';
import ReportInfoCard from '@components/reports/ReportInfoCard';
import ReportMatches from '@components/reports/ReportMatches';
import ReportDetailsSidebar from '@components/reports/ReportDetailsSidebar';

import { ItemCategory, ITEM_CATEGORIES } from '@constants/categories';
import { formatRelativeTime } from '@utils/formatters';
import { getErrorMessage } from '@/utils/errors';

import { useReportDetail } from '@hooks/useReports';
import { useAuth } from '@hooks/useAuth';
import matchService from '@services/match.service';
import { Match } from '../types/match.types';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { report, isLoading: loading } = useReportDetail(id || null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      // We explicitly rely on backend authorization (403 if not owner).
      // Only attempt fetch if we have a report ID and a logged-in user who *could* be the owner or staff.
      if (id && user) {
        try {
          setIsLoadingMatches(true);
          const matchData = await matchService.getMatchesForReport(id);
          setMatches(matchData);
        } catch (error: unknown) {
          // If 403, it just means no access, which is fine (e.g. viewing someone else's report)
         toast.error( getErrorMessage(error))
        } finally {
          setIsLoadingMatches(false);
        }
      }
    };

    if (report) {
      fetchMatches();
    }
  }, [id, user, report]);


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
            {matches.length > 0 && (
              <Badge variant="success">
                {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
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
            <ReportInfoCard report={report} />
            <ReportMatches matches={matches} isLoading={isLoadingMatches} />
          </div>

          {/* Sidebar */}
          <ReportDetailsSidebar report={report} />
        </div>
      </div>
    </ComponentErrorBoundary>
  );
};

export default ReportDetail;
