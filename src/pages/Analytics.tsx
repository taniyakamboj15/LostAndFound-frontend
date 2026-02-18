import { useLoaderData } from 'react-router-dom';
import { Package, Users, TrendingUp } from 'lucide-react';
import { Card } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { ComponentErrorBoundary } from '@components/feedback';
import type { AnalyticsLoaderData } from '../types/analytics.types';

const Analytics = () => {
  const { metrics, trends, error } = useLoaderData() as AnalyticsLoaderData;
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600">You don't have permission to view analytics.</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600">No analytics data available.</p>
      </Card>
    );
  }

  return (
    <ComponentErrorBoundary title="Analytics Dashboard Error">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of system performance and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items Found</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics!.totalItemsFound}</p>
              </div>
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics!.pendingClaims}</p>
              </div>
              <Users className="h-12 w-12 text-purple-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Match Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Math.round(metrics!.matchSuccessRate * 100)}%
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Item Trends */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Trends (Last {trends.length} Days)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Found</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Claimed</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Returned</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((trend, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{trend.date}</td>
                    <td className="py-3 px-4 text-right text-gray-900">{trend.found}</td>
                    <td className="py-3 px-4 text-right text-gray-900">{trend.claimed}</td>
                    <td className="py-3 px-4 text-right text-gray-900">{trend.returned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(metrics!.categoryBreakdown).map(([category, count]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm text-gray-600">{count} items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${metrics!.totalItemsFound > 0 ? Math.min(100, (count / metrics!.totalItemsFound) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Lifecycle Summary */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Lifecycle Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Currently Claimed</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">{metrics!.totalItemsClaimed}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Successfully Returned</p>
              <p className="text-2xl font-bold text-green-900 mt-2">{metrics!.totalItemsReturned}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Total Disposed</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{metrics!.totalItemsDisposed}</p>
            </div>
          </div>
          {metrics!.expiringItems > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">Items Expiring Soon (7 days)</p>
              <p className="text-2xl font-bold text-yellow-900 mt-2">{metrics!.expiringItems}</p>
            </div>
          )}
        </Card>
      </div>
    </ComponentErrorBoundary>
  );
};

export default Analytics;
