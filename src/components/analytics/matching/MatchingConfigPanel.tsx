import { Settings, Loader2, Check, Search } from 'lucide-react';
import { Card, Button, Badge } from '@components/ui';
import { MatchingConfig } from '@app-types/analytics.types';
import { X } from 'lucide-react';
interface MatchingConfigPanelProps {
    showConfig: boolean;
    config: MatchingConfig;
    setConfig: React.Dispatch<React.SetStateAction<MatchingConfig>>;
    configLoading: boolean;
    configSaved: boolean;
    reScanLoading: boolean;
    saveConfig: () => void;
    reScanAll: () => void;
    setShowConfig: (show: boolean) => void;
}

const MatchingConfigPanel = ({
    showConfig,
    config,
    setConfig,
    configLoading,
    configSaved,
    reScanLoading,
    saveConfig,
    reScanAll,
    setShowConfig
}: MatchingConfigPanelProps) => {
    if (!showConfig) return null;

    return (
        <Card className="p-6 mb-8 bg-white border-blue-100 shadow-xl shadow-blue-500/5 rounded-3xl ring-1 ring-blue-500/5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2.5 text-lg">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    Engine Configuration
                </h3>
                <button 
                    onClick={() => setShowConfig(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-gray-700">Auto-Confirm</label>
                        <span className="text-xs font-bold px-2 py-0.5 bg-green-50 text-green-700 rounded-lg ring-1 ring-green-500/20">{config.autoMatchThreshold}% Confidence</span>
                    </div>
                    <input type="range" min={50} max={99} value={config.autoMatchThreshold}
                        onChange={e => setConfig(c => ({ ...c, autoMatchThreshold: +e.target.value }))}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-500" />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                        Matches above this threshold are automatically confirmed and the reporter is notified immediately.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-gray-700">Reject Below</label>
                        <span className="text-xs font-bold px-2 py-0.5 bg-red-50 text-red-700 rounded-lg ring-1 ring-red-500/20">{config.rejectThreshold}% Confidence</span>
                    </div>
                    <input type="range" min={0} max={50} value={config.rejectThreshold}
                        onChange={e => setConfig(c => ({ ...c, rejectThreshold: +e.target.value }))}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                        Matches below this threshold are considered noise and are discarded from the dashboard.
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1 h-4 bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100 shadow-inner">
                        <div className="absolute left-0 top-0 h-full bg-red-200/50 transition-all duration-300" style={{ width: `${config.rejectThreshold}%` }} />
                        <div className="absolute top-0 h-full bg-yellow-100/50 transition-all duration-300" style={{ left: `${config.rejectThreshold}%`, width: `${config.autoMatchThreshold - config.rejectThreshold}%` }} />
                        <div className="absolute top-0 h-full bg-green-200/50 transition-all duration-300" style={{ left: `${config.autoMatchThreshold}%`, right: 0 }} />
                        
                        {/* Threshold Markers */}
                        <div className="absolute top-0 h-full w-0.5 bg-red-400 z-10" style={{ left: `${config.rejectThreshold}%` }} />
                        <div className="absolute top-0 h-full w-0.5 bg-green-400 z-10" style={{ left: `${config.autoMatchThreshold}%` }} />
                    </div>
                </div>
                <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" />Discard</span>
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-sm" />Manual Review</span>
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm" />Auto-Confirm</span>
                </div>
            </div>

            {/* Weight Sliders */}
            <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        Scoring Weights
                        <Badge variant="info" className="bg-blue-50 text-blue-700 border-blue-200 rounded-lg text-[10px]">
                            {Math.round(Object.values(config.weights).reduce((a, b) => a + b, 0) * 100)}% Total
                        </Badge>
                    </h4>
                    <p className="text-[10px] text-gray-400 italic">Weights should ideally sum to 100%</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {Object.entries(config.weights).map(([key, val]) => (
                        <div key={key} className="space-y-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:shadow-md hover:bg-white hover:border-blue-100 group">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-blue-500 transition-colors">
                                {key}
                            </label>
                            <div className="text-lg font-black text-gray-900">
                                {((val as number) * 100).toFixed(0)}%
                            </div>
                            <input 
                                type="range" min={0} max={100} value={(val as number) * 100}
                                onChange={e => {
                                    const newWeights = { ...config.weights, [key]: +e.target.value / 100 };
                                    setConfig(c => ({ ...c, weights: newWeights }));
                                }}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left flex-1">
                    <p className="font-black text-blue-900 text-sm">Force Global Re-scan</p>
                    <p className="text-blue-700/70 text-[11px] mt-1 leading-relaxed">
                        Update all existing matches with your new threshold and weight settings. 
                        This will re-calculate confidence scores for everything in the dashboard.
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={reScanAll}
                    disabled={reScanLoading}
                    className="flex items-center gap-2 px-8 py-3 h-auto rounded-2xl shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 border-none transition-all active:scale-95 whitespace-nowrap"
                >
                    {reScanLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Search className="w-4 h-4 text-white" />}
                    <span className="font-bold uppercase tracking-wider text-xs">Execute Re-scan</span>
                </Button>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <Button 
                    variant="outline" 
                    onClick={() => setShowConfig(false)} 
                    disabled={configLoading}
                    className="rounded-xl border-gray-200 font-bold text-gray-400 hover:text-gray-600"
                >
                    Discard Changes
                </Button>
                <Button 
                    onClick={saveConfig} 
                    disabled={configLoading} 
                    className={`min-w-[140px] rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95 ${configSaved ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-gray-900 hover:bg-black shadow-gray-900/20'}`}
                >
                    {configLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : configSaved ? <div className="flex items-center gap-2"><Check className="h-4 w-4" /> Saved</div> : 'Apply Config'}
                </Button>
            </div>
        </Card>
    );
};

export default MatchingConfigPanel;
