import { analyticsService } from '@services/analytics.service';
import { getErrorMessage } from '@utils/errors';

export async function analyticsLoader() {
  try {
    const [metricsRes, trendsRes, workloadRes, accuracyRes] = await Promise.all([
      analyticsService.getDashboard(),
      analyticsService.getTrends(),
      analyticsService.getStaffWorkload(),
      analyticsService.getPredictionAccuracy(),
    ]);


    let paymentAnalytics = null;
    try {
      const payRes = await analyticsService.getPaymentAnalytics();
      paymentAnalytics = payRes.data;
    } catch {
    }

    return {
      metrics: metricsRes.data,
      trends: trendsRes.data,
      workload: workloadRes.data,
      accuracy: accuracyRes.data,
      paymentAnalytics,
      error: null,
    };
  } catch (error: unknown) {
    console.error('Failed to load analytics:', error);
    return {
      metrics: null,
      trends: [],
      workload: null,
      accuracy: null,
      paymentAnalytics: null,
      error: getErrorMessage(error),
    };
  }
}
