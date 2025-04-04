
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Table = 'conversations' | 'messages' | 'bookings' | 'services' | 'notifications' | string;
type Event = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface RealtimeOptions {
  event?: Event;
  filter?: string;
}

/**
 * Hook to subscribe to realtime changes for a given table
 */
export function useRealtimeData<T>(
  table: Table,
  options: RealtimeOptions = { event: '*' }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // The table name is passed directly to from() to avoid TypeScript issues
        const { data: initialData, error: fetchError } = await supabase
          .from(table)
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
    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, options.event, options.filter]);

  return { data, loading, error };
}
