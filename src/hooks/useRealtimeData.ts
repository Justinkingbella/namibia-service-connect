
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeData<T>(
  tableName: string,
  filters?: Record<string, any>,
  initialData: T[] = []
): { data: T[]; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Dynamically build the query based on filters
        let query = supabase.from(tableName).select('*');
        
        if (filters) {
          Object.entries(filters).forEach(([field, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(field, value);
            }
          });
        }
        
        const { data: fetchedData, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        setData(fetchedData as T[]);
      } catch (err) {
        console.error(`Error fetching data from ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Subscribe to changes
    const subscription = supabase
      .channel(`${tableName}_changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: tableName
      }, (payload) => {
        // Handle the realtime update
        if (payload.eventType === 'INSERT') {
          setData(current => [...current, payload.new as T]);
        } else if (payload.eventType === 'UPDATE') {
          setData(current => 
            current.map(item => 
              // @ts-ignore - we know id exists on the data
              item.id === payload.new.id ? payload.new as T : item
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setData(current => 
            current.filter(item => 
              // @ts-ignore - we know id exists on the data
              item.id !== payload.old.id
            )
          );
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [tableName, JSON.stringify(filters)]);
  
  return { data, loading, error };
}
