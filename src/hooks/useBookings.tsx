
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeData } from './useRealtimeData';
import { BookingStatus, PaymentStatus } from '@/types/booking';
import { useToast } from './use-toast';

export interface BookingData {
  id: string;
  service_id: string;
  customer_id: string;
  provider_id: string;
  status: BookingStatus;
  date: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  total_amount: number;
  commission: number;
  payment_method: string;
  payment_status: PaymentStatus;
  notes?: string;
  is_urgent: boolean;
  created_at: string;
  updated_at: string;
  service_title?: string;
  service_image?: string;
  provider_name?: string;
  customer_name?: string;
}

export const useBookings = (
  role: 'customer' | 'provider',
  status?: BookingStatus | 'all',
  limit = 10
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Setup realtime subscription
  const bookingsRealtime = useRealtimeData<BookingData>({
    table: 'bookings',
    filter: {
      [role === 'customer' ? 'customer_id' : 'provider_id']: user?.id,
    },
    order: { column: 'created_at', ascending: false },
    limit,
    onDataChange: (payload) => {
      console.log('Booking data changed:', payload);
      fetchBookings();
    },
  });

  const fetchBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Determine the filter based on role
      const roleFilter = role === 'customer' ? 'customer_id' : 'provider_id';

      // Create the query
      let query = supabase
        .from('bookings')
        .select(`
          *,
          services:service_id (
            title,
            image
          ),
          providers:provider_id (
            business_name
          ),
          customers:customer_id (
            first_name,
            last_name
          )
        `)
        .eq(roleFilter, user.id)
        .order('created_at', { ascending: false });

      // Add status filter if provided and not 'all'
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Add limit if provided
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      if (data) {
        // Transform the data to match the expected format
        const transformedBookings = data.map((booking: any) => ({
          ...booking,
          service_title: booking.services?.title,
          service_image: booking.services?.image,
          provider_name: booking.providers?.business_name,
          customer_name: booking.customers
            ? `${booking.customers.first_name} ${booking.customers.last_name}`
            : 'Unknown Customer',
        }));

        setBookings(transformedBookings);
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
      toast({
        variant: 'destructive',
        title: 'Error fetching bookings',
        description: err.message || 'Failed to load bookings',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setBookings([]);
      setLoading(false);
    }
  }, [user, role, status, limit]);

  const cancelBooking = async (bookingId: string, reason: string) => {
    if (!user) return false;

    try {
      // Update the booking status
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancellation_date: new Date().toISOString(),
          cancelled_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)
        .eq(role === 'customer' ? 'customer_id' : 'provider_id', user.id);

      if (error) throw error;

      // Refresh bookings
      await fetchBookings();

      toast({
        title: 'Booking cancelled',
        description: 'The booking has been successfully cancelled.',
      });

      return true;
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      toast({
        variant: 'destructive',
        title: 'Cancellation failed',
        description: err.message || 'Failed to cancel booking',
      });
      return false;
    }
  };

  const completeBooking = async (bookingId: string, rating?: number, feedback?: string) => {
    if (!user || role !== 'provider') return false;

    try {
      // Update the booking status
      const updateData: any = {
        status: 'completed',
        updated_at: new Date().toISOString(),
      };

      if (feedback) {
        updateData.provider_notes = feedback;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .eq('provider_id', user.id);

      if (error) throw error;

      // Refresh bookings
      await fetchBookings();

      toast({
        title: 'Booking completed',
        description: 'The service has been marked as completed.',
      });

      return true;
    } catch (err: any) {
      console.error('Error completing booking:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to complete booking',
      });
      return false;
    }
  };

  return {
    bookings,
    loading,
    error,
    cancelBooking,
    completeBooking,
    refetch: fetchBookings,
  };
};
