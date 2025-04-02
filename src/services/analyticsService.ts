
import { 
  PlatformMetrics, 
  TimeSeriesData, 
  CategoryMetrics, 
  RegionalMetrics,
  ProviderMetrics,
  FinancialMetrics,
  UserActivityMetrics,
  MetricsTimeframe
} from '@/types/analytics';

// Mock data implementation
export const getPlatformMetrics = async (timeframe: MetricsTimeframe): Promise<PlatformMetrics> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching platform metrics with timeframe:', timeframe);
  
  // Mock data
  return {
    totalUsers: 2456,
    totalProviders: 342,
    totalCustomers: 2102,
    totalAdmins: 12,
    totalBookings: 4238,
    completedBookings: 1287,
    cancelledBookings: 253,
    pendingBookings: 118,
    totalRevenue: 124350,
    totalCommissions: 18652,
    disputeCount: 78,
    activeDisputes: 5,
    resolutionRate: 0.94,
    averageRating: 4.7,
    userGrowthRate: 0.08,
    bookingGrowthRate: 0.05,
    revenueGrowthRate: 0.12
  };
};

export const getRevenueTimeSeries = async (timeframe: MetricsTimeframe): Promise<TimeSeriesData[]> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching revenue time series with timeframe:', timeframe);
  
  // Mock data - 12 months of revenue data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => ({
    date: month,
    value: 8000 + Math.floor(Math.random() * 4000) + (index * 500)
  }));
};

export const getBookingsTimeSeries = async (timeframe: MetricsTimeframe): Promise<TimeSeriesData[]> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching bookings time series with timeframe:', timeframe);
  
  // Mock data - 12 months of booking data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month) => ({
    date: month,
    value: 250 + Math.floor(Math.random() * 150)
  }));
};

export const getUsersTimeSeries = async (timeframe: MetricsTimeframe): Promise<TimeSeriesData[]> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching users time series with timeframe:', timeframe);
  
  // Mock data - 12 months of user growth data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let accumulatedUsers = 1800;
  
  return months.map((month) => {
    const newUsers = 50 + Math.floor(Math.random() * 100);
    accumulatedUsers += newUsers;
    return {
      date: month,
      value: accumulatedUsers
    };
  });
};

export const getCategoryMetrics = async (timeframe: MetricsTimeframe): Promise<CategoryMetrics[]> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching category metrics with timeframe:', timeframe);
  
  // Mock data
  return [
    { categoryId: '1', categoryName: 'Home Services', bookingCount: 1245, revenue: 45680, providerCount: 87, averageRating: 4.8 },
    { categoryId: '2', categoryName: 'Transportation', bookingCount: 868, revenue: 32450, providerCount: 65, averageRating: 4.5 },
    { categoryId: '3', categoryName: 'Professional Services', bookingCount: 756, revenue: 28760, providerCount: 94, averageRating: 4.9 },
    { categoryId: '4', categoryName: 'Health & Wellness', bookingCount: 542, revenue: 18240, providerCount: 46, averageRating: 4.7 },
    { categoryId: '5', categoryName: 'Errands', bookingCount: 438, revenue: 12460, providerCount: 38, averageRating: 4.6 }
  ];
};

export const getRegionalMetrics = async (): Promise<RegionalMetrics[]> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching regional metrics');
  
  // Mock data
  return [
    { region: 'Windhoek', userCount: 1245, providerCount: 156, bookingCount: 2456, revenue: 78500, demandScore: 0.85 },
    { region: 'Swakopmund', userCount: 468, providerCount: 64, bookingCount: 856, revenue: 23400, demandScore: 0.72 },
    { region: 'Walvis Bay', userCount: 387, providerCount: 52, bookingCount: 678, revenue: 18900, demandScore: 0.68 },
    { region: 'Oshakati', userCount: 245, providerCount: 34, bookingCount: 423, revenue: 11500, demandScore: 0.56 },
    { region: 'Rundu', userCount: 178, providerCount: 22, bookingCount: 245, revenue: 6800, demandScore: 0.48 }
  ];
};

export const getTopProviders = async (timeframe: MetricsTimeframe): Promise<ProviderMetrics[]> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching top providers with timeframe:', timeframe);
  
  // Mock data
  return [
    { providerId: 'p1', businessName: 'CleanHome Pro', totalBookings: 145, completedBookings: 140, cancelledBookings: 5, totalEarnings: 12500, commissionsCharged: 1250, averageRating: 4.9, customerRetentionRate: 0.85, disputeCount: 1 },
    { providerId: 'p2', businessName: 'Swift Errands', totalBookings: 132, completedBookings: 128, cancelledBookings: 4, totalEarnings: 9800, commissionsCharged: 980, averageRating: 4.8, customerRetentionRate: 0.82, disputeCount: 2 },
    { providerId: 'p3', businessName: 'ElectriTech', totalBookings: 118, completedBookings: 115, cancelledBookings: 3, totalEarnings: 15600, commissionsCharged: 1560, averageRating: 4.7, customerRetentionRate: 0.78, disputeCount: 3 },
    { providerId: 'p4', businessName: 'Plumb Perfect', totalBookings: 98, completedBookings: 94, cancelledBookings: 4, totalEarnings: 14200, commissionsCharged: 1420, averageRating: 4.8, customerRetentionRate: 0.76, disputeCount: 1 },
    { providerId: 'p5', businessName: 'MoveIt Logistics', totalBookings: 87, completedBookings: 82, cancelledBookings: 5, totalEarnings: 18500, commissionsCharged: 1850, averageRating: 4.6, customerRetentionRate: 0.72, disputeCount: 2 }
  ];
};

export const getFinancialMetrics = async (timeframe: MetricsTimeframe): Promise<FinancialMetrics[]> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching financial metrics with timeframe:', timeframe);
  
  // Mock data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => {
    const totalRevenue = 20000 + (index * 1000) + Math.floor(Math.random() * 2000);
    const platformCommissions = Math.floor(totalRevenue * 0.15);
    const transactionFees = Math.floor(totalRevenue * 0.03);
    const subscriptionRevenue = 2000 + Math.floor(Math.random() * 500);
    const adRevenue = 1000 + Math.floor(Math.random() * 500);
    const operationalCosts = 5000 + Math.floor(Math.random() * 1000);
    
    return {
      period: month,
      totalRevenue,
      platformCommissions,
      transactionFees,
      subscriptionRevenue,
      adRevenue,
      operationalCosts,
      netProfit: totalRevenue - operationalCosts
    };
  });
};

export const getUserActivityMetrics = async (timeframe: MetricsTimeframe): Promise<UserActivityMetrics> => {
  // This would be fetched from an API in a real implementation
  console.log('Fetching user activity metrics with timeframe:', timeframe);
  
  // Mock data
  return {
    activeUsers: {
      daily: 350,
      weekly: 1200,
      monthly: 1850
    },
    newUsers: {
      daily: 25,
      weekly: 145,
      monthly: 480
    },
    churnRate: {
      providers: 0.05,
      customers: 0.08
    },
    sessionData: {
      averageDuration: 8.4, // minutes
      bounceRate: 0.25,
      pageViews: 4.7
    }
  };
};
