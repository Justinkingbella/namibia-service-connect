
import { create } from 'zustand';
import { BookingData, BookingStatus, PaymentStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transformKeysToCamel, transformKeysToSnake } from '@/lib/utils';

interface BookingState {
  bookings: BookingData[];
  currentBooking: BookingData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBookings: (userId: string, userRole: string) => Promise<void>;
  fetchBookingById: (bookingId: string) => Promise<void>;
  createBooking: (bookingData: Partial<BookingData>) => Promise<string | null>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<boolean>;
  updatePaymentStatus: (bookingId: string, status: PaymentStatus) => Promise<boolean>;
  cancelBooking: (bookingId: string, reason: string, cancelledBy: string) => Promise<boolean>;
  clearBookingState: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
  
  fetchBookings: async (userId: string, userRole: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Determine which field to filter by based on user role
      const filterField = userRole === 'provider' ? 'provider_id' : 'customer_id';
      
      // Fetch bookings with related data
      const { data, error } = await supabase
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
        .eq(filterField, userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform and enrich the data
      const transformedBookings: BookingData[] = data.map(booking => {
        const transformed = transformKeysToCamel(booking) as BookingData;
        
        // Add derived properties
        transformed.serviceTitle = booking.services?.title;
        transformed.serviceImage = booking.services?.image;
        transformed.providerName = booking.providers?.business_name;
        transformed.customerName = booking.customers
          ? `${booking.customers.first_name} ${booking.customers.last_name}`
          : 'Unknown Customer';
        
        return transformed;
      });
      
      set({ bookings: transformedBookings, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchBookingById: async (bookingId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services:service_id (
            title,
            image,
            price,
            pricing_model
          ),
          providers:provider_id (
            business_name,
            avatar_url
          ),
          customers:customer_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', bookingId)
        .single();
        
      if (error) throw error;
      
      // Transform and enrich the data
      const transformed = transformKeysToCamel(data) as BookingData;
      
      // Add derived properties
      transformed.serviceTitle = data.services?.title;
      transformed.serviceImage = data.services?.image;
      transformed.providerName = data.providers?.business_name;
      transformed.providerAvatar = data.providers?.avatar_url;
      transformed.customerName = data.customers
        ? `${data.customers.first_name} ${data.customers.last_name}`
        : 'Unknown Customer';
      transformed.customerAvatar = data.customers?.avatar_url;
      
      set({ currentBooking: transformed, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching booking details:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  createBooking: async (bookingData: Partial<BookingData>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert camelCase to snake_case for database
      const dataToInsert = transformKeysToSnake(bookingData);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(dataToInsert)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      const newBooking = transformKeysToCamel(data) as BookingData;
      set(state => ({ 
        bookings: [newBooking, ...state.bookings],
        currentBooking: newBooking,
        isLoading: false 
      }));
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  updateBookingStatus: async (bookingId: string, status: BookingStatus) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      const bookings = get().bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      );
      
      const currentBooking = get().currentBooking;
      if (currentBooking && currentBooking.id === bookingId) {
        set({ currentBooking: { ...currentBooking, status } });
      }
      
      set({ bookings, isLoading: false });
      return true;
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  updatePaymentStatus: async (bookingId: string, paymentStatus: PaymentStatus) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      const bookings = get().bookings.map(booking => 
        booking.id === bookingId ? { ...booking, paymentStatus } : booking
      );
      
      const currentBooking = get().currentBooking;
      if (currentBooking && currentBooking.id === bookingId) {
        set({ currentBooking: { ...currentBooking, paymentStatus } });
      }
      
      set({ bookings, isLoading: false });
      return true;
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  cancelBooking: async (bookingId: string, reason: string, cancelledBy: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled' as BookingStatus,
          cancellation_reason: reason,
          cancelled_by: cancelledBy,
          cancellation_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      const bookings = get().bookings.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: 'cancelled' as BookingStatus,
              cancellationReason: reason,
              cancelledBy: cancelledBy,
              cancellationDate: new Date().toISOString()
            } 
          : booking
      );
      
      const currentBooking = get().currentBooking;
      if (currentBooking && currentBooking.id === bookingId) {
        set({ 
          currentBooking: { 
            ...currentBooking, 
            status: 'cancelled' as BookingStatus,
            cancellationReason: reason,
            cancelledBy: cancelledBy,
            cancellationDate: new Date().toISOString()
          } 
        });
      }
      
      set({ bookings, isLoading: false });
      return true;
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  clearBookingState: () => {
    set({ 
      bookings: [],
      currentBooking: null,
      isLoading: false,
      error: null
    });
  },
  
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error })
}));
