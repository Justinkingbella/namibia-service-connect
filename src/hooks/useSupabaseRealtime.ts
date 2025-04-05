
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

export function useSupabaseRealtime() {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Create channels for different table changes
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Messages changed:', payload);
          // You can dispatch an action to update your UI here
        }
      )
      .subscribe();

    const bookingsChannel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'bookings',
          filter: user.role === 'customer' 
            ? `customer_id=eq.${user.id}` 
            : user.role === 'provider' 
              ? `provider_id=eq.${user.id}` 
              : undefined
        },
        (payload) => {
          console.log('Bookings changed:', payload);
          // You can dispatch an action to update your UI here
        }
      )
      .subscribe();

    const servicesChannel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services',
          filter: user.role === 'provider' ? `provider_id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log('Services changed:', payload);
          // You can dispatch an action to update your UI here
        }
      )
      .subscribe();

    const disputesChannel = supabase
      .channel('disputes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'disputes',
          filter: user.role === 'customer' 
            ? `customer_id=eq.${user.id}` 
            : user.role === 'provider' 
              ? `provider_id=eq.${user.id}` 
              : undefined
        },
        (payload) => {
          console.log('Disputes changed:', payload);
          // You can dispatch an action to update your UI here
        }
      )
      .subscribe();

    // Cleanup function to remove all channels
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(disputesChannel);
    };
  }, [user]);
}
