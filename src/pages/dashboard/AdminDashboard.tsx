
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Check, AlertTriangle, BarChart, Settings, CreditCard } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SettingsCard from '@/components/dashboard/SettingsCard';
import { Button } from '@/components/common/Button';
import UserManagement from '@/components/admin/UserManagement';
import ProviderVerification from '@/components/admin/ProviderVerification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data for pending approvals
  const pendingProviders = [
    {
      id: '1',
      name: 'Michael Plumbers',
      email: 'michael@example.com',
      category: 'Home Services',
      date: '2023-06-15',
      documents: 3
    },
    {
      id: '2',
      name: 'Swift Errands',
      email: 'swift@example.com',
      category: 'Errand Services',
      date: '2023-06-14',
      documents: 2
    },
    {
      id: '3',
      name: 'Eagle Security',
      email: 'security@example.com',
      category: 'Professional Services',
      date: '2023-06-13',
      documents: 4
    }
  ];

  // Mock data for recent disputes
  const recentDisputes = [
    {
      id: '1',
      customer: 'Sarah Johnson',
      provider: 'CleanHome Pro',
      service: 'Home Cleaning',
      amount: 450,
      reason: 'Service not completed',
      date: '2023-06-15'
    },
    {
      id: '2',
      customer: 'James Morris',
      provider: 'Plumb Perfect',
      service: 'Plumbing Repair',
      amount: 650,
      reason: 'Quality issues',
      date: '2023-06-14'
    }
  ];

  // Mock data for subscriptions
  const subscriptionStats = {
    totalSubscribers: 145,
    activeSubscriptions: 132,
    monthlyRevenue: 8750,
    popularPlan: "Professional"
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of platform performance and management tools.</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value="2,456"
            icon={Users}
            trend={{ value: 8, positive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Total Revenue"
            value="N$124,350"
            icon={DollarSign}
            trend={{ value: 12, positive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Completed Bookings"
            value="1,287"
            icon={Check}
            trend={{ value: 5, positive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Active Disputes"
            value="5"
            icon={AlertTriangle}
            description="Requiring resolution"
          />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-medium mb-6">Revenue Overview</h2>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-muted-foreground">Revenue chart will be displayed here</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-medium mb-6">Booking Analytics</h2>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-muted-foreground">Booking analytics chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pending Provider Approvals */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pending Provider Approvals</h2>
                <Button 
                  as="a"
                  onClick={() => navigate('/dashboard/admin/providers/verification')}
                  variant="outline" 
                  size="sm"
                >
                  View All
                </Button>
              </div>
              
              {/* Provider verification table preview */}
              <div className="max-h-[400px] overflow-hidden">
                <ProviderVerification />
              </div>
            </div>
            
            {/* Recent Disputes */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Disputes</h2>
                <Button as="a" href="/dashboard/disputes" variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parties
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentDisputes.map((dispute) => (
                      <tr key={dispute.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{dispute.customer}</div>
                          <div className="text-sm text-gray-500">vs. {dispute.provider}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{dispute.service}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">N${dispute.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{dispute.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{dispute.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Button size="xs" as="a" href={`/dashboard/disputes/${dispute.id}`}>
                            Resolve
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Subscription Overview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Subscription Overview</h2>
                <Button 
                  as="a"
                  onClick={() => navigate('/dashboard/admin/subscriptions')}
                  variant="outline" 
                  size="sm"
                >
                  Manage Subscriptions
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="text-sm text-muted-foreground">Total Subscribers</div>
                  <div className="text-2xl font-bold mt-1">{subscriptionStats.totalSubscribers}</div>
                </div>
                
                <div className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="text-sm text-muted-foreground">Active Subscriptions</div>
                  <div className="text-2xl font-bold mt-1">{subscriptionStats.activeSubscriptions}</div>
                </div>
                
                <div className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                  <div className="text-2xl font-bold mt-1">N${subscriptionStats.monthlyRevenue}</div>
                </div>
                
                <div className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="text-sm text-muted-foreground">Most Popular Plan</div>
                  <div className="text-2xl font-bold mt-1">{subscriptionStats.popularPlan}</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          {/* Providers Tab */}
          <TabsContent value="providers">
            <div className="space-y-6">
              <ProviderVerification />
            </div>
          </TabsContent>
          
          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Dispute Resolution</h2>
              <p className="text-muted-foreground">Handle disputes between customers and service providers.</p>
              <p className="text-sm text-muted-foreground mt-4">This feature is under development.</p>
            </div>
          </TabsContent>
          
          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Subscription Management</h2>
              <p className="text-muted-foreground mb-6">Create and manage subscription plans for service providers.</p>
              
              <Button onClick={() => navigate('/dashboard/admin/subscriptions')}>
                Manage Subscription Plans
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <SettingsCard
              title="Manage Users"
              description="View and manage all users"
              icon={<Users className="h-5 w-5" />}
              onClick={() => navigate('/dashboard/users')}
            />
            
            <SettingsCard
              title="Provider Verification"
              description="Review provider applications"
              onClick={() => navigate('/dashboard/admin/providers/verification')}
            />
            
            <SettingsCard
              title="Platform Analytics"
              description="View detailed platform metrics"
              icon={<BarChart className="h-5 w-5" />}
              onClick={() => navigate('/dashboard/admin/analytics')}
            />
            
            <SettingsCard
              title="Subscription Plans"
              description="Manage service subscription plans"
              icon={<CreditCard className="h-5 w-5" />}
              onClick={() => navigate('/dashboard/admin/subscriptions')}
            />
            
            <SettingsCard
              title="Platform Settings"
              description="Configure global settings"
              icon={<Settings className="h-5 w-5" />}
              onClick={() => navigate('/dashboard/settings')}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
