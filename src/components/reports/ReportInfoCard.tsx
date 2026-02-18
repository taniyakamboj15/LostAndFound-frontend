import { Card } from '@components/ui';
import { LostReport } from '../../types/report.types';

interface ReportInfoCardProps {
  report: LostReport;
}

const ReportInfoCard = ({ report }: ReportInfoCardProps) => {
  return (
    <>
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Item Description
        </h2>
        <p className="text-gray-700">{report.description}</p>
      </Card>

      {/* Identifying Features */}
      {report.identifyingFeatures && report.identifyingFeatures.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Identifying Features
          </h2>
          <div className="flex flex-wrap gap-2">
            {report.identifyingFeatures.map((feature: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        </Card>
      )}

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
    </>
  );
};

export default ReportInfoCard;
