
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { BookingData, BookingWithDetails, BookingStatus, PaymentStatus } from '@/types/booking';
import { toast } from 'sonner';
import { useAuthStore } from './authStore';

interface BookingState {
  userBookings: BookingData[];
  allBookings: BookingData[];
  selectedBooking: BookingWithDetails | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserBookings: (userId: string, role: 'customer' | 'provider') => Promise<void>;
  fetchAllBookings: (limit?: number) => Promise<void>;
  fetchBookingById: (id: string) => Promise<BookingWithDetails | null>;
  createBooking: (bookingData: Partial<BookingData>) => Promise<string | null>;
  updateBooking: (id: string, bookingData: Partial<BookingData>) => Promise<boolean>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<boolean>;
  updatePaymentStatus: (id: string, status: PaymentStatus) => Promise<boolean>;
  cancelBooking: (id: string, reason: string) => Promise<boolean>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  userBookings: [],
  allBookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  fetchUserBookings: async (userId: string, role: 'customer' | 'provider') => {
    set({ isLoading: true, error: null });
    try {
      // Fetch bookings based on role
      const field = role === 'customer' ? 'customer_id' : 'provider_id';
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq(field, userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ userBookings: data as BookingData[] });
    } catch (error: any) {
      console.error('Error fetching user bookings:', error);
      set({ error: error.message });
      toast.error('Failed to fetch bookings', {
        description: error.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllBookings: async (limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      set({ allBookings: data as BookingData[] });
    } catch (error: any) {
      console.error('Error fetching all bookings:', error);
      set({ error: error.message });
      toast.error('Failed to fetch all bookings', {
        description: error.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBookingById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch booking with related service, customer and provider info
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:service_id(*),
          customer:customer_id(first_name, last_name, email, phone_number, avatar_url),
          provider:provider_id(business_name, email, phone_number, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform to BookingWithDetails
      const bookingWithDetails: BookingWithDetails = {
        ...data,
        serviceDetails: data.service,
        customerDetails: data.customer,
        providerDetails: data.provider,
        
        // Add convenient display properties
        serviceTitle: data.service?.title || 'Unknown Service',
        serviceImage: data.service?.image || '',
        providerName: data.provider?.business_name || 'Unknown Provider',
        customerName: `${data.customer?.first_name || ''} ${data.customer?.last_name || ''}`.trim() || 'Unknown Customer',
        providerAvatar: data.provider?.avatar_url || '',
        customerAvatar: data.customer?.avatar_url || '',
        formattedDate: new Date(data.date).toLocaleDateString(),
      };

      set({ selectedBooking: bookingWithDetails });
      return bookingWithDetails;
    } catch (error: any) {
      console.error('Error fetching booking by ID:', error);
      set({ error: error.message });
      toast.error('Failed to fetch booking details', {
        description: error.message,
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createBooking: async (bookingData: Partial<BookingData>) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure total_amount is a number
      if (bookingData.total_amount) {
        bookingData.total_amount = Number(bookingData.total_amount);
      }

      // Set default commission if not provided (10% of total)
      if (bookingData.total_amount && !bookingData.commission) {
        bookingData.commission = Number(bookingData.total_amount) * 0.1;
      }

      // Set default status if not provided
      if (!bookingData.status) {
        bookingData.status = 'pending';
      }

      // Set default payment status if not provided
      if (!bookingData.payment_status) {
        bookingData.payment_status = 'pending';
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

      // Update the user bookings list
      const { userBookings } = get();
      set({
        userBookings: [...userBookings, data as BookingData]
      });

      toast.success('Booking created successfully');
      return data.id;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      set({ error: error.message });
      toast.error('Failed to create booking', {
        description: error.message,
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateBooking: async (id: string, bookingData: Partial<BookingData>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id);

      if (error) throw error;

      // Update the bookings in the store
      const { userBookings, allBookings, selectedBooking } = get();
      
      // Update userBookings
      set({
        userBookings: userBookings.map(booking => 
          booking.id === id ? { ...booking, ...bookingData } : booking
        )
      });

      // Update allBookings if necessary
      if (allBookings.length > 0) {
        set({
          allBookings: allBookings.map(booking => 
            booking.id === id ? { ...booking, ...bookingData } : booking
          )
        });
      }

      // Update selectedBooking if it's the one being edited
      if (selectedBooking && selectedBooking.id === id) {
        set({
          selectedBooking: {
            ...selectedBooking,
            ...bookingData
          }
        });
      }

      toast.success('Booking updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating booking:', error);
      set({ error: error.message });
      toast.error('Failed to update booking', {
        description: error.message,
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateBookingStatus: async (id: string, status: BookingStatus) => {
    return get().updateBooking(id, { status });
  },

  updatePaymentStatus: async (id: string, status: PaymentStatus) => {
    return get().updateBooking(id, { payment_status: status });
  },

  cancelBooking: async (id: string, reason: string) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      toast.error('Not authenticated');
      return false;
    }
    
    const cancellationData = {
      status: 'cancelled' as BookingStatus,
      cancellation_reason: reason,
      cancelled_by: user.id,
      cancellation_date: new Date().toISOString()
    };
    
    return get().updateBooking(id, cancellationData);
  }
}));
