import { MapPin, Calendar, User, AlertCircle } from 'lucide-react';
import { Card } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { LostReport } from '../../types/report.types';
import { motion } from 'framer-motion';

interface ReportDetailsSidebarProps {
  report: LostReport;
}

const ReportDetailsSidebar = ({ report }: ReportDetailsSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Loss Details */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="border-none shadow-lg bg-white overflow-hidden rounded-3xl">
          <div className="p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">
              Loss Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Location</p>
                  <p className="text-sm text-gray-900 font-bold">{report.locationLost}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Occurred On</p>
                  <p className="text-sm text-gray-900 font-bold">{formatDate(report.dateLost)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Reported By</p>
                  <p className="text-sm text-gray-900 font-bold">{(report.submittedBy || report.reportedBy)?.name || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none shadow-lg bg-white overflow-hidden rounded-3xl">
          <div className="p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">
              Contact Details
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/30">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Email Address</p>
                <p className="text-sm text-gray-900 font-bold break-all">{report.contactEmail}</p>
              </div>
              {report.contactPhone && (
                <div className="flex flex-col gap-1 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/30">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Phone Number</p>
                  <p className="text-sm text-gray-900 font-bold">{report.contactPhone}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 border-none overflow-hidden rounded-3xl relative">
          <div className="absolute inset-0 bg-white/5 opacity-10" />
          <div className="p-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white mb-1">
                  Automated Matching
                </p>
                <p className="text-xs text-indigo-50 font-medium leading-relaxed opacity-90">
                  Our system scans every new found item. You'll get instant notifications for any match.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReportDetailsSidebar;
