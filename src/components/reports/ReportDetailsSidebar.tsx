import { MapPin, Calendar, User, AlertCircle } from 'lucide-react';
import { Card } from '@components/ui';
import { formatDate } from '@utils/formatters';
import { LostReport } from '../../types/report.types';

interface ReportDetailsSidebarProps {
  report: LostReport;
}

const ReportDetailsSidebar = ({ report }: ReportDetailsSidebarProps) => {
  return (
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
  );
};

export default ReportDetailsSidebar;
