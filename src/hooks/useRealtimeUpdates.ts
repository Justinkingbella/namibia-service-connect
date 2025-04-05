
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

    // Using direct channel subscriptions instead of RPC
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
          const newData = payload.new || {};
          const oldData = payload.old || {};
          const serviceName = (newData as any)?.title || (oldData as any)?.title || 'Service';
          
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
        const newData = payload.new || {};
        const oldData = payload.old || {};
        const serviceId = (newData as any)?.service_id || (oldData as any)?.service_id || 'Unknown service';
        
        if (eventType === 'INSERT' && userRole === 'provider') {
          toast.success(`New booking received for service ${serviceId}!`);
        } else if (eventType === 'UPDATE') {
          const newStatus = (newData as any)?.status;
          const oldStatus = (oldData as any)?.status;
          
          if (newStatus !== oldStatus) {
            if (newStatus === 'confirmed' && userRole === 'customer') {
              toast.success(`Your booking for ${serviceId} has been confirmed!`);
            } else if (newStatus === 'completed' && userRole === 'customer') {
              toast.success(`Your booking for ${serviceId} has been completed!`);
            } else if (newStatus === 'cancelled') {
              toast.warning(`Booking for ${serviceId} has been cancelled.`);
            }
          }
        }
      })
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(serviceChannel);
      supabase.removeChannel(bookingChannel);
    };
  }, [user, userRole, fetchBookings, fetchServices, fetchUserServices]);
};
