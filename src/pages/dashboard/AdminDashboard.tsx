
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/dashboard/StatsCard';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Users, CreditCard, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  
  // Sample data for stats
  const userStats = {
    total: 1205,
    growth: 12.5,
    newUsers: 124,
    activeUsers: 982
  };
  
  const revenueStats = {
    total: 47250,
    growth: 8.2,
    transactions: 432,
    averageValue: 109.38
  };

  // Sample data for charts
  const serviceUsageData = [
    { name: 'Cleaning', value: 125 },
    { name: 'Repair', value: 86 },
    { name: 'Plumbing', value: 103 },
    { name: 'Electrical', value: 72 },
    { name: 'Moving', value: 53 },
    { name: 'Others', value: 118 },
  ];
  
  const revenueData = [
    { name: 'Jan', value: 4200 },
    { name: 'Feb', value: 3800 },
    { name: 'Mar', value: 5100 },
    { name: 'Apr', value: 5800 },
    { name: 'May', value: 7200 },
    { name: 'Jun', value: 6800 },
    { name: 'Jul', value: 7800 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setTimeRange('7d')} className={timeRange === '7d' ? 'bg-primary/10' : ''}>
              7d
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTimeRange('30d')} className={timeRange === '30d' ? 'bg-primary/10' : ''}>
              30d
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTimeRange('90d')} className={timeRange === '90d' ? 'bg-primary/10' : ''}>
              90d
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Users"
                value={userStats.total.toString()}
                icon={<Users className="h-4 w-4" />}
                trend="up"
                percentage={`+${userStats.growth}%`}
                description="vs. previous period"
              />
              <StatsCard
                title="Active Providers"
                value="287"
                icon={<Users className="h-4 w-4" />}
                trend="up"
                percentage="+4.3%"
                description="vs. previous period"
              />
              <StatsCard
                title="Total Revenue"
                value={`$${revenueStats.total}`}
                icon={<DollarSign className="h-4 w-4" />}
                trend="up"
                percentage={`+${revenueStats.growth}%`}
                description="vs. previous period"
              />
              <StatsCard
                title="Successful Bookings"
                value="954"
                icon={<Activity className="h-4 w-4" />}
                trend="neutral"
                description="This month"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <LineChart data={revenueData} height={300} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Service Usage</CardTitle>
                  <CardDescription>Distribution of service categories</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <PieChart data={serviceUsageData} height={300} />
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-normal">Recent Activities</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <span onClick={() => alert('View all activities')}>View all</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                        <div className="flex-1">
                          <p className="text-sm">
                            {['New service created', 'Booking completed', 'New user registered', 'Payment processed', 'Dispute resolved'][i]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {['2 minutes ago', '15 minutes ago', '1 hour ago', '3 hours ago', '5 hours ago'][i]}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <span onClick={() => alert('View details')}>View</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Management</CardTitle>
                <CardDescription>Manage all services on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Top Performing Services</h3>
                    <Button size="sm">Add New Service</Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 bg-muted p-3 rounded-t-md font-medium text-sm">
                      <div>Service Name</div>
                      <div>Provider</div>
                      <div>Bookings</div>
                      <div>Rating</div>
                    </div>
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="grid grid-cols-4 p-3 border-t">
                        <div className="font-medium">Service {i+1}</div>
                        <div>Provider {i+1}</div>
                        <div>{Math.floor(Math.random() * 100)}</div>
                        <div>⭐ {(3 + Math.random() * 2).toFixed(1)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Detailed breakdown of platform revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={[
                  { name: 'Jan', value: 4200 },
                  { name: 'Feb', value: 3800 },
                  { name: 'Mar', value: 5100 },
                  { name: 'Apr', value: 5800 },
                  { name: 'May', value: 7200 },
                  { name: 'Jun', value: 6800 },
                  { name: 'Jul', value: 7800 },
                ]} height={350} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Recent Users</h3>
                    <Button size="sm">Add User</Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 bg-muted p-3 rounded-t-md font-medium text-sm">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Role</div>
                      <div>Joined</div>
                      <div>Actions</div>
                    </div>
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="grid grid-cols-5 p-3 border-t">
                        <div className="font-medium">User {i+1}</div>
                        <div>user{i+1}@example.com</div>
                        <div>{['Customer', 'Provider', 'Admin', 'Customer', 'Provider'][i]}</div>
                        <div>{['2 days ago', '1 week ago', '2 weeks ago', '1 month ago', '2 months ago'][i]}</div>
                        <div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
