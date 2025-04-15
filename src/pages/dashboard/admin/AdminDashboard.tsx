import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardSkeleton } from '@/components/skeletons/AdminDashboardSkeleton';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalCustomers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activeDisputes: 0,
  });

  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch basic stats
      const { data: usersCount } = await supabase
        .from('profiles')
        .select('count', { count: 'exact' });

      const { data: providersCount } = await supabase
        .from('service_providers')
        .select('count', { count: 'exact' });

      const { data: customersCount } = await supabase
        .from('customers')
        .select('count', { count: 'exact' });

      const { data: servicesCount } = await supabase
        .from('services')
        .select('count', { count: 'exact' });

      const { data: bookingsCount } = await supabase
        .from('bookings')
        .select('count', { count: 'exact' });

      const { data: pendingVerificationsCount } = await supabase
        .from('service_providers')
        .select('count', { count: 'exact' })
        .eq('verification_status', 'pending');

      const { data: disputesCount } = await supabase
        .from('disputes')
        .select('count', { count: 'exact' })
        .eq('status', 'open');

      // Fetch revenue data
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_amount, created_at')
        .order('created_at', { ascending: true });

      // Fetch user growth data
      const { data: userGrowthData } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      // Fetch category distribution
      const { data: categoryData } = await supabase
        .from('services')
        .select('category');

      // Process the data
      const totalRevenue = revenueData?.reduce((sum, booking) => sum + parseFloat(booking.total_amount || 0), 0) || 0;

      // Process category data
      const categoryCount = {};
      categoryData?.forEach(service => {
        if (service.category) {
          categoryCount[service.category] = (categoryCount[service.category] || 0) + 1;
        }
      });

      const formattedCategoryData = Object.keys(categoryCount).map(category => ({
        name: category,
        value: categoryCount[category],
      }));

      // Update state
      setStats({
        totalUsers: usersCount?.count || 0,
        totalProviders: providersCount?.count || 0,
        totalCustomers: customersCount?.count || 0,
        totalServices: servicesCount?.count || 0,
        totalBookings: bookingsCount?.count || 0,
        totalRevenue,
        pendingVerifications: pendingVerificationsCount?.count || 0,
        activeDisputes: disputesCount?.count || 0,
      });

      setCategoryData(formattedCategoryData);

      // Process monthly data for charts
      // This is simplified - in a real app you'd want to aggregate by month properly
      setUserGrowth(processMonthlyData(userGrowthData || []));
      setRevenueData(processRevenueData(revenueData || []));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatValue = (value: any): number => {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      return parseFloat(value) || 0; // Convert string to number or use 0 if it can't be converted
    }
    return 0;
  };

  const processMonthlyData = (data) => {
    const months = {};
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      months[monthYear] = (months[monthYear] || 0) + 1;
    });

    return Object.keys(months).map(month => ({
      name: month,
      users: months[month],
    }));
  };

  const processRevenueData = (data) => {
    const months = {};
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      months[monthYear] = (months[monthYear] || 0) + parseFloat(item.total_amount || 0);
    });

    return Object.keys(months).map(month => ({
      name: month,
      revenue: months[month],
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
          {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalProviders} providers, {stats.totalCustomers} customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userGrowth}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monthly revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Categories</CardTitle>
            <CardDescription>Distribution of services by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Pending Provider Verifications</h3>
                  <p className="text-sm text-muted-foreground">{stats.pendingVerifications} providers awaiting verification</p>
                </div>
                <Button onClick={() => navigate('/admin/verifications')}>View</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Active Disputes</h3>
                  <p className="text-sm text-muted-foreground">{stats.activeDisputes} disputes need resolution</p>
                </div>
                <Button onClick={() => navigate('/admin/disputes')}>View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="services">Service Management</TabsTrigger>
          <TabsTrigger value="bookings">Booking Management</TabsTrigger>
          <TabsTrigger value="payments">Payment Management</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users, providers, and customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/admin/users')}>View All Users</Button>
              <Button onClick={() => navigate('/admin/providers')} variant="outline">Manage Providers</Button>
              <Button onClick={() => navigate('/admin/customers')} variant="outline">Manage Customers</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Management</CardTitle>
              <CardDescription>Manage services and categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/admin/services')}>View All Services</Button>
              <Button onClick={() => navigate('/admin/categories')} variant="outline">Manage Categories</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>Manage bookings and disputes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/admin/bookings')}>View All Bookings</Button>
              <Button onClick={() => navigate('/admin/disputes')} variant="outline">Manage Disputes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>Manage payments and transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/admin/payments')}>View All Payments</Button>
              <Button onClick={() => navigate('/admin/payouts')} variant="outline">Manage Payouts</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
