import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, DollarSign, Users, Star, Clock, CheckCircle, Settings, BarChart2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SettingsCard from '@/components/dashboard/SettingsCard';
import BookingCard from '@/components/dashboard/BookingCard';
import { Button } from '@/components/common/Button';
import ServiceManagement from '@/components/provider/ServiceManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const mockRecentBookings = [
  {
    id: '1',
    serviceId: '1',
    customerId: '1',
    providerId: '1',
    status: 'confirmed' as const,
    date: new Date(),
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    totalAmount: 500,
    commission: 50,
    paymentMethod: 'pay_today' as const,
    paymentStatus: 'completed' as const,
    notes: 'Please bring cleaning supplies',
    isUrgent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceName: 'Home Cleaning Service',
    serviceImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    customerName: 'Sarah Johnson'
  },
  {
    id: '2',
    serviceId: '1',
    customerId: '2',
    providerId: '1',
    status: 'pending' as const,
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    startTime: '10:00',
    endTime: null,
    duration: null,
    totalAmount: 350,
    commission: 35,
    paymentMethod: 'e_wallet' as const,
    paymentStatus: 'pending' as const,
    notes: null,
    isUrgent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceName: 'Home Cleaning Service',
    serviceImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    customerName: 'Michael Brown'
  }
];

const mockTopServices = [
  {
    id: '1',
    name: 'Home Cleaning Service',
    bookings: 45,
    revenue: 11250,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Deep Cleaning',
    bookings: 28,
    revenue: 8400,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Post-Construction Cleaning',
    bookings: 12,
    revenue: 6000,
    rating: 4.9
  },
];

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, CleanHome Pro!</h1>
          <p className="text-muted-foreground mt-1">Manage your services and bookings.</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Bookings Today"
            value="3"
            icon={Clock}
            description="2 completed, 1 upcoming"
          />
          <StatsCard
            title="Total Earnings"
            value="N$21,450"
            icon={DollarSign}
            trend={{ value: 12, positive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Total Customers"
            value="54"
            icon={Users}
            trend={{ value: 8, positive: true }}
            description="vs. last month"
          />
          <StatsCard
            title="Rating"
            value="4.8"
            icon={Star}
            description="Based on 92 reviews"
          />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Upcoming Bookings */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
                <Button as="a" href="/dashboard/bookings" variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              {mockRecentBookings.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mockRecentBookings.map(booking => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      viewAs="provider" 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <CalendarClock className="h-10 w-10 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any upcoming bookings. Create new services to get more bookings.
                  </p>
                  <Button as="a" href="/dashboard/services/create" className="mt-4">
                    Create New Service
                  </Button>
                </div>
              )}
            </div>
            
            {/* Top Performing Services */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Top Performing Services</h2>
                <Button as="a" href="/dashboard/services/manage" variant="outline" size="sm">
                  Manage Services
                </Button>
              </div>
              
              <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookings
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockTopServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{service.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{service.bookings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">N${service.revenue.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1">{service.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SettingsCard
                  title="Create New Service"
                  description="Add a new service to your profile"
                  onClick={() => navigate('/dashboard/services/create')}
                />
                
                <SettingsCard
                  title="Revenue Reports"
                  description="View detailed revenue analytics"
                  icon={<BarChart2 className="h-5 w-5" />}
                  onClick={() => navigate('/dashboard/provider/reports')}
                />
                
                <SettingsCard
                  title="Account Settings"
                  description="Manage your account preferences"
                  icon={<Settings className="h-5 w-5" />}
                  onClick={() => navigate('/dashboard/settings')}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Services Tab */}
          <TabsContent value="services">
            <ServiceManagement />
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Booking Management</h2>
              <p className="text-muted-foreground">Manage all of your customer bookings.</p>
              <p className="text-sm text-muted-foreground mt-4">
                View detailed booking information by visiting the Bookings page.
              </p>
              <Button as="a" href="/dashboard/bookings" className="mt-4">
                View All Bookings
              </Button>
            </div>
          </TabsContent>
          
          {/* Earnings Tab */}
          <TabsContent value="earnings">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Earnings & Payouts</h2>
              <p className="text-muted-foreground">Track your earnings and request payouts.</p>
              <p className="text-sm text-muted-foreground mt-4">This feature is under development.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
