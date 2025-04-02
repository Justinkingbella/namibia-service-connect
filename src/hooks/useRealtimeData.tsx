
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

type Table = 'profiles' | 'payment_history' | 'disputes' | 'user_addresses' | 
             'payment_methods' | 'user_2fa' | 'favorite_services' | 
             'services' | 'bookings' | 'reviews' | 'messages' |
             'subscription_plans' | 'user_subscriptions';

type Event = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

type RealtimeSubscriptionProps = {
  table: Table;
  event?: Event;
  filter?: string;
  filterValue?: any;
  onDataChange?: (payload: any) => void;
};

/**
 * Hook for subscribing to Supabase realtime updates
 */
export function useRealtimeData<T>({
  table,
  event = '*',
  filter,
  filterValue,
  onDataChange
}: RealtimeSubscriptionProps): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<T | null>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch data
  const fetchData = async (): Promise<T | null> => {
    setLoading(true);
    try {
      let query = supabase.from(table).select('*');
      
      if (filter && filterValue !== undefined) {
        query = query.eq(filter, filterValue);
      }
      
      const { data: resultData, error: queryError } = await query;
      
      if (queryError) {
        throw queryError;
      }
      
      setData(resultData as T);
      return resultData as T;
    } catch (err) {
      console.error(`Error fetching data from ${table}:`, err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up realtime subscription
    let channel: RealtimeChannel | null = null;
    
    try {
      channel = supabase.channel(`table-changes-${table}`);
      
      // Configure the channel subscription properly
      channel.on(
        'postgres_changes',
        {
          event: event,
          schema: 'public',
          table: table,
          ...(filter && filterValue !== undefined ? { filter: `${filter}=eq.${filterValue}` } : {})
        },
        (payload) => {
          console.log(`Realtime update received for ${table}:`, payload);
          
          // Handle different events
          if (payload.eventType === 'INSERT') {
            setData((prevData) => {
              if (Array.isArray(prevData)) {
                return [...prevData, payload.new] as unknown as T;
              }
              return payload.new as unknown as T;
            });
            toast.info(`New ${table.slice(0, -1)} added`);
          } else if (payload.eventType === 'UPDATE') {
            setData((prevData) => {
              if (Array.isArray(prevData)) {
                return prevData.map(item => 
                  (item as any).id === payload.new.id ? payload.new : item
                ) as unknown as T;
              }
              return payload.new as unknown as T;
            });
            toast.info(`${table.slice(0, -1)} updated`);
          } else if (payload.eventType === 'DELETE') {
            setData((prevData) => {
              if (Array.isArray(prevData)) {
                return prevData.filter(item => 
                  (item as any).id !== payload.old.id
                ) as unknown as T;
              }
              // If it was the object we were watching that got deleted
              if ((prevData as any)?.id === payload.old.id) {
                return null;
              }
              return prevData;
            });
            toast.info(`${table.slice(0, -1)} removed`);
          }
          
          // Call onDataChange callback if provided
          if (onDataChange) {
            onDataChange(payload);
          }
        }
      );
      
      // Subscribe to the channel
      channel.subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status);
      });
    } catch (error) {
      console.error(`Error setting up realtime subscription for ${table}:`, error);
    }

    // Cleanup on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, event, filter, filterValue, onDataChange]);

  return { data, loading, error, refetch: fetchData };
}
