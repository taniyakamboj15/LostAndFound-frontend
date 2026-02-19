import { Card } from '@components/ui';
import type { AnalyticsMetrics } from '../../types/analytics.types';

interface MetricProps {
    metrics: AnalyticsMetrics
}

const ItemLifecycleSummary = ({ metrics }: MetricProps) => (
  <Card>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Lifecycle Summary</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm font-medium text-blue-900">Currently Claimed</p>
        <p className="text-2xl font-bold text-blue-900 mt-2">{metrics.totalItemsClaimed}</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-sm font-medium text-green-900">Successfully Returned</p>
        <p className="text-2xl font-bold text-green-900 mt-2">{metrics.totalItemsReturned}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-900">Total Disposed</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{metrics.totalItemsDisposed}</p>
      </div>
    </div>
    {metrics.expiringItems > 0 && (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm font-medium text-yellow-900">Items Expiring Soon (7 days)</p>
        <p className="text-2xl font-bold text-yellow-900 mt-2">{metrics.expiringItems}</p>
      </div>
    )}
  </Card>
);

export default ItemLifecycleSummary;
