import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './useToast';
import { getErrorMessage } from '../utils/errors';
import { MatchingConfig } from '@app-types/analytics.types';

export const useMatchingDashboardConfig = (
    fetchMatches: (page: number, filters: { status?: string }) => void, 
    filterStatus: string
) => {
    const { success: showSuccess, error: showError } = useToast();
    const [showConfig, setShowConfig] = useState(false);
    const [config, setConfig] = useState<MatchingConfig>({ 
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

    const toggleConfig = async () => {
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
            showSuccess('Match configuration saved!');
            setTimeout(() => setConfigSaved(false), 2000);
        } catch (err: unknown) {
            showError(getErrorMessage(err));
        }
        setConfigLoading(false);
    };

    const reScanAll = async () => {
        setReScanLoading(true);
        try {
            await api.post('/api/matches/rescan');
            showSuccess('Re-scan complete! Matches updated.');
            // Refresh with current filters
            fetchMatches(1, { status: filterStatus === 'ALL' ? undefined : filterStatus });
        } catch (err: unknown) {
            showError(getErrorMessage(err));
        }
        setReScanLoading(false);
    };

    return {
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
    };
};
