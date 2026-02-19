import { Card } from '@components/ui';
import type { AnalyticsMetrics } from '../../types/analytics.types';

interface MetricProps {
    metrics: AnalyticsMetrics
}

const CATEGORY_COLORS: Record<string, string> = {
  ELECTRONICS: 'bg-blue-500',
  DOCUMENTS: 'bg-indigo-500',
  CLOTHING: 'bg-purple-500',
  ACCESSORIES: 'bg-pink-500',
  BAGS: 'bg-orange-500',
  KEYS: 'bg-amber-500',
  JEWELRY: 'bg-yellow-500',
  BOOKS: 'bg-emerald-500',
  SPORTS_EQUIPMENT: 'bg-cyan-500',
  OTHER: 'bg-slate-500',
};

const CategoryBreakdown = ({ metrics }: MetricProps) => {
  const sortedCategories = Object.entries(metrics.categoryBreakdown)
    .sort(([, a], [, b]) => b - a);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Category Distribution</h2>
        <p className="text-sm text-gray-500">Breakdown of reported items by category</p>
      </div>
      <div className="space-y-5">
        {sortedCategories.map(([category, count]) => {
          const percentage = metrics.totalItemsFound > 0
            ? Math.round((count / metrics.totalItemsFound) * 100)
            : 0;
            
          return (
            <div key={category} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[category] || 'bg-gray-400'}`} />
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {category.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">{count} items</span>
                  <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${CATEGORY_COLORS[category] || 'bg-gray-400'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {sortedCategories.length === 0 && (
        <p className="text-center text-gray-500 py-8">No category data available.</p>
      )}
    </Card>
  );
};

export default CategoryBreakdown;
