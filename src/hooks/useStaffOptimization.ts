import { useMemo } from 'react';
import { StaffWorkload } from '../types/analytics.types';

export const useStaffOptimization = (workload: StaffWorkload | null) => {
    const chartData = useMemo(() => {
        if (!workload) return [];
        
        // Merge intake and claims by hour
        const hours = Array.from({ length: 24 }, (_, i) => i);
        return hours.map(hour => {
            const intake = workload.intake.find(d => d.hour === hour)?.intakeCount || 0;
            const claims = workload.claims.find(d => d.hour === hour)?.claimCount || 0;
            return {
                hour: `${hour}:00`,
                intake,
                claims,
                total: intake + claims
            };
        });
    }, [workload]);

    const hasData = useMemo(() => {
        return chartData.some(d => d.total > 0);
    }, [chartData]);

    const peakHour = useMemo(() => {
        if (!hasData) return null;
        return [...chartData].sort((a, b) => b.total - a.total)[0];
    }, [chartData, hasData]);

    return {
        chartData,
        hasData,
        peakHour
    };
};
