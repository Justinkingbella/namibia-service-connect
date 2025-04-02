
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type RealtimeTable = 
  | 'profiles'
  | 'conversations'
  | 'bookings'
  | 'services'
  | 'user_subscriptions'
  | 'service_providers'
  | 'reviews'
  | 'messages';

interface RealtimeOptions {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

export function useRealtimeData<T>(
  table: RealtimeTable, 
  options: RealtimeOptions = { event: '*' },
  callback?: (payload: T) => void
) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from(table)
          .select('*');
          
        // Apply filter if provided
        if (options.filter) {
          const [column, value] = options.filter.split('=');
          query = query.eq(column, value);
        }
        
        const { data: initialData, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        setData(initialData as T[]);
      } catch (err) {
        console.error(`Error fetching ${table}:`, err);
        setError((err as Error).message);
        toast({
          variant: "destructive",
          title: `Error loading ${table}`,
          description: `Could not fetch data: ${(err as Error).message}`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscription
    const subscription = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', {
        event: options.event === '*' ? undefined : options.event,
        schema: 'public',
        table: table,
      }, (payload) => {
        const newRecord = payload.new as T;
        
        // Call the callback function if provided
        if (callback) {
          callback(newRecord);
        }
        
        // Update state based on event type
        if (payload.eventType === 'INSERT') {
          setData(currentData => [...currentData, newRecord]);
        } else if (payload.eventType === 'UPDATE') {
          setData(currentData => 
            currentData.map(item => 
              (item as any).id === (newRecord as any).id ? newRecord : item
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setData(currentData => 
            currentData.filter(item => (item as any).id !== (payload.old as any).id)
          );
        }
      })
      .subscribe();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [table, options.event, options.filter, toast, callback]);

  return { data, error, loading };
}
