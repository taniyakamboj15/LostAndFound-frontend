import { analyticsService } from '@services/analytics.service';
import { getErrorMessage } from '@utils/errors';

export async function analyticsLoader() {
  try {
    const [metricsRes, trendsRes] = await Promise.all([
      analyticsService.getDashboard(),
      analyticsService.getTrends(),
    ]);


    let paymentAnalytics = null;
    try {
      const payRes = await analyticsService.getPaymentAnalytics();
      paymentAnalytics = payRes.data;
    } catch {
      // Non-admin users will get a 403 here
    }

    return {
      metrics: metricsRes.data,
      trends: trendsRes.data,
      paymentAnalytics,
      error: null,
    };
  } catch (error: unknown) {
    console.error('Failed to load analytics:', error);
    return {
      metrics: null,
      trends: [],
      paymentAnalytics: null,
      error: getErrorMessage(error),
    };
  }
}
