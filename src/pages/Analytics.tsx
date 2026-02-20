import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Card } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { ComponentErrorBoundary } from '@components/feedback';
import type { AnalyticsLoaderData } from '../types/analytics.types';

// Original Components
import PaymentRevenue from '@components/analytics/PaymentRevenue';
import CategoryBreakdown from '@components/analytics/CategoryBreakdown';
import ItemLifecycleSummary from '@components/analytics/ItemLifecycleSummary';
import ItemTrends from '@components/analytics/ItemTrends';
import PredictiveInsights from '@components/analytics/PredictiveInsights';
import StorageOptimization from '@components/analytics/StorageOptimization';
import StaffOptimization from '@components/analytics/StaffOptimization';

// New Dashboard Sub-components
import AnalyticsHeader from '@components/analytics/dashboard/AnalyticsHeader';
import AnalyticsMetrics from '@components/analytics/dashboard/AnalyticsMetrics';
import RiskManagementCard from '@components/analytics/dashboard/RiskManagementCard';

const Analytics = () => {
  const { metrics, trends, paymentAnalytics, workload, accuracy, error } = useLoaderData() as AnalyticsLoaderData;
  const { isAdmin } = useAuth();

  const avgAccuracy = useMemo(() => {
    if (!accuracy || accuracy.length === 0) return null;
    const totalCount = accuracy.reduce((acc, curr) => acc + curr.count, 0);
    const weightedSum = accuracy.reduce((acc, curr) => acc + (curr.avgError * curr.count), 0);
    return Math.round((weightedSum / totalCount) * 10) / 10;
  }, [accuracy]);

  if (!isAdmin()) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed">
        <p className="text-gray-500 font-bold text-lg text-center">Permission Denied</p>
        <p className="text-gray-400 mt-2">You don't have the required administrative permissions to view system analytics.</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-24 bg-red-50 border-2 border-red-100 rounded-3xl">
        <p className="text-red-600 font-bold text-lg">{error}</p>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed">
        <p className="text-gray-500 font-bold text-lg text-center">No Data Available</p>
        <p className="text-gray-400 mt-2">There is currently no analytics data available for display.</p>
      </Card>
    );
  }

  return (
    <ComponentErrorBoundary title="Analytics Dashboard Error">
      <div className="space-y-12 pb-12">
        <AnalyticsHeader 
          title="Analytics Dashboard" 
          subtitle="Real-time overview of system performance, item cycles, and AI accuracy" 
        />

        <AnalyticsMetrics 
          metrics={metrics} 
          avgAccuracy={avgAccuracy} 
        />

        {/* Smart Insights & Risk Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Smart Insights</h2>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">AI Powered</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PredictiveInsights />
                    <StaffOptimization workload={workload} />
                    <div className="md:col-span-2">
                      <StorageOptimization />
                    </div>
                </div>
            </div>
            <RiskManagementCard highRiskClaimsCount={metrics?.highRiskClaims} />
        </div>

        <div className="pt-6 border-t border-gray-100">
          <ItemTrends trends={trends} />
        </div>

        <div className="pt-6 border-t border-gray-100">
          <CategoryBreakdown metrics={metrics} />
        </div>

        <div className="pt-6 border-t border-gray-100">
          <ItemLifecycleSummary metrics={metrics} />
        </div>

        {paymentAnalytics && (
          <div className="border-t border-gray-200 pt-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Overview</h2>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100 uppercase tracking-wider">Admin Only</span>
            </div>
            <PaymentRevenue pa={paymentAnalytics} />
          </div>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default Analytics;
