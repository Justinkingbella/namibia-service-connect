
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Define the possible event types for Postgres changes
type PostgresChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

// Define the parameters for the hook
interface UseRealtimeDataParams<T> {
  table: string;
  column?: string;
  value?: string | number;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  onDataChange?: (payload: {
    eventType: PostgresChangeEvent;
    new: T;
    old: T | null;
  }) => void;
}

/**
 * A hook to fetch and subscribe to real-time data from a Supabase table.
 */
export function useRealtimeData<T>({
  table,
  column,
  value,
  orderBy,
  limit,
  onDataChange,
}: UseRealtimeDataParams<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from(table).select('*');
      
      if (column && value !== undefined) {
        query = query.eq(column, value);
      }
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setData(data as unknown as T[]);
    } catch (err) {
      console.error(`Error fetching ${table} data:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Initialize data and subscribe to real-time changes
  useEffect(() => {
    fetchData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          // Update local data based on the change type
          if (payload.eventType === 'INSERT') {
            setData((currentData) => [...currentData, payload.new as unknown as T]);
            if (onDataChange) onDataChange({
              eventType: payload.eventType,
              new: payload.new as unknown as T,
              old: null
            });
          } else if (payload.eventType === 'UPDATE') {
            setData((currentData) => 
              currentData.map((item: any) => 
                item.id === (payload.new as any).id ? (payload.new as unknown as T) : item
              )
            );
            if (onDataChange) onDataChange({
              eventType: payload.eventType,
              new: payload.new as unknown as T,
              old: payload.old as unknown as T
            });
          } else if (payload.eventType === 'DELETE') {
            setData((currentData) => 
              currentData.filter((item: any) => item.id !== (payload.old as any).id)
            );
            if (onDataChange) onDataChange({
              eventType: payload.eventType,
              new: payload.old as unknown as T,
              old: payload.old as unknown as T
            });
          }
        }
      )
      .subscribe();
    
    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, column, value, orderBy?.column, orderBy?.ascending, limit]);

  // Function to manually refetch data
  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
}
