
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { AreaChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Pie, Cell } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdvancedAnalytics from '@/components/admin/AdvancedAnalytics';
import PlatformAnalytics from '@/components/admin/PlatformAnalytics';
import StatsCard from '@/components/dashboard/StatsCard';
import RegionalDemandMap from '@/components/admin/RegionalDemandMap';

// Mock data
const RECENTUSERS = [
  { id: '1', name: 'Sarah Jacobs', email: 'sarah@example.com', role: 'provider', joinDate: '2023-03-21', status: 'active' },
  { id: '2', name: 'Michael Tendes', email: 'michael@example.com', role: 'customer', joinDate: '2023-03-20', status: 'active' },
  { id: '3', name: 'Aina Ngipandulwa', email: 'aina@example.com', role: 'provider', joinDate: '2023-03-19', status: 'pending' },
  { id: '4', name: 'Thomas Shilongo', email: 'thomas@example.com', role: 'customer', joinDate: '2023-03-18', status: 'active' },
];

const RECENTBOOKINGS = [
  { id: 'B1001', service: 'Home Cleaning', customer: 'Michael Tendes', provider: 'Sarah Jacobs', date: '2023-03-21', status: 'completed', amount: 350 },
  { id: 'B1002', service: 'Plumbing Repair', customer: 'Thomas Shilongo', provider: 'Aina Ngipandulwa', date: '2023-03-20', status: 'confirmed', amount: 550 },
  { id: 'B1003', service: 'Moving Service', customer: 'Michael Tendes', provider: 'Sarah Jacobs', date: '2023-03-22', status: 'pending', amount: 1200 },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 15000, bookings: 120, providers: 30 },
  { month: 'Feb', revenue: 18000, bookings: 140, providers: 32 },
  { month: 'Mar', revenue: 22000, bookings: 170, providers: 35 },
  { month: 'Apr', revenue: 25000, bookings: 190, providers: 37 },
  { month: 'May', revenue: 28000, bookings: 220, providers: 40 },
  { month: 'Jun', revenue: 32000, bookings: 250, providers: 43 },
];

const CATEGORIES_DATA = [
  { name: 'Cleaning', value: 35 },
  { name: 'Repair', value: 25 },
  { name: 'Moving', value: 15 },
  { name: 'Professional', value: 10 },
  { name: 'Others', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const OverviewTab = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(75200)}
        description="+20.1% from last month"
        positive
      />
      <StatsCard
        title="Active Users"
        value={formatNumber(1542)}
        description="+12% from last month"
        positive
      />
      <StatsCard
        title="Total Bookings"
        value={formatNumber(842)}
        description="+5.4% from last month"
        positive
      />
      <StatsCard
        title="Active Providers"
        value={formatNumber(85)}
        description="-2.3% from last month"
        positive={false}
      />
      
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'Revenue']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Bookings by Category</CardTitle>
          <CardDescription>Distribution of services booked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORIES_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {CATEGORIES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest transactions across the platform</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/bookings">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">ID</th>
                  <th className="py-3 text-left">Service</th>
                  <th className="py-3 text-left">Customer</th>
                  <th className="py-3 text-left">Provider</th>
                  <th className="py-3 text-left">Date</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-left">Amount</th>
                  <th className="py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {RECENTBOOKINGS.map((booking) => (
                  <tr key={booking.id} className="border-b">
                    <td className="py-3 text-muted-foreground">{booking.id}</td>
                    <td className="py-3">{booking.service}</td>
                    <td className="py-3">{booking.customer}</td>
                    <td className="py-3">{booking.provider}</td>
                    <td className="py-3 text-muted-foreground">{booking.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'confirmed' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3">{formatCurrency(booking.amount)}</td>
                    <td className="py-3">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>New Users</CardTitle>
            <CardDescription>Recently joined platform users</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Name</th>
                  <th className="py-3 text-left">Email</th>
                  <th className="py-3 text-left">Role</th>
                  <th className="py-3 text-left">Join Date</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {RECENTUSERS.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">{user.name}</td>
                    <td className="py-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3 capitalize">{user.role}</td>
                    <td className="py-3 text-muted-foreground">{user.joinDate}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the admin dashboard, manage and monitor the platform.</p>
          </div>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-background">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="regional">Regional Data</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-8">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6 space-y-8">
            <PlatformAnalytics />
          </TabsContent>

          <TabsContent value="regional" className="mt-6 space-y-8">
            <RegionalDemandMap />
          </TabsContent>

          <TabsContent value="advanced" className="mt-6 space-y-8">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
