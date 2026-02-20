
import { useStaffOptimization } from '../../hooks/useStaffOptimization';
import { Card } from '../ui';
import { Users, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StaffWorkload } from '../../types/analytics.types';

interface StaffOptimizationProps {
    workload: StaffWorkload | null;
}

const StaffOptimization = ({ workload }: StaffOptimizationProps) => {
    const { chartData, hasData, peakHour } = useStaffOptimization(workload);

    if (!workload) return null;

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Staff Workload Prediction</h3>
                    <p className="text-sm text-gray-500">Predicted peak hours based on historical peaks</p>
                </div>
            </div>

            <div className="h-64 mb-6 relative">
                {!hasData && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[1px] rounded-lg border border-dashed border-gray-300">
                        <AlertTriangle className="h-8 w-8 text-gray-400 mb-2" />
                        <h4 className="text-sm font-semibold text-gray-700">Insufficient Data</h4>
                        <p className="text-xs text-gray-500 text-center px-4 mt-1">
                            We need more intake and claim records to generate accurate workload predictions.
                        </p>
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hasData ? chartData : chartData.map(d => ({ ...d, intake: 1, claims: 1 }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={hasData ? 1 : 0.3} />
                        <XAxis dataKey="hour" fontSize={11} tickMargin={5} opacity={hasData ? 1 : 0.5} />
                        <YAxis fontSize={11} opacity={hasData ? 1 : 0.5} />
                        {hasData && (
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                        )}
                        <Legend verticalAlign="top" height={36} opacity={hasData ? 1 : 0.5} />
                        <Bar dataKey="intake" name="Item Intake" fill={hasData ? "#3b82f6" : "#e2e8f0"} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="claims" name="Claim Filing" fill={hasData ? "#8b5cf6" : "#f1f5f9"} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {hasData && peakHour ? (
                <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex items-start gap-4">
                        <div className="p-2 bg-orange-100 rounded-full">
                            <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-orange-900 text-sm">Predicted Peak Hour: {peakHour.hour}</h4>
                            <p className="text-xs text-orange-700 mt-0.5">
                                High volume of {peakHour.intake > peakHour.claims ? 'items being found' : 'claims being filed'} expected.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-slate-700">Scheduling Recommendation</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Increase front-desk staff by +1 between {parseInt(peakHour.hour) - 1}:00 and {parseInt(peakHour.hour) + 1}:00 to maintain sub-5 min response times.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-gray-700">Analytics Gathering Phase</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Recommendations will appear here once the system has processed enough operational data to identify statistically significant patterns in your workflow.
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default StaffOptimization;
