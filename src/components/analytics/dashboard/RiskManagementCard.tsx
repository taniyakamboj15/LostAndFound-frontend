import { ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@components/ui';

interface RiskManagementCardProps {
  highRiskClaimsCount?: number;
}

const RiskManagementCard = ({ highRiskClaimsCount }: RiskManagementCardProps) => (
  <div>
    <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Management</h2>
    <Card className="p-5 border-red-100 bg-red-50/30">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-red-100 rounded-lg">
          <ShieldAlert className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Fraud Detection</h3>
          <p className="text-sm text-gray-600 mt-1 mb-3">
            Proactive scanning for claim patterns, date anomalies, and description copy-pasting.
          </p>
          {highRiskClaimsCount && highRiskClaimsCount > 0 ? (
            <div className="flex items-center gap-2 mb-4 p-2 bg-red-100/50 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-bold text-red-700">
                {highRiskClaimsCount} High-Risk Flags Found
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4 p-2 bg-green-100/50 rounded-md border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                No active high-risk flags
              </span>
            </div>
          )}
          <Link to="/admin/fraud">
            <Button variant="outline" size="sm" className="w-full bg-white border-red-200 text-red-700 hover:bg-red-50">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  </div>
);

export default RiskManagementCard;
