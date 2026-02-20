import { useMemo } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { Package, Users, TrendingUp, ShieldAlert, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, Button } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { ComponentErrorBoundary } from '@components/feedback';
import type { AnalyticsLoaderData } from '../types/analytics.types';
import StatCard from '@components/analytics/StatCard';
import PaymentRevenue from '@components/analytics/PaymentRevenue';
import CategoryBreakdown from '@components/analytics/CategoryBreakdown';
import ItemLifecycleSummary from '@components/analytics/ItemLifecycleSummary';
import ItemTrends from '@components/analytics/ItemTrends';
import PredictiveInsights from '@components/analytics/PredictiveInsights';
import StorageOptimization from '@components/analytics/StorageOptimization';
import StaffOptimization from '@components/analytics/StaffOptimization';

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
          {avgAccuracy !== null && (
            <StatCard
              label="Avg. Prediction Error"
              value={`${avgAccuracy} days`}
              icon={Clock}
              color="text-amber-600"
              className="shadow-sm hover:shadow-md transition-shadow"
            />
          )}
        </div>

        {/* Smart Insights & Fraud Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Smart Insights & Optimization</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PredictiveInsights />
                        <StaffOptimization workload={workload} />
                        <StorageOptimization />
                    </div>
                </div>
            </div>
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
                            {metrics?.highRiskClaims && metrics.highRiskClaims > 0 ? (
                                <div className="flex items-center gap-2 mb-4 p-2 bg-red-100/50 rounded-md border border-red-200">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <span className="text-sm font-bold text-red-700">
                                        {metrics.highRiskClaims} High-Risk Flags Found
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
