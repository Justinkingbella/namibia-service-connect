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

export interface DashboardOverview {
  totalUsers: number;
  userGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  completedBookings: number;
  bookingGrowth: number;
  activeDisputes: number;
  topServiceCategories: {
    categoryId: string;
    categoryName: string;
    bookingCount: number;
    growth: number;
  }[];
  topRegions: {
    region: string;
    bookingCount: number;
    revenue: number;
  }[];
  recentActivities: {
    id: string;
    type: 'booking' | 'registration' | 'payment' | 'dispute' | 'review';
    description: string;
    timestamp: string;
    user?: {
      id: string;
      name: string;
      role: string;
    };
  }[];
}

export interface AdminAnalyticsDashboard {
  overview: {
    userMetrics: {
      totalUsers: number;
      newUsers: number;
      userGrowth: number;
      totalProviders: number;
      totalCustomers: number;
    };
    bookingMetrics: {
      totalBookings: number;
      completedBookings: number;
      cancelledBookings: number;
      pendingBookings: number;
      bookingGrowth: number;
    };
    financialMetrics: {
      totalRevenue: number;
      revenueGrowth: number;
      platformCommissions: number;
      pendingPayouts: number;
      averageBookingValue: number;
    };
    serviceMetrics: {
      totalServices: number;
      activeServices: number;
      averageRating: number;
      topCategories: {
        categoryId: string;
        categoryName: string;
        serviceCount: number;
        bookingCount: number;
      }[];
    };
  };
  charts: {
    userRegistrations: TimeSeriesData[];
    bookingsTrend: TimeSeriesData[];
    revenueTrend: TimeSeriesData[];
    serviceDistribution: {
      categoryId: string;
      categoryName: string;
      percentage: number;
    }[];
  };
  recentActivity: {
    id: string;
    type: 'booking' | 'registration' | 'payout' | 'dispute' | 'review';
    description: string;
    timestamp: string;
    user?: {
      id: string;
      name: string;
      role: string;
    };
  }[];
}

export interface PerformanceReport {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  userMetrics: {
    newUsers: number;
    activeUsers: number;
    userRetentionRate: number;
    userConversionRate: number;
  };
  bookingMetrics: {
    newBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    bookingCompletionRate: number;
    averageBookingValue: number;
  };
  financialMetrics: {
    revenue: number;
    platformCommissions: number;
    payouts: number;
    processingFees: number;
    netProfit: number;
  };
  comparisonWithPreviousPeriod: {
    userGrowth: number;
    revenueGrowth: number;
    bookingGrowth: number;
    profitGrowth: number;
  };
}

export interface ServiceCategoryAnalytics {
  categoryId: string;
  categoryName: string;
  metrics: {
    totalServices: number;
    activeServices: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averageRating: number;
    averagePrice: number;
  };
  trend: {
    bookings: TimeSeriesData[];
    revenue: TimeSeriesData[];
  };
  topServices: {
    serviceId: string;
    serviceName: string;
    bookingCount: number;
    revenue: number;
    rating: number;
  }[];
  topProviders: {
    providerId: string;
    providerName: string;
    serviceCount: number;
    bookingCount: number;
    revenue: number;
    rating: number;
  }[];
}
