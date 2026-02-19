import { useLoaderData } from 'react-router-dom';
import { Package, Users, TrendingUp } from 'lucide-react';
import { Card } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { ComponentErrorBoundary } from '@components/feedback';
import type { AnalyticsLoaderData } from '../types/analytics.types';
import StatCard from '@components/analytics/StatCard';
import PaymentRevenue from '@components/analytics/PaymentRevenue';
import CategoryBreakdown from '@components/analytics/CategoryBreakdown';
import ItemLifecycleSummary from '@components/analytics/ItemLifecycleSummary';
import ItemTrends from '@components/analytics/ItemTrends';

const Analytics = () => {
  const { metrics, trends, paymentAnalytics, error } = useLoaderData() as AnalyticsLoaderData;
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of system performance and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            label="Total Items Found" 
            value={metrics.totalItemsFound} 
            icon={Package} 
            color="text-blue-600" 
            className="shadow-sm hover:shadow-md transition-shadow"
          />
          <StatCard 
            label="Pending Claims" 
            value={metrics.pendingClaims} 
            icon={Users} 
            color="text-purple-600" 
            className="shadow-sm hover:shadow-md transition-shadow"
          />
          <StatCard
            label="Match Success Rate"
            value={`${Math.round(metrics.matchSuccessRate * 100)}%`}
            icon={TrendingUp}
            color="text-green-600"
            className="shadow-sm hover:shadow-md transition-shadow"
          />
        </div>

        {/* Item Trends */}
        <ItemTrends trends={trends} />

        {/* Category Breakdown */}
        <CategoryBreakdown metrics={metrics} />

        {/* Item Lifecycle Summary */}
        <ItemLifecycleSummary metrics={metrics} />

        {/* Payment Revenue (admin only) */}
        {paymentAnalytics && (
          <div className="border-t border-gray-200 pt-6">
            <PaymentRevenue pa={paymentAnalytics} />
          </div>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default Analytics;
