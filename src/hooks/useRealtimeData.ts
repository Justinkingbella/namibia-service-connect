
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/contexts/SupabaseContext';
import { RealtimeChannel } from '@supabase/supabase-js';

// Define the possible event types for Postgres changes
type PostgresChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeDataOptions<T> {
  table: string;
  filter?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  onDataChange?: (payload: {
    eventType: PostgresChangeEvent;
    new: T;
    old: T | null;
  }) => void;
}

export function useRealtimeData<T>({
  table,
  filter,
  order,
  limit,
  onDataChange,
}: UseRealtimeDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { isSubscribed, enableRealtime } = useSupabase();

  // Function to fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build the query - use the type assertion to handle the table name
      let query = supabase.from(table).select('*') as any;
      
      // Apply filters if provided
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        });
      }
      
      // Apply ordering if provided
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data: fetchedData, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      setData(fetchedData as T[]);
      setError(null);
    } catch (err) {
      console.error(`Error fetching data from ${table}:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refetch data
  const refetch = async () => {
    await fetchData();
  };
  
  // Initialize data and set up real-time subscription
  useEffect(() => {
    if (!isSubscribed) {
      enableRealtime();
    }
    
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
        (payload: any) => {
          console.log(`Real-time update for ${table}:`, payload);
          
          // If a custom handler is provided, call it
          if (onDataChange) {
            onDataChange({
              eventType: payload.eventType as PostgresChangeEvent,
              new: payload.new as T,
              old: payload.old as T
            });
          } else {
            // Otherwise, refetch data to update the state
            fetchData();
          }
        }
      )
      .subscribe();
    
    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, JSON.stringify(filter), order?.column, order?.ascending, limit]);

  return { data, loading, error, refetch };
}
