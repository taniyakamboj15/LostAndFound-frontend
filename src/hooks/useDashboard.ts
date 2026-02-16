import { useState, useEffect, useCallback, useMemo } from 'react';
import { getErrorMessage } from '@utils/errors';
import { analyticsService } from '@services/analytics.service';
import { itemService } from '@services/item.service';
import { useToast } from './useToast';
import { useAuth } from './useAuth';
import type { AnalyticsMetrics, Item } from '../types';

export const useDashboard = () => {
  const { isAuthenticated, isClaimant } = useAuth();
  const toast = useToast();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const metricsRes = await analyticsService.getDashboard();
      setMetrics(metricsRes.data);
      
      try {
        const itemsRes = isClaimant()
          ? await itemService.publicSearch({ limit: 5 })
          : await itemService.getItems({ limit: 5, sortBy: 'createdAt', order: 'desc' });
        
        // Type handling for public search vs My Items
        const items = itemsRes.data;
        // Ensure items is treated as Item[]
        setRecentItems(items as unknown as Item[]);
      } catch (itemErr) {
        console.error('Failed to fetch recent items:', itemErr);
        // Don't toast for items if metrics succeeded, just log it
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isClaimant, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return useMemo(() => ({
    metrics,
    recentItems,
    isLoading,
    error,
    refresh: fetchDashboardData,
  }), [metrics, recentItems, isLoading, error, fetchDashboardData]);
};
