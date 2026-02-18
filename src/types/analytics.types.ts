import { ItemCategory } from '@constants/categories';

// Analytics Metrics
export interface AnalyticsMetrics {
  totalItemsFound: number;
  totalItemsClaimed: number;
  totalItemsReturned: number;
  totalItemsDisposed: number;
  matchSuccessRate: number;
  averageRecoveryTime: number;
  pendingClaims: number;
  expiringItems: number;
  categoryBreakdown: Record<ItemCategory, number>;
}

// Category Breakdown
export interface CategoryBreakdown {
  category: ItemCategory;
  count: number;
  percentage: number;
}

// Trend Data Point
export interface TrendDataPoint {
  date: string;
  found: number;
  claimed: number;
  returned: number;
}

// Disposition Stats
export interface DispositionStats {
  donated: number;
  auctioned: number;
  disposed: number;
  total: number;
}

// Analytics Response
export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsMetrics;
}

// Category Breakdown Response
export interface CategoryBreakdownResponse {
  success: boolean;
  data: CategoryBreakdown[];
}

// Trends Response
export interface TrendsResponse {
  success: boolean;
  data: TrendDataPoint[];
}

// Disposition Stats Response
export interface DispositionStatsResponse {
  success: boolean;
  data: DispositionStats;
}

// Analytics Loader Data
export interface AnalyticsLoaderData {
  metrics: AnalyticsMetrics | null;
  trends: TrendDataPoint[];
  error: string | null;
}
