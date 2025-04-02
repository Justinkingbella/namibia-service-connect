
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRealtimeData } from './useRealtimeData';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  status: BookingStatus;
  date: Date | string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  totalAmount: number;
  commission: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes: string | null;
  isUrgent: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  serviceName?: string;
  serviceImage?: string;
  providerName?: string;
  customerName?: string;
}

interface UseBookingsReturnType {
  bookings: Booking[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<boolean>;
}

export function useBookings(): UseBookingsReturnType {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Different query based on user role
  const getBookingsQuery = useCallback(async () => {
    if (!user) return null;

    let query = supabase.from('bookings').select(`
      *,
      service:service_id(
        id,
        title,
        image,
        provider_id,
        price
      ),
      customer:customer_id(
        id,
        first_name,
        last_name
      ),
      provider:provider_id(
        id,
        business_name
      )
    `);

    // Filter bookings based on user role
    if (user.role === 'customer') {
      query = query.eq('customer_id', user.id);
    } else if (user.role === 'provider') {
      query = query.eq('provider_id', user.id);
    }
    
    query = query.order('created_at', { ascending: false });
    
    return query;
  }, [user]);

  // Use our real-time data hook for bookings based on the user's role
  const table = 'bookings';
  const filter = user?.role === 'customer' ? 'customer_id' : 
                user?.role === 'provider' ? 'provider_id' : undefined;
  const filterValue = filter ? user?.id : undefined;

  const { data: realtimeBookings } = useRealtimeData<any[]>({
    table,
    filter,
    filterValue,
    onDataChange: (payload) => {
      console.log('Booking changed:', payload);
      // You could show specific toasts based on the event type
      if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
        toast.info(`Booking status updated to: ${payload.new.status}`);
      }
    }
  });

  // Standard fetch method
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const query = await getBookingsQuery();
      if (!query) {
        setBookings([]);
        return;
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Map the data to our Booking interface
      const formattedBookings: Booking[] = data.map(item => {
        // Safe access to nested properties that might be null
        const serviceData = item.service || {};
        const customerData = item.customer || {};
        const providerData = item.provider || {};

        return {
          id: item.id,
          serviceId: item.service_id,
          customerId: item.customer_id,
          providerId: item.provider_id,
          status: item.status as BookingStatus,
          date: item.date,
          startTime: item.start_time,
          endTime: item.end_time,
          duration: item.duration,
          totalAmount: item.total_amount,
          commission: item.commission,
          paymentMethod: item.payment_method,
          paymentStatus: item.payment_status as PaymentStatus,
          notes: item.notes,
          isUrgent: item.is_urgent,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          // Safely access properties with optional chaining and nullish coalescing
          serviceName: typeof serviceData === 'object' ? (serviceData.title || 'Unknown Service') : 'Unknown Service',
          serviceImage: typeof serviceData === 'object' ? (serviceData.image || '') : '',
          providerName: typeof providerData === 'object' ? (providerData.business_name || 'Unknown Provider') : 'Unknown Provider',
          customerName: typeof customerData === 'object' ? 
            `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim() || 'Unknown Customer' : 
            'Unknown Customer'
        };
      });
      
      setBookings(formattedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [getBookingsQuery]);

  // Update booking status
  const updateBookingStatus = async (id: string, status: BookingStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // The real-time subscription will automatically update the UI
      toast.success(`Booking status updated to ${status}`);
      return true;
    } catch (err) {
      console.error('Error updating booking status:', err);
      toast.error('Failed to update booking status');
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  // Update local state if we get real-time updates
  useEffect(() => {
    if (realtimeBookings) {
      console.log('Received realtime booking update:', realtimeBookings);
      // Process the realtime data
      // This would need additional logic to properly map service/customer/provider data
      // For now, we'll just refetch to keep it simple
      fetchBookings();
    }
  }, [realtimeBookings, fetchBookings]);

  return {
    bookings,
    isLoading,
    error,
    refetch: fetchBookings,
    updateBookingStatus
  };
}
