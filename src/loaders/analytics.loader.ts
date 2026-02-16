import { analyticsService } from '@services/analytics.service';
import { getErrorMessage } from '@utils/errors';

export async function analyticsLoader() {
  try {
    const [metricsRes, trendsRes] = await Promise.all([
      analyticsService.getDashboard(),
      analyticsService.getTrends(),
    ]);

    return {
      metrics: metricsRes.data,
      trends: trendsRes.data,
      error: null,
    };
  } catch (error: unknown) {
    console.error('Failed to load analytics:', error);
    return {
      metrics: null,
      trends: [],
      error: getErrorMessage(error),
    };
  }
}
