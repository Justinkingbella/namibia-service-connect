
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

interface UseRealtimeDataOptions<T> {
  table: string;
  column?: string;
  value?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onData?: (data: T) => void;
  onError?: (error: any) => void;
}

export function useRealtimeData<T>(options: UseRealtimeDataOptions<T>) {
  const { table, column, value, event = '*', filter, onData, onError } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(table).select('*');
        
        if (column && value) {
          query = query.eq(column, value);
        }
        
        const { data: initialData, error: fetchError } = await query;
        
        if (fetchError) {
          setError(fetchError);
          if (onError) onError(fetchError);
          return;
        }
        
        setData(initialData as T[]);
      } catch (err) {
        setError(err);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up realtime subscription
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', 
        { 
          event: event, 
          schema: 'public', 
          table: table,
          filter: filter
        },
        (payload) => {
          // Handle the realtime update
          if (payload.eventType === 'INSERT') {
            setData(prev => [...prev, payload.new as T]);
            if (onData) onData(payload.new as T);
          } 
          else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              // @ts-ignore - we know the id exists on both objects
              item.id === payload.new.id ? payload.new as T : item
            ));
            if (onData) onData(payload.new as T);
          } 
          else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => 
              // @ts-ignore - we know the id exists on both objects
              item.id !== payload.old.id
            ));
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, column, value, event, filter, onData, onError, user]);

  return { data, loading, error };
}
