
export interface PlatformMetrics {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalAdmins: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalCommissions: number;
  disputeCount: number;
  activeDisputes: number;
  resolutionRate: number;
  averageRating: number;
  userGrowthRate: number;
  bookingGrowthRate: number;
  revenueGrowthRate: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface CategoryMetrics {
  categoryId: string;
  categoryName: string;
  bookingCount: number;
  revenue: number;
  providerCount: number;
  averageRating: number;
}

export interface RegionalMetrics {
  region: string;
  userCount: number;
  providerCount: number;
  bookingCount: number;
  revenue: number;
  demandScore: number;
}

export interface ProviderMetrics {
  providerId: string;
  businessName: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  commissionsCharged: number;
  averageRating: number;
  customerRetentionRate: number;
  disputeCount: number;
}

export interface FinancialMetrics {
  period: string;
  totalRevenue: number;
  platformCommissions: number;
  transactionFees: number;
  subscriptionRevenue: number;
  adRevenue: number;
  operationalCosts: number;
  netProfit: number;
}

export interface UserActivityMetrics {
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  newUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  churnRate: {
    providers: number;
    customers: number;
  };
  sessionData: {
    averageDuration: number;
    bounceRate: number;
    pageViews: number;
  };
}

export interface MetricsTimeframe {
  range: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  endDate?: string;
  comparisonPeriod?: boolean;
}

export interface AnalyticsDashboardState {
  timeframe: MetricsTimeframe;
  metrics: PlatformMetrics | null;
  isLoading: boolean;
  error: string | null;
}
