
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookingData, BookingStatus } from '@/types/booking';
import { toast } from 'sonner';
import { useRealtimeData } from './useRealtimeData';

interface UseBookingsOptions {
  userId?: string;
  userRole?: 'customer' | 'provider';
  status?: BookingStatus | BookingStatus[];
  limit?: number;
}

export function useBookings({ 
  userId, 
  userRole = 'customer',
  status,
  limit
}: UseBookingsOptions = {}) {
  const [loading, setLoading] = useState(false);

  // Use the useRealtimeData hook for realtime updates
  const realtimeOptions = {
    table: 'bookings',
    filter: userId ? {
      [userRole === 'customer' ? 'customer_id' : 'provider_id']: userId
    } : undefined,
    order: { column: 'created_at', ascending: false },
    limit: limit,
    onDataChange: (payload: any) => {
      console.log('Booking data changed:', payload);
      toast.info(`A booking has been ${payload.eventType.toLowerCase()}`);
    }
  };

  const { 
    data: bookings, 
    loading: realtimeLoading, 
    error, 
    refetch 
  } = useRealtimeData<BookingData>(realtimeOptions);

  // Filter bookings based on status
  const filteredBookings = status 
    ? bookings.filter(booking => 
        Array.isArray(status) 
          ? status.includes(booking.status as BookingStatus)
          : booking.status === status
      )
    : bookings;

  // Function to update booking status
  const updateBookingStatus = useCallback(async (
    bookingId: string, 
    newStatus: BookingStatus,
    notes?: string
  ) => {
    setLoading(true);
    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      // Add specific fields based on the status change
      if (newStatus === 'cancelled') {
        updateData.cancellation_date = new Date().toISOString();
        updateData.cancellation_reason = notes || 'Cancelled by user';
        updateData.cancelled_by = userId;
      } else if (newStatus === 'completed' && notes) {
        updateData.feedback = notes;
      } else if ((newStatus === 'accepted' || newStatus === 'rejected') && notes) {
        updateData.provider_notes = notes;
      }
      
      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);
        
      if (error) throw error;
      
      toast.success(`Booking ${newStatus} successfully`);
      
      // The real-time subscription should update the bookings automatically,
      // but we'll refetch to be safe
      await refetch();
      
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, refetch]);

  return {
    bookings: filteredBookings,
    loading: loading || realtimeLoading,
    error,
    updateBookingStatus,
    refetch
  };
}
