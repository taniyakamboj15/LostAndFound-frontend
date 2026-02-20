
import { useState, useEffect } from 'react';
import { Card, Button } from '../ui';
import { Loader2, Warehouse, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

interface OptimizationInsights {
    usage: number;
    recommendations: string[];
    slowMovingCategories: string[];
}

const StorageOptimization = () => {
    const [insights, setInsights] = useState<OptimizationInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ success: boolean; data: OptimizationInsights }>('/api/analytics/storage-optimization');
            setInsights(response.data.data);
            setError(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load storage insights');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    if (loading) {
        return (
            <Card className="p-6 h-full flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-6 h-full flex flex-col items-center justify-center min-h-[300px] text-center">
                <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchInsights} variant="outline" size="sm">Retry</Button>
            </Card>
        );
    }

    if (!insights) return null;

    const getUsageColor = (usage: number) => {
        if (usage >= 90) return 'text-red-600 bg-red-100';
        if (usage >= 75) return 'text-orange-600 bg-orange-100';
        return 'text-green-600 bg-green-100';
    };

    const getUsageBarColor = (usage: number) => {
        if (usage >= 90) return 'bg-red-500';
        if (usage >= 75) return 'bg-orange-500';
        return 'bg-green-500';
    };

    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Warehouse className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Storage Optimization</h3>
                        <p className="text-sm text-gray-500">Capacity & Efficiency</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchInsights} className="text-gray-400 hover:text-blue-600">
                    Refresh
                </Button>
            </div>

            {/* Capacity Meter */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Utilization</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getUsageColor(insights.usage)}`}>
                        {(insights?.usage || 0).toFixed(1)}% Full
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${getUsageBarColor(insights.usage)}`}
                        style={{ width: `${Math.min(100, insights.usage)}%` }}
                    />
                </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4 flex-grow">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">AI Recommendations</h4>
                
                {insights.recommendations.length > 0 ? (
                    <div className="space-y-3">
                        {insights.recommendations.map((rec, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-blue-900">{rec}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500 italic bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                        No immediate actions required. Operations look optimized!
                    </div>
                )}
            </div>

            {/* Slow Moving Categories */}
            {insights.slowMovingCategories.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Slow Moving Inventory</h4>
                    <div className="flex flex-wrap gap-2">
                        {insights.slowMovingCategories.map(cat => (
                            <span key={cat} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default StorageOptimization;
