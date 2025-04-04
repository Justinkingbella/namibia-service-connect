
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatBookingStatus, formatCurrency, getStatusColor } from '@/lib/utils';
import { BookingData } from '@/types/booking';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        let query = supabase
          .from('bookings')
          .select(`
            *,
            service:service_id (title, image),
            provider:provider_id (first_name, last_name),
            customer:customer_id (first_name, last_name)
          `);
          
        // Apply role-based filtering
        if (userRole === 'provider') {
          query = query.eq('provider_id', user.id);
        } else if (userRole === 'customer') {
          query = query.eq('customer_id', user.id);
        }
        
        query = query.order('date', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        const formattedBookings = data.map((booking: any) => ({
          id: booking.id,
          serviceId: booking.service_id,
          serviceName: booking.service?.title || 'Unknown Service',
          serviceImage: booking.service?.image,
          providerId: booking.provider_id,
          providerName: booking.provider ? `${booking.provider.first_name} ${booking.provider.last_name}` : 'Unknown Provider',
          customerId: booking.customer_id,
          customerName: booking.customer ? `${booking.customer.first_name} ${booking.customer.last_name}` : 'Unknown Customer',
          date: booking.date,
          startTime: booking.start_time,
          endTime: booking.end_time,
          status: booking.status,
          totalAmount: booking.total_amount,
          paymentStatus: booking.payment_status,
          createdAt: booking.created_at
        }));
        
        setBookings(formattedBookings);
        setFilteredBookings(formattedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, userRole]);

  useEffect(() => {
    // Apply filters whenever filter state changes
    let result = [...bookings];
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    } else if (activeTab !== 'all') {
      // Tab filtering
      switch (activeTab) {
        case 'upcoming':
          result = result.filter(booking => 
            booking.status === 'pending' || booking.status === 'confirmed'
          );
          break;
        case 'completed':
          result = result.filter(booking => booking.status === 'completed');
          break;
        case 'cancelled':
          result = result.filter(booking => booking.status === 'cancelled');
          break;
      }
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      result = result.filter(booking => {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case 'today':
            return bookingDate.getTime() === today.getTime();
          case 'thisWeek':
            return bookingDate >= weekStart;
          case 'thisMonth':
            return bookingDate >= monthStart;
          default:
            return true;
        }
      });
    }
    
    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => 
        booking.serviceName.toLowerCase().includes(query) ||
        booking.providerName.toLowerCase().includes(query) ||
        booking.customerName.toLowerCase().includes(query)
      );
    }
    
    setFilteredBookings(result);
  }, [activeTab, statusFilter, dateFilter, searchQuery, bookings]);

  const handleViewBooking = (bookingId: string) => {
    navigate(`/dashboard/bookings/${bookingId}`);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage your bookings and appointments</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[160px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <FilterIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:w-[400px] w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>View all your bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No bookings found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        {userRole === 'admin' && <TableHead>Customer</TableHead>}
                        {(userRole === 'admin' || userRole === 'customer') && <TableHead>Provider</TableHead>}
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.serviceName}</TableCell>
                          {userRole === 'admin' && <TableCell>{booking.customerName}</TableCell>}
                          {(userRole === 'admin' || userRole === 'customer') && <TableCell>{booking.providerName}</TableCell>}
                          <TableCell>
                            {new Date(booking.date).toLocaleDateString()}
                            <div className="text-xs text-muted-foreground">
                              {booking.startTime} {booking.endTime && `- ${booking.endTime}`}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {formatBookingStatus(booking.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewBooking(booking.id)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Upcoming and confirmed bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table content as above, filtered by the tab */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Bookings</CardTitle>
                <CardDescription>Successfully completed bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table content as above, filtered by the tab */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Bookings</CardTitle>
                <CardDescription>Cancelled and rejected bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Same table content as above, filtered by the tab */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;
