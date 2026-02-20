import { useState, useEffect } from 'react';
import { useMatches } from '../hooks/useMatches';
import Button from '../components/ui/Button';
import { Loader2, Settings, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useMatchingDashboardConfig } from '../hooks/useMatchingDashboardConfig';
import { ComponentErrorBoundary } from '@components/feedback';
import { useDebounce } from '../hooks/useDebounce';

// Sub-components
import MatchingConfigPanel from '@components/analytics/matching/MatchingConfigPanel';
import MatchCard from '@components/analytics/matching/MatchCard';

const MatchingDashboard = () => {
    const { matches, loading, updateMatchStatus, fetchMatches } = useMatches();
    const [filterStatus, setFilterStatus] = useState<string>('PENDING');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const {
        config,
        setConfig,
        showConfig,
        setShowConfig,
        configLoading,
        configSaved,
        reScanLoading,
        toggleConfig,
        saveConfig,
        reScanAll
    } = useMatchingDashboardConfig(fetchMatches, filterStatus);

    // Initial and filtered fetch
    useEffect(() => {
        fetchMatches(1, { 
            status: filterStatus === 'ALL' ? undefined : filterStatus,
            search: debouncedSearch || undefined 
        });
    }, [filterStatus, debouncedSearch, fetchMatches]);

    const handleStatusChange = (status: 'CONFIRMED' | 'REJECTED', id: string) => {
        updateMatchStatus(id, status);
    };

    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
    };

    if (loading && matches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">Syncing matches...</p>
            </div>
        );
    }

    return (
        <ComponentErrorBoundary title="Matching Dashboard Error">
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Matching Dashboard</h1>
                            <p className="text-gray-500 text-sm mt-1">Review and manage AI-generated item matches</p>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={toggleConfig} 
                            className={`flex items-center gap-2 rounded-2xl px-5 py-2 h-auto text-xs border-gray-200 hover:bg-white hover:border-gray-300 transition-all ${showConfig ? 'bg-white border-blue-200 ring-2 ring-blue-500/10' : 'bg-gray-50'}`}
                        >
                            <Settings className={`w-3.5 h-3.5 ${showConfig ? 'text-blue-500 animate-spin-slow' : 'text-gray-500'}`} />
                            <span className="font-bold uppercase tracking-wider">Configure Engine</span>
                            {showConfig ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-3xl border border-gray-100 shadow-sm">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by description or keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center p-1 bg-gray-200/50 rounded-2xl border border-gray-200/50 shadow-inner">
                            {['PENDING', 'CONFIRMED', 'REJECTED', 'AUTO_CONFIRMED', 'ALL'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleFilterChange(status)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                                        filterStatus === status 
                                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200" 
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                    }`}
                                >
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live config panel for Admin */}
                <MatchingConfigPanel 
                    showConfig={showConfig}
                    config={config}
                    setConfig={setConfig}
                    configLoading={configLoading}
                    configSaved={configSaved}
                    reScanLoading={reScanLoading}
                    saveConfig={saveConfig}
                    reScanAll={reScanAll}
                    setShowConfig={setShowConfig}
                />

                <div className="grid gap-6">
                    {matches.map((match) => (
                        <MatchCard key={match._id} match={match} onAction={handleStatusChange} />
                    ))}
                    {!loading && matches.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm ring-1 ring-gray-200/50">
                            <div className="max-w-xs mx-auto space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-white shadow-inner">
                                    <Search className="w-8 h-8 text-gray-200" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-900 font-bold text-lg">No matches found</p>
                                    <p className="text-gray-500 text-sm leading-relaxed px-4">
                                        We couldn't find any matches for <strong>{filterStatus.toLowerCase().replace('_', ' ')}</strong>
                                        {searchTerm ? ` matching "${searchTerm}"` : ''}.
                                    </p>
                                </div>
                                {(searchTerm || filterStatus !== 'PENDING') && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xl border-gray-200"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterStatus('PENDING');
                                        }}
                                    >
                                        Clear all filters
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ComponentErrorBoundary>
    );
};

export default MatchingDashboard;
