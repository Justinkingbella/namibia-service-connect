
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { BookingData, BookingStatus, PaymentStatus, UserRole } from '@/types';
import { toast } from 'sonner';

interface BookingState {
  bookings: BookingData[];
  selectedBooking: BookingData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBookings: (userId: string, role: UserRole) => Promise<void>;
  fetchBookingById: (bookingId: string) => Promise<BookingData | null>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<boolean>;
  cancelBooking: (bookingId: string, reason: string) => Promise<boolean>;
  createBooking: (bookingData: Partial<BookingData>) => Promise<boolean>;
  clearBookings: () => void;
  setSelectedBooking: (booking: BookingData | null) => void;
  submitBookingRating: (bookingId: string, rating: number, feedback?: string) => Promise<boolean>;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      selectedBooking: null,
      loading: false,
      error: null,
      
      fetchBookings: async (userId: string, role: UserRole) => {
        try {
          set({ loading: true, error: null });
          
          let query = supabase.from('bookings').select(`
            *,
            service:service_id(*),
            provider:provider_id(*),
            customer:customer_id(*)
          `);
          
          // Filter by appropriate ID based on user role
          if (role === 'provider') {
            query = query.eq('provider_id', userId);
          } else if (role === 'customer') {
            query = query.eq('customer_id', userId);
          }
          
          const { data, error } = await query.order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Map DB fields to match our BookingData interface
          const mappedBookings: BookingData[] = data.map((booking: any) => {
            const mappedBooking: BookingData = {
              ...booking,
              // Add UI display fields using related data
              serviceName: booking.service?.title || 'Unknown Service',
              serviceImage: booking.service?.image || null, 
              providerName: booking.provider?.business_name || 'Unknown Provider',
              customerName: booking.customer?.first_name 
                ? `${booking.customer.first_name} ${booking.customer.last_name || ''}`
                : 'Unknown Customer',
              // Add camelCase alternates for component usage
              serviceId: booking.service_id,
              customerId: booking.customer_id,
              providerId: booking.provider_id,
              startTime: booking.start_time,
              endTime: booking.end_time,
              paymentStatus: booking.payment_status,
              paymentMethod: booking.payment_method,
              totalAmount: booking.total_amount,
              isUrgent: booking.is_urgent,
              createdAt: booking.created_at,
              updatedAt: booking.updated_at,
              cancellationReason: booking.cancellation_reason,
              // For provider pages
              providerAvatar: booking.provider?.avatar_url || null,
              // For customer pages
              customerAvatar: booking.customer?.avatar_url || null,
              serviceTitle: booking.service?.title || 'Unknown Service',
            };
            
            return mappedBooking;
          });
          
          set({ bookings: mappedBookings, loading: false });
        } catch (error) {
          console.error('Error fetching bookings:', error);
          set({ error: 'Failed to fetch bookings', loading: false });
        }
      },
      
