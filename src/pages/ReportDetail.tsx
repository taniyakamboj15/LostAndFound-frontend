import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Package, TrendingUp } from 'lucide-react';

import { Badge, Spinner, Card } from '@components/ui';
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
      if (id && user) {
        try {
          setIsLoadingMatches(true);
          const matchData = await matchService.getMatchesForReport(id);
          setMatches(matchData);
        } catch (error: unknown) {
          toast.error(getErrorMessage(error))
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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-gray-400 font-medium animate-pulse">Retrieving report details...</p>
      </div>
    );
  }

  return (
    <ComponentErrorBoundary title="Report Detail Error">
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <BackButton label="Back to reports" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
             {report.matchCount && report.matchCount > 0 && (
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-100">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-sm font-bold text-green-700">{report.matchCount} Active Matches</span>
               </div>
             )}
          </motion.div>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-0 border-none bg-white shadow-xl shadow-gray-100/50 overflow-hidden rounded-3xl">
            <div className="relative">
              {/* Background Gradient Accent */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent" />
              
              <div className="p-8 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="info" className="px-4 py-1.5 rounded-xl uppercase tracking-widest text-[11px] font-extrabold shadow-sm">
                        {ITEM_CATEGORIES[report.category as ItemCategory].label}
                      </Badge>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                        Report #{report._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                      My Lost Item <span className="text-blue-600 block md:inline">Report</span>
                    </h1>

                    <div className="flex items-center gap-4 pt-2">
                       <div className="flex items-center gap-2 text-gray-500 font-medium">
                          <Package className="h-5 w-5 text-gray-400" />
                          <span>Status: <i className="text-blue-600">Active Tracking</i></span>
                       </div>
                       <div className="h-4 w-px bg-gray-200" />
                       <p className="text-gray-500 font-medium">
                         Submitted {formatRelativeTime(report.createdAt)}
                       </p>
                    </div>
                  </div>

                  {/* Quick Info Box */}
                  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 md:min-w-[200px] text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Matches Found</p>
                    <div className="text-5xl font-black text-blue-600">
                      {matches.length}
                    </div>
                    {matches.length > 0 && (
                      <p className="text-xs font-bold text-green-600 mt-2 flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3" /> New activity
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ReportInfoCard report={report} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ReportMatches matches={matches} isLoading={isLoadingMatches} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             <ReportDetailsSidebar report={report} />
          </div>
        </div>
      </div>
    </ComponentErrorBoundary>
  );
};

export default ReportDetail;
