
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload, RealtimeChannel } from '@supabase/supabase-js';

type TableName = 'profiles' | 'conversations' | 'messages' | 'bookings' | 'services' | 
                'notifications' | 'disputes' | 'customers' | 'service_providers' | string;
type Event = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface RealtimeOptions {
  event?: Event;
  filter?: string;
}

/**
 * Hook to subscribe to realtime changes for a given table
 */
export function useRealtimeData<T>(
  table: TableName,
  options: RealtimeOptions = { event: '*' }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Cast the table name to any to avoid TypeScript errors with dynamic table names
        const { data: initialData, error: fetchError } = await supabase
          .from(table as any)
          .select('*');
        
        if (fetchError) throw fetchError;
        
        setData(initialData as T[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        console.error(`Error fetching initial ${table} data:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [table]);

  // Realtime subscription
  useEffect(() => {
    const newChannel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: 'public',
          table: table,
          filter: options.filter
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.eventType === 'INSERT') {
            setData((currentData) => [...currentData, payload.new as T]);
          } else if (payload.eventType === 'UPDATE') {
            setData((currentData) =>
              currentData.map((item: any) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((currentData) =>
              currentData.filter((item: any) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
    
    setChannel(newChannel);

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [table, options.event, options.filter]);

  return { data, loading, error };
}
