import { Package, Users, TrendingUp, Clock } from 'lucide-react';
import StatCard from '@components/analytics/StatCard';

interface AnalyticsMetricsProps {
  metrics: {
    totalItemsFound: number;
    pendingClaims: number;
    matchSuccessRate: number;
  };
  avgAccuracy: number | null;
}

const AnalyticsMetrics = ({ metrics, avgAccuracy }: AnalyticsMetricsProps) => (
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
);

export default AnalyticsMetrics;
