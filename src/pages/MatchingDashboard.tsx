import React, { useState, useEffect } from 'react';
import { useMatches, Match } from '../hooks/useMatches';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../utils/errors';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Loader2, Check, X, Settings, ChevronDown, ChevronUp, AlertCircle, Search } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

export const MatchingDashboard: React.FC = () => {
    const { matches, loading, updateMatchStatus, fetchMatches } = useMatches();
    const { success: showSuccess, error: showError } = useToast();
    const [filterStatus, setFilterStatus] = useState<string>('PENDING');
    const [showConfig, setShowConfig] = useState(false);
    const [config, setConfig] = useState({ 
        autoMatchThreshold: 85, 
        rejectThreshold: 30,
        weights: {
            category: 0.1,
            keyword: 0.1,
            date: 0.1,
            location: 0.1,
            feature: 0.45,
            color: 0.15
        }
    });
    const [configLoading, setConfigLoading] = useState(false);
    const [configSaved, setConfigSaved] = useState(false);

    const [reScanLoading, setReScanLoading] = useState(false);

    /** Initialize: Load config from server on mount */
    useEffect(() => {
        const init = async () => {
            try {
                const res = await api.get('/api/matches/config');
                setConfig(res.data.data);
            } catch (err) {
                console.error('Failed to load initial match config', err);
            }
        };
        init();
    }, []);

    const handleStatusChange = (status: 'CONFIRMED' | 'REJECTED', id: string) => {
        updateMatchStatus(id, status);
    };

    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
        fetchMatches(1, { status: status === 'ALL' ? undefined : status });
    };

    const loadConfig = async () => {
        if (showConfig) { setShowConfig(false); return; }
        try {
            const res = await api.get('/api/matches/config');
            setConfig(res.data.data);
        } catch { /* ignore */ }
        setShowConfig(true);
    };

    const saveConfig = async () => {
        setConfigLoading(true);
        try {
            await api.put('/api/matches/config', config);
            setConfigSaved(true);
            setTimeout(() => setConfigSaved(false), 2000);
        } catch { /* ignore */ }
        setConfigLoading(false);
    };

    if (loading && matches.length === 0) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <h1 className="text-3xl font-bold">Matching Dashboard</h1>
                <div className="flex gap-2 flex-wrap">
                    {['PENDING', 'CONFIRMED', 'REJECTED', 'AUTO_CONFIRMED', 'ALL'].map(status => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? "primary" : "outline"}
                            onClick={() => handleFilterChange(status)}
                            size="sm"
                        >
                            {status.replace('_', ' ')}
                        </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={loadConfig} className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        Config
                        {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </Button>
                </div>
            </div>

            {/* Live config panel for Admin */}
            {showConfig && (
                <Card className="p-5 mb-6 bg-slate-50 border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Threshold Configuration
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Auto-Confirm Threshold: <span className="text-green-600 font-bold">{config.autoMatchThreshold}</span>/100
                            </label>
                            <input type="range" min={50} max={99} value={config.autoMatchThreshold}
                                onChange={e => setConfig(c => ({ ...c, autoMatchThreshold: +e.target.value }))}
                                className="w-full accent-green-500" />
                            <p className="text-xs text-slate-500 mt-1">Matches above this are auto-confirmed and the reporter is notified immediately.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Reject Threshold: <span className="text-red-500 font-bold">{config.rejectThreshold}</span>/100
                            </label>
                            <input type="range" min={0} max={50} value={config.rejectThreshold}
                                onChange={e => setConfig(c => ({ ...c, rejectThreshold: +e.target.value }))}
                                className="w-full accent-red-500" />
                            <p className="text-xs text-slate-500 mt-1">Matches below this are discarded.</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden relative">
                            <div className="absolute left-0 top-0 h-full bg-red-200 rounded-full" style={{ width: `${config.rejectThreshold}%` }} />
                            <div className="absolute top-0 h-full bg-yellow-100 rounded-full" style={{ left: `${config.rejectThreshold}%`, width: `${config.autoMatchThreshold - config.rejectThreshold}%` }} />
                            <div className="absolute top-0 h-full bg-green-200 rounded-full" style={{ left: `${config.autoMatchThreshold}%`, right: 0 }} />
                        </div>
                        <div className="flex gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Reject</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-300 inline-block" />Review</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Auto</span>
                        </div>
                    </div>

                    {/* Weight Sliders */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                             Matching Weights Distribution
                             <Badge variant="info" className="text-[10px]">Total: {Math.round(Object.values(config.weights).reduce((a, b) => a + b, 0) * 100)}%</Badge>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {Object.entries(config.weights).map(([key, val]) => (
                                <div key={key} className="space-y-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                        {key} ({(val * 100).toFixed(0)}%)
                                    </label>
                                    <input 
                                        type="range" min={0} max={100} value={val * 100}
                                        onChange={e => {
                                            const newWeights = { ...config.weights, [key]: +e.target.value / 100 };
                                            setConfig(c => ({ ...c, weights: newWeights }));
                                        }}
                                        className="w-full h-1.5 accent-blue-600 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 italic">ℹ️ Weights should ideally sum to 1.0 (100%) for consistency with confidence scores.</p>
                    </div>

                    <div className="mt-8 p-4 bg-slate-100 rounded-lg flex flex-wrap justify-between items-center gap-4">
                        <div className="text-xs text-slate-600 max-w-md">
                            <p className="font-bold text-slate-700">Apply Changes to Existing Reports</p>
                            <p>Standard matching happens only when a report is created. Use "Re-scan All" to apply your new thresholds and weights across all active matches.</p>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                                setReScanLoading(true);
                                try {
                                    await api.post('/api/matches/rescan');
                                    showSuccess('Re-scan complete! Matches updated.');
                                    fetchMatches(1, { status: filterStatus === 'ALL' ? undefined : filterStatus });
                                } catch (err: unknown) {
                                    showError(getErrorMessage(err));
                                }
                                setReScanLoading(false);
                            }}
                            disabled={reScanLoading}
                            className="flex items-center gap-2"
                        >
                            {reScanLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            Re-scan All
                        </Button>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowConfig(false)} disabled={configLoading}>Cancel</Button>
                        <Button onClick={saveConfig} disabled={configLoading} className="min-w-[100px]">
                            {configLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : configSaved ? <Check className="h-4 w-4" /> : 'Save Config'}
                        </Button>
                    </div>
                </Card>
            )}

            <div className="grid gap-6">
                {matches.map((match) => (
                    <MatchCard key={match._id} match={match} onAction={handleStatusChange} />
                ))}
                {matches.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No matches found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
};

/** Score breakdown bar component */
/** Score breakdown bar component showing point contributions */
const ScoreBar: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'bg-blue-400' }) => (
    <div className="flex items-center gap-2 text-xs">
        <span className="w-16 text-slate-500 text-right shrink-0">{label}</span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, (value / 50) * 100)}%` }} />
        </div>
        <span className="w-10 text-slate-600 font-bold shrink-0 text-right">+{value.toFixed(1)}</span>
    </div>
);

const MatchCard: React.FC<{ match: Match; onAction: (status: 'CONFIRMED' | 'REJECTED', id: string) => void }> = ({ match, onAction }) => {
    const { itemId, lostReportId, confidenceScore, status } = match;
    const [showBreakdown, setShowBreakdown] = useState(false);

    const getScoreColor = (score: number): "success" | "warning" | "default" => {
        if (score >= 85) return 'success';
        if (score >= 30) return 'warning';
        return 'default';
    };

    const scoreColorBar = (score: number) => {
        if (score >= 85) return 'bg-green-400';
        if (score >= 30) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    return (
        <Card className="overflow-hidden border-2 hover:border-blue-200 transition-colors">
            <div className="bg-slate-50 border-b pb-4 p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-lg">Match Found</h3>
                            <Badge variant={getScoreColor(confidenceScore)}>
                                {confidenceScore}/100 Confidence
                            </Badge>
                            {status !== 'PENDING' && (
                                <Badge variant={(status === 'CONFIRMED' || (status as string) === 'AUTO_CONFIRMED') ? 'success' : 'danger'}>
                                    {(status as string).replace('_', ' ')}
                                </Badge>
                            )}
                            {(status as string) === 'AUTO_CONFIRMED' && (
                                <span className="text-xs text-green-600 font-medium">⚡ Auto-confirmed</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">Created {format(new Date(match.createdAt), 'PPP p')}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                        {status === 'PENDING' && (
                            <>
                                <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" onClick={() => onAction('CONFIRMED', match._id)}>
                                    <Check className="w-4 h-4 mr-1" /> Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => onAction('REJECTED', match._id)}>
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </Button>
                            </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setShowBreakdown(v => !v)}>
                            {showBreakdown ? 'Hide' : 'Score Details'}
                        </Button>
                    </div>
                </div>

                {/* Score breakdown */}
                {showBreakdown && (
                    <div className="mt-3 p-3 bg-white rounded-md border space-y-1.5">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Score Breakdown</p>
                        <ScoreBar label="Category" value={match.categoryScore ?? 0} color={scoreColorBar(match.categoryScore ?? 0)} />
                        <ScoreBar label="Keywords" value={match.keywordScore ?? 0} color={scoreColorBar(match.keywordScore ?? 0)} />
                        <ScoreBar label="Date" value={match.dateScore ?? 0} color={scoreColorBar(match.dateScore ?? 0)} />
                        <ScoreBar label="Location" value={match.locationScore ?? 0} color={scoreColorBar(match.locationScore ?? 0)} />
                        <ScoreBar label="Features" value={match.featureScore ?? 0} color={scoreColorBar(match.featureScore ?? 0)} />
                        <ScoreBar label="Color" value={match.colorScore ?? 0} color={scoreColorBar(match.colorScore ?? 0)} />
                        <div className="border-t pt-1.5 mt-1">
                            <ScoreBar label="Total" value={confidenceScore} color={scoreColorBar(confidenceScore)} />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                {/* Found Item Side */}
                <div className="p-4 space-y-3 bg-white">
                    {itemId ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase text-blue-600 tracking-wider">Found Item</span>
                                <Badge variant="default">{itemId.category}</Badge>
                            </div>
                            <h3 className="font-medium text-lg text-slate-900">{itemId.description}</h3>
                            <div className="text-sm text-slate-600 grid gap-1">
                                <div>📍 {itemId.locationFound}</div>
                                <div>📅 {format(new Date(itemId.dateFound), 'PPP')}</div>
                            </div>
                            {itemId.photos && itemId.photos.length > 0 && (
                                <img
                                    src={`http://localhost:5000/${itemId.photos[0].path}`}
                                    alt="Item"
                                    className="w-full h-32 object-cover rounded-md mt-2 border"
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                            <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">Item Not Found</p>
                            <p className="text-[10px] mt-1 italic">This item may have been deleted.</p>
                        </div>
                    )}
                </div>

                {/* Lost Report Side */}
                <div className="p-4 space-y-3 bg-slate-50/50">
                    {lostReportId ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase text-amber-600 tracking-wider">Lost Report</span>
                                <Badge variant="default">{lostReportId.category}</Badge>
                            </div>
                            <h3 className="font-medium text-lg text-slate-900">{lostReportId.description}</h3>
                            <div className="text-sm text-slate-600 grid gap-1">
                                <div>📍 {lostReportId.locationLost}</div>
                                <div>📅 {format(new Date(lostReportId.dateLost), 'PPP')}</div>
                            </div>
                            <div className="mt-4 text-xs text-slate-500 pt-2 border-t">
                                Contact: {lostReportId.contactEmail}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                            <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">Report Not Found</p>
                            <p className="text-[10px] mt-1 italic">The report may have been withdrawn.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default MatchingDashboard;