      fetchBookingById: async (bookingId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('bookings')
            .select(`
              *,
              service:service_id(*),
              provider:provider_id(*),
              customer:customer_id(*)
            `)
            .eq('id', bookingId)
            .single();
          
          if (error) throw error;
          
          const booking: BookingData = {
            ...data,
            serviceName: data.service?.title || 'Unknown Service',
            serviceImage: data.service?.image || null,
            providerName: data.provider?.business_name || 'Unknown Provider',
            customerName: data.customer?.first_name 
              ? `${data.customer.first_name} ${data.customer.last_name || ''}`
              : 'Unknown Customer',
            // Add camelCase alternates
            serviceId: data.service_id,
            customerId: data.customer_id,
            providerId: data.provider_id,
            startTime: data.start_time,
            endTime: data.end_time,
            paymentStatus: data.payment_status,
            totalAmount: data.total_amount,
            isUrgent: data.is_urgent,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            cancellationReason: data.cancellation_reason,
            // For provider pages
            providerAvatar: data.provider?.avatar_url || null,
            // For customer pages
            customerAvatar: data.customer?.avatar_url || null,
            serviceTitle: data.service?.title || 'Unknown Service',
          };
          
          set({ selectedBooking: booking, loading: false });
          return booking;
        } catch (error) {
          console.error('Error fetching booking:', error);
          set({ error: 'Failed to fetch booking details', loading: false });
          return null;
        }
      },
      
      updateBookingStatus: async (bookingId: string, status: BookingStatus) => {
        try {
          const { data, error } = await supabase
            .from('bookings')
            .update({ 
              status, 
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select();
          
          if (error) throw error;
          
          // Update local state
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId ? { ...booking, status } : booking
            )
          }));
          
          if (get().selectedBooking?.id === bookingId) {
            set(state => ({
              selectedBooking: state.selectedBooking 
                ? { ...state.selectedBooking, status } 
                : null
            }));
          }
          
          toast.success(`Booking status updated to ${status}`);
          return true;
        } catch (error) {
          console.error('Error updating booking status:', error);
          toast.error('Failed to update booking status');
          return false;
        }
      },
      
      cancelBooking: async (bookingId: string, reason: string) => {
        try {
          const { data, error } = await supabase
            .from('bookings')
            .update({ 
              status: 'cancelled',
              payment_status: 'refunded' as PaymentStatus,
              cancellation_reason: reason,
              cancellation_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select();
          
          if (error) throw error;
          
          // Update local state
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId ? { 
                ...booking, 
                status: 'cancelled',
                payment_status: 'refunded',
                cancellation_reason: reason,
              } : booking
            )
          }));
          
          // Update selected booking if it's the one being cancelled
          if (get().selectedBooking?.id === bookingId) {
            set(state => ({
              selectedBooking: state.selectedBooking 
                ? { 
                    ...state.selectedBooking, 
                    status: 'cancelled',
                    payment_status: 'refunded',
                    cancellation_reason: reason,
                  } 
                : null
            }));
          }
          
          toast.success('Booking cancelled successfully');
          return true;
        } catch (error) {
          console.error('Error cancelling booking:', error);
          toast.error('Failed to cancel booking');
          return false;
        }
      },
      
      createBooking: async (bookingData: Partial<BookingData>) => {
        try {
          // Map any camelCase fields to snake_case for DB
          const bookingDataForDb: any = {
            ...bookingData,
            service_id: bookingData.serviceId || bookingData.service_id,
            customer_id: bookingData.customerId || bookingData.customer_id,
            provider_id: bookingData.providerId || bookingData.provider_id,
            start_time: bookingData.startTime || bookingData.start_time,
            end_time: bookingData.endTime || bookingData.end_time,
            payment_status: bookingData.paymentStatus || bookingData.payment_status || 'pending',
            payment_method: bookingData.paymentMethod || bookingData.payment_method,
            total_amount: bookingData.totalAmount || bookingData.total_amount,
            is_urgent: bookingData.isUrgent || bookingData.is_urgent,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('bookings')
            .insert(bookingDataForDb)
            .select();
          
          if (error) throw error;
          
          // Add the new booking to state
          if (data && data.length > 0) {
            const newBooking = data[0] as BookingData;
            set(state => ({
              bookings: [newBooking, ...state.bookings]
            }));
          }
          
          toast.success('Booking created successfully');
          return true;
        } catch (error) {
          console.error('Error creating booking:', error);
          toast.error('Failed to create booking');
          return false;
        }
      },
      
      submitBookingRating: async (bookingId: string, rating: number, feedback?: string) => {
        try {
          const { data, error } = await supabase
            .from('bookings')
            .update({ 
              rating,
              feedback,
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select();
          
          if (error) throw error;
          
          // Update local state
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId ? { ...booking, rating, feedback } : booking
            )
          }));
          
          // Update selected booking if it's the one being rated
          if (get().selectedBooking?.id === bookingId) {
            set(state => ({
              selectedBooking: state.selectedBooking 
                ? { ...state.selectedBooking, rating, feedback } 
                : null
            }));
          }
          
          toast.success('Rating submitted successfully');
          return true;
        } catch (error) {
          console.error('Error submitting rating:', error);
          toast.error('Failed to submit rating');
          return false;
        }
      },
      
      clearBookings: () => {
        set({ bookings: [], selectedBooking: null });
      },
      
      setSelectedBooking: (booking) => {
        set({ selectedBooking: booking });
      }
    }),
    {
      name: 'bookings-storage',
      // Only persist some fields to avoid storing too much data
      partialize: (state) => ({
        selectedBooking: state.selectedBooking
      })
    }
  )
);
