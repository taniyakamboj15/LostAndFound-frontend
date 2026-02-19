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
  pendingReviewClaims: number;
  readyForHandoverClaims: number;
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
  paymentAnalytics: PaymentAnalytics | null;
  error: string | null;
}

// ─── Payment Analytics Types ────────────────────────────────────────────

export interface MonthlyRevenue {
  month: string;     // "YYYY-MM"
  revenue: number;
  count: number;
}

export interface TopPayingUser {
  userId: string;
  name: string;
  email: string;
  totalPaid: number;
  claimCount: number;
}

export interface RecentPayment {
  claimId: string;
  claimantName: string;
  claimantEmail: string;
  amount: number;
  paidAt: string | Date;
  itemDescription: string;
}

export interface PaymentAnalytics {
  totalRevenue: number;
  totalPaidClaims: number;
  totalPendingPaymentClaims: number;
  averageFee: number;
  revenueByMonth: MonthlyRevenue[];
  topPayingUsers: TopPayingUser[];
  recentPayments: RecentPayment[];
}

export interface PaymentAnalyticsResponse {
  success: boolean;
  data: PaymentAnalytics;
}
