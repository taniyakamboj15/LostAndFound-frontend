import { useState, useEffect, useCallback, useMemo } from 'react';
import { getErrorMessage } from '@utils/errors';
import { analyticsService } from '@services/analytics.service';
import { useToast } from './useToast';
import { useAuth } from './useAuth';
import type { AnalyticsMetrics, TrendDataPoint } from '../types';

export const useAnalytics = () => {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!isAdmin()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const [metricsRes, trendsRes] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getTrends(),
      ]);
      setMetrics(metricsRes.data);
      setTrends(trendsRes.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return useMemo(() => ({
    metrics,
    trends,
    isLoading,
    error,
    refresh: fetchAnalytics,
  }), [metrics, trends, isLoading, error, fetchAnalytics]);
};
