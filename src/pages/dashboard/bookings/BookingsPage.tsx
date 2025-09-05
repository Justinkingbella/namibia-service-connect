import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';

import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDateRangePicker } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { BookingStatus, BookingData } from '@/types';
import { Link } from 'react-router-dom';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      try {
        let query = supabase.from('bookings').select('*');

        if (user?.role === 'customer') {
          query = query.eq('customer_id', user.id);
        } else if (user?.role === 'provider') {
          query = query.eq('provider_id', user.id);
        }

        // Apply filters
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        if (dateFilter) {
          query = query.gte('date', dateFilter);
        }

        // Sort by date, most recent first
        query = query.order('date', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        // Transform the data to match BookingData interface
        const formattedBookings: BookingData[] = await Promise.all((data || []).map(async (booking) => {
          // Fetch service details
          const { data: serviceData } = await supabase
            .from('services')
            .select('title, image')
            .eq('id', booking.service_id)
            .single();

          // Fetch provider details
          const { data: providerData } = await supabase
            .from('service_providers')
            .select('business_name')
            .eq('id', booking.provider_id)
            .single();

          // Fetch customer details
          const { data: customerData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', booking.customer_id)
            .single();

          const customerName = customerData 
            ? `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim() 
            : 'Unknown Customer';

          const providerName = providerData ? providerData.business_name : 'Unknown Provider';

          return {
            id: booking.id,
            service_id: booking.service_id,
            service_name: serviceData?.title || 'Unknown Service',
            service_image: serviceData?.image || '/placeholder.svg',
            customer_id: booking.customer_id,
            customer_name: customerName,
            provider_id: booking.provider_id,
            provider_name: providerName,
            date: booking.date,
            start_time: booking.start_time,
            end_time: booking.end_time,
            status: booking.status as BookingStatus,
            total_amount: booking.total_amount,
            payment_status: booking.payment_status,
            created_at: booking.created_at,
            updated_at: booking.updated_at
          };
        }));

        setBookings(formattedBookings);
        setFilteredBookings(formattedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        toast({
          title: 'Error',
          description: 'Failed to load bookings. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user, statusFilter, dateFilter, toast]);

  useEffect(() => {
    const filterBookings = () => {
      let results = bookings.filter(booking => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          booking.service_name?.toLowerCase().includes(searchTerm) ||
          booking.customer_name?.toLowerCase().includes(searchTerm) ||
          booking.provider_name?.toLowerCase().includes(searchTerm) ||
          booking.id.toLowerCase().includes(searchTerm)
        );
      });
      setFilteredBookings(results);
    };

    filterBookings();
  }, [searchQuery, bookings]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-NA', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Input
          type="text"
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !dateFilter && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? (
                format(new Date(dateFilter), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <CalendarDateRangePicker
              date={dateFilter ? new Date(dateFilter) : undefined}
              onSelect={(date) => setDateFilter(date ? format(date, 'yyyy-MM-dd') : undefined)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.service_name}</TableCell>
                  <TableCell>{booking.customer_name}</TableCell>
                  <TableCell>{booking.provider_name}</TableCell>
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{formatTime(booking.start_time)}</TableCell>
                  <TableCell>N${booking.total_amount}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'completed' ? 'success' : 'default'}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/dashboard/bookings/${booking.id}`} className="text-blue-500 hover:underline">
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
