
import React from 'react';
import { Users, DollarSign, Check, AlertTriangle, BarChart } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Button } from '@/components/common/Button';

const AdminDashboard = () => {
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
            <Button as="a" href="/dashboard/providers/pending" variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Applied
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingProviders.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{provider.name}</div>
                      <div className="text-sm text-gray-500">{provider.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{provider.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{provider.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{provider.documents} files</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button size="xs" as="a" href={`/dashboard/providers/${provider.id}`}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">View and manage all users</p>
              <Button as="a" href="/dashboard/users" size="sm">
                Manage Users
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-medium">Services Categories</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Add or edit service categories</p>
              <Button as="a" href="/dashboard/categories" variant="outline" size="sm">
                Manage Categories
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-medium">Payout Requests</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">3 pending requests</p>
              <Button as="a" href="/dashboard/payouts" variant="outline" size="sm">
                Process Payouts
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-medium">Platform Settings</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Configure global settings</p>
              <Button as="a" href="/dashboard/settings" variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
