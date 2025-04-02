import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/contexts/SupabaseContext';

interface RealtimeDataOptions<T> {
  table: string;
  schema?: string;
  select?: string;
  filter?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  onDataChange?: (payload: any) => void;
}

export function useRealtimeData<T>({
  table,
  schema = 'public',
  select = '*',
  filter,
  order,
  limit,
  onDataChange
}: RealtimeDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { isSubscribed, enableRealtime } = useSupabase();

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select(select);
      
      // Apply filters if provided
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value);
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

  const refetch = () => fetchData();
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(filter), order?.column, order?.ascending, limit]);
  
  // Set up real-time subscription
  useEffect(() => {
    if (!isSubscribed) {
      enableRealtime();
    }
    
    const channel = supabase
      .channel(`table-changes-${table}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema, 
          table 
        }, 
        (payload) => {
          console.log(`Real-time update for ${table}:`, payload);
          
          // If a custom handler is provided, call it
          if (onDataChange) {
            onDataChange(payload);
          }
          
          // Otherwise, update the data automatically
          else {
            fetchData();
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, schema, isSubscribed]);

  return { data, loading, error, refetch };
}
