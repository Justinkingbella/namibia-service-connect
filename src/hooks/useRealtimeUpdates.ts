
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { useServiceStore } from '@/store/serviceStore';
import { toast } from 'sonner';

/**
 * A hook to subscribe to real-time updates from Supabase
 * for the currently authenticated user
 */
export const useRealtimeUpdates = () => {
  const { user, userRole } = useAuthStore();
  const { fetchBookings } = useBookingStore();
  const { fetchServices, fetchUserServices } = useServiceStore();

  useEffect(() => {
    if (!user || !userRole) return;

    // Enable Postgres changes for the tables we're interested in
    const enableRealtimeForTables = async () => {
      try {
        const { error: servicesError } = await supabase.rpc('supabase_functions.enable_realtime', {
          table_name: 'services'
        });
        
        const { error: bookingsError } = await supabase.rpc('supabase_functions.enable_realtime', {
          table_name: 'bookings'
        });
        
        if (servicesError || bookingsError) {
          console.error('Error enabling realtime:', servicesError || bookingsError);
        }
      } catch (error) {
        console.error('Error enabling realtime:', error);
      }
    };

    enableRealtimeForTables();

    // Subscribe to service changes
    const serviceChannel = supabase
      .channel('services-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'services',
        filter: userRole === 'provider' ? `provider_id=eq.${user.id}` : undefined
      }, (payload) => {
        console.log('Service change received:', payload);
        
        // Refresh services based on the event type
        const eventType = payload.eventType;
        
        if (eventType === 'INSERT' || eventType === 'UPDATE' || eventType === 'DELETE') {
          if (userRole === 'provider') {
            fetchUserServices(user.id);
          }
          fetchServices();
          
          // Show toast notification
          const serviceName = payload.new?.title || payload.old?.title || 'Service';
          if (eventType === 'INSERT') {
            toast.success(`New service added: ${serviceName}`);
          } else if (eventType === 'UPDATE') {
            toast.info(`Service updated: ${serviceName}`);
          } else if (eventType === 'DELETE') {
            toast.info(`Service removed: ${serviceName}`);
          }
        }
      })
      .subscribe();

    // Subscribe to booking changes
    const bookingChannel = supabase
      .channel('bookings-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings',
        filter: userRole === 'provider' 
          ? `provider_id=eq.${user.id}` 
          : userRole === 'customer'
            ? `customer_id=eq.${user.id}`
            : undefined
      }, (payload) => {
        console.log('Booking change received:', payload);
        
        // Refresh bookings
        fetchBookings(user.id, userRole);
        
        // Show toast notification
        const eventType = payload.eventType;
        const service = payload.new?.service_id || payload.old?.service_id || 'Unknown service';
        
        if (eventType === 'INSERT' && userRole === 'provider') {
          toast.success(`New booking received for service ${service}!`);
        } else if (eventType === 'UPDATE') {
          const newStatus = payload.new?.status;
          const oldStatus = payload.old?.status;
          
          if (newStatus !== oldStatus) {
            if (newStatus === 'confirmed' && userRole === 'customer') {
              toast.success(`Your booking for ${service} has been confirmed!`);
            } else if (newStatus === 'completed' && userRole === 'customer') {
              toast.success(`Your booking for ${service} has been completed!`);
            } else if (newStatus === 'cancelled') {
              toast.warning(`Booking for ${service} has been cancelled.`);
            }
          }
        }
      })
      .subscribe();

    // Cleanup function
    return () => {
      supabase.channel('services-changes').unsubscribe();
      supabase.channel('bookings-changes').unsubscribe();
    };
  }, [user, userRole]);
};
