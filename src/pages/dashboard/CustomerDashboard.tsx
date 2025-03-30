import React, { useState } from 'react';
import { CalendarClock, CreditCard, Heart, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ServiceCategoryCard from '@/components/dashboard/ServiceCategoryCard';
import BookingCard from '@/components/dashboard/BookingCard';
import ServiceCard from '@/components/dashboard/ServiceCard';
import { Button } from '@/components/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingHistory from '@/components/customer/BookingHistory';
import { ServiceCategory } from '@/types';

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
    providerName: 'CleanHome Pro'
  },
  {
    id: '2',
    serviceId: '2',
    customerId: '1',
    providerId: '2',
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
    serviceName: 'Plumbing Repair',
    serviceImage: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    providerName: 'Plumb Perfect'
  }
];

const mockRecommendedServices = [
  {
    id: '1',
    title: 'Professional Home Cleaning',
    category: 'home' as ServiceCategory,
    pricingModel: 'hourly' as const,
    price: 250,
    providerName: 'CleanHome Pro',
    providerId: '1',
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia'
  },
  {
    id: '2',
    title: 'Emergency Plumbing Services',
    category: 'home' as ServiceCategory,
    pricingModel: 'fixed' as const,
    price: 350,
    providerName: 'Plumb Perfect',
    providerId: '2',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia'
  },
  {
    id: '3',
    title: 'Errand Running & Delivery',
    category: 'errand' as ServiceCategory,
    pricingModel: 'hourly' as const,
    price: 150,
    providerName: 'Swift Errands',
    providerId: '3',
    rating: 4.9,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1568010567469-8622db8079bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia'
  }
];

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground mt-1">Find and book services in Namibia.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for services, providers, or locations..."
            className="block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Bookings"
            value="3"
            icon={Clock}
            description="Services scheduled"
          />
          <StatsCard
            title="Completed Services"
            value="12"
            icon={CheckCircle}
            description="All time"
          />
          <StatsCard
            title="Favorite Providers"
            value="5"
            icon={Heart}
            description="Saved providers"
          />
          <StatsCard
            title="Total Spent"
            value="N$3,450"
            icon={CreditCard}
            description="All time purchases"
          />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
                      viewAs="customer" 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <CalendarClock className="h-10 w-10 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any upcoming bookings. Browse services to book your first service.
                  </p>
                  <Button as="a" href="/dashboard/services" className="mt-4">
                    Browse Services
                  </Button>
                </div>
              )}
            </div>
            
            {/* Service Categories */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Categories</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <ServiceCategoryCard category="home" />
                <ServiceCategoryCard category="errand" />
                <ServiceCategoryCard category="professional" />
                <ServiceCategoryCard category="freelance" />
                <ServiceCategoryCard category="transport" />
                <ServiceCategoryCard category="health" />
              </div>
            </div>
            
            {/* Recommended Services */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recommended For You</h2>
                <Button as="a" href="/dashboard/services" variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockRecommendedServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <BookingHistory />
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Your Favorite Providers</h2>
              <p className="text-muted-foreground">View and manage your saved service providers.</p>
              <p className="text-sm text-muted-foreground mt-4">This feature is under development.</p>
            </div>
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Your Profile</h2>
              <p className="text-muted-foreground">View and edit your personal information.</p>
              <p className="text-sm text-muted-foreground mt-4">This feature is under development.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
