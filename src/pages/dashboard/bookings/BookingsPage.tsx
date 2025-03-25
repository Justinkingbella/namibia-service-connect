
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BookingCard from '@/components/dashboard/BookingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Filter, Search, CalendarClock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Booking } from '@/types';

// Mock bookings data
const mockBookings: (Booking & { 
  serviceName: string;
  serviceImage: string;
  providerName?: string;
  customerName?: string;
})[] = [
  {
    id: '1',
    serviceId: '1',
    customerId: '1',
    providerId: '1',
    status: 'confirmed',
    date: new Date(),
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    totalAmount: 500,
    commission: 50,
    paymentMethod: 'pay_today',
    paymentStatus: 'completed',
    notes: 'Please bring cleaning supplies',
    isUrgent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceName: 'Home Cleaning Service',
    serviceImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    providerName: 'CleanHome Pro',
    customerName: 'Sarah Johnson'
  },
  {
    id: '2',
    serviceId: '2',
    customerId: '1',
    providerId: '2',
    status: 'pending',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    startTime: '10:00',
    endTime: null,
    duration: null,
    totalAmount: 350,
    commission: 35,
    paymentMethod: 'e_wallet',
    paymentStatus: 'pending',
    notes: null,
    isUrgent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    serviceName: 'Plumbing Repair',
    serviceImage: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    providerName: 'Plumb Perfect',
    customerName: 'Sarah Johnson'
  },
  {
    id: '3',
    serviceId: '3',
    customerId: '2',
    providerId: '1',
    status: 'completed',
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    startTime: '13:00',
    endTime: '15:00',
    duration: 2,
    totalAmount: 300,
    commission: 30,
    paymentMethod: 'pay_today',
    paymentStatus: 'completed',
    notes: null,
    isUrgent: false,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 3),
    serviceName: 'Deep Cleaning',
    serviceImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    providerName: 'CleanHome Pro',
    customerName: 'Michael Brown'
  },
  {
    id: '4',
    serviceId: '4',
    customerId: '1',
    providerId: '3',
    status: 'cancelled',
    date: new Date(Date.now() - 86400000 * 1), // 1 day ago
    startTime: '11:00',
    endTime: null,
    duration: null,
    totalAmount: 150,
    commission: 15,
    paymentMethod: 'pay_fast',
    paymentStatus: 'refunded',
    notes: 'Canceled due to schedule conflict',
    isUrgent: false,
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 1),
    serviceName: 'Errand Running & Delivery',
    serviceImage: 'https://images.unsplash.com/photo-1568010567469-8622db8079bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    providerName: 'Swift Errands',
    customerName: 'Sarah Johnson'
  }
];

const BookingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('any');
  const [statusFilter, setStatusFilter] = useState('any');

  const isCustomer = user?.role === 'customer';
  const isProvider = user?.role === 'provider';
  const isAdmin = user?.role === 'admin';

  // Filter bookings based on user role
  const userBookings = mockBookings.filter(booking => {
    if (isCustomer) {
      return booking.customerId === user?.id;
    } else if (isProvider) {
      return booking.providerId === user?.id;
    }
    // Admin sees all bookings
    return true;
  });

  // Filter bookings based on active tab
  const getFilteredBookings = () => {
    let filtered = userBookings;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeTab);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.providerName && booking.providerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.customerName && booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Date filter
    if (dateFilter !== 'any') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case 'today':
            return bookingDate.getTime() === today.getTime();
          case 'tomorrow':
            return bookingDate.getTime() === tomorrow.getTime();
          case 'upcoming':
            return bookingDate >= today;
          case 'past':
            return bookingDate < today;
          case 'next_week':
            return bookingDate >= today && bookingDate < nextWeek;
          default:
            return true;
        }
      });
    }

    // Status filter
    if (statusFilter !== 'any') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    return filtered;
  };

  const filteredBookings = getFilteredBookings();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">
            {isCustomer && 'View and manage your service bookings'}
            {isProvider && 'View and manage your service requests from customers'}
            {isAdmin && 'View and manage all service bookings on the platform'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              className="block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button 
            className="md:w-auto"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="any">Any Time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="next_week">Next 7 Days</option>
                <option value="upcoming">All Upcoming</option>
                <option value="past">Past Bookings</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="any">Any Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredBookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    viewAs={
                      isCustomer 
                        ? 'customer' 
                        : isProvider 
                          ? 'provider' 
                          : 'admin'
                    } 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <CalendarClock className="h-10 w-10 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isCustomer 
                    ? "You don't have any bookings yet. Browse services to book your first service."
                    : isProvider 
                      ? "You don't have any bookings yet. Make sure your services are up-to-date."
                      : "No bookings match your filter criteria."
                  }
                </p>
                {isCustomer && (
                  <Button as="a" href="/dashboard/services" className="mt-4">
                    Browse Services
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Repeat the same pattern for other tabs */}
          {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <TabsContent key={status} value={status} className="mt-6">
              {filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredBookings.map(booking => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      viewAs={
                        isCustomer 
                          ? 'customer' 
                          : isProvider 
                            ? 'provider' 
                            : 'admin'
                      } 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <CalendarClock className="h-10 w-10 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No {status} bookings</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no bookings with the status "{status}" matching your criteria.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;
