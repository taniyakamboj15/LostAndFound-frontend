
import { useState } from 'react';
import { Card, Button, Input } from '../ui';
import { ITEM_CATEGORIES } from '../../constants/categories';
import { Loader2, TrendingUp, AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

interface Prediction {
    minDays: number;
    maxDays: number;
    confidence: number;
    likelihood: number;
}

const PredictiveInsights = () => {
    const [category, setCategory] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePredict = async () => {
        if (!category) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<{ success: boolean; data: Prediction }>('/api/analytics/prediction', {
                params: { category, location }
            });
            setPrediction(response.data.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Predictive claim Model</h3>
                    <p className="text-sm text-gray-500">Estimate success and time using historical data</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Category</label>
                        <select 
                            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {Object.entries(ITEM_CATEGORIES).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Found</label>
                        <Input 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Terminal 1, Lobby..."
                        />
                    </div>
                </div>

                <Button 
                    onClick={handlePredict} 
                    disabled={!category || loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Run Prediction Engine'}
                </Button>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {error}
                    </div>
                )}

                {prediction && !loading && (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                        {prediction.confidence <= 0.4 && (
                            <div className="p-3 bg-amber-50 rounded-md border border-amber-200 flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    <strong>Limited Data:</strong> This prediction relies on system defaults. As more <strong>{ITEM_CATEGORIES[category as keyof typeof ITEM_CATEGORIES]?.label || category}</strong> items are processed, precision will increase.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Likelihood</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-purple-900">
                                        {(prediction.likelihood * 100).toFixed(0)}%
                                    </span>
                                    <span className="text-xs text-purple-600">to be claimed</span>
                                </div>
                                <div className="mt-2 w-full bg-purple-200 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-purple-600 h-full rounded-full transition-all duration-1000" 
                                        style={{ width: `${prediction.likelihood * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Time to Claim</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-blue-900">
                                        {prediction.minDays}-{prediction.maxDays}
                                    </span>
                                    <span className="text-xs text-blue-600">days</span>
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-[10px] text-blue-500">
                                    {prediction.confidence <= 0.4 ? (
                                        <>
                                            <AlertCircle className="h-3 w-3" />
                                            <span>Baseline estimate (low data)</span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="h-3 w-3" />
                                            <span>{((prediction.confidence || 0) * 100).toFixed(0)}% Confidence level</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-slate-400 mt-0.5" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                <strong>Optimization Tip:</strong> {prediction.confidence <= 0.4 
                                    ? "Start tracking items of this category to build a personalized turnaround timeline."
                                    : (prediction.likelihood > 0.7 
                                        ? "High likelihood items should be placed in front-access shelving for faster handover." 
                                        : "Low likelihood items can be moved to secondary storage after 48 hours to save prime space."
                                    )
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PredictiveInsights;
