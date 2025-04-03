
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type PostgresChannelPayload<T = any> = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T;
};

interface UseRealtimeDataParams {
  table: string;
  schema?: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  initialData?: any[];
  fetchInitialData?: boolean;
  userId?: string;
}

export function useRealtimeData<T = any>({
  table,
  schema = 'public',
  filter,
  event = '*',
  initialData = [],
  fetchInitialData = true,
  userId
}: UseRealtimeDataParams) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(fetchInitialData);
  const { toast } = useToast();

  // Initial data fetch
  useEffect(() => {
    if (!fetchInitialData) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Use any query parameter to avoid type errors
        const query: any = supabase.from(table).select('*');
        
        // Apply filter if provided
        if (filter) {
          query.eq(filter, userId);
        }

        const { data: result, error } = await query;

        if (error) {
          console.error(`Error fetching ${table} data:`, error);
          toast({ variant: 'destructive', title: `Failed to load ${table} data` });
        } else {
          setData(result);
        }
      } catch (error) {
        console.error(`Error in fetchData for ${table}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchInitialData, table, filter, userId]);

  // Realtime subscription
  useEffect(() => {
    // Set up the channel
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter: filter ? `${filter}=eq.${userId}` : undefined,
        },
        (payload: PostgresChannelPayload<T>) => {
          console.log(`Received ${payload.eventType} event on ${table}:`, payload);
          
          // Update local state based on the event type
          switch (payload.eventType) {
            case 'INSERT':
              setData(currentData => [...currentData, payload.new]);
              break;
            case 'UPDATE':
              setData(currentData =>
                currentData.map(item => 
                  // @ts-ignore This is a bit of a hack but works for our use case
                  item.id === payload.new.id ? payload.new : item
                )
              );
              break;
            case 'DELETE':
              setData(currentData =>
                currentData.filter(item => 
                  // @ts-ignore This is a bit of a hack but works for our use case
                  item.id !== payload.old.id
                )
              );
              break;
          }
        }
      )
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, schema, filter, event, userId]);

  return { data, loading, setData };
}
