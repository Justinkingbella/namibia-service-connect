
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeTable, RealtimeQueryResult } from '@/types/supabase';

export function useRealtimeQuery<T>(tableName: string, options: any = {}): RealtimeQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase.from(tableName).select('*');

      // Apply filters
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply order
      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending,
        });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setData(result as T[]);
      setError('');
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, JSON.stringify(options)]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, error, loading, refetch };
}

export function useRealtimeData<T>(realtimeConfig: RealtimeTable): RealtimeQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const channel = useRef<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase.from(realtimeConfig.table).select('*');

      // Apply filters
      if (realtimeConfig.filter) {
        Object.entries(realtimeConfig.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply order
      if (realtimeConfig.order) {
        query = query.order(realtimeConfig.order.column, {
          ascending: realtimeConfig.order.ascending,
        });
      }

      // Apply limit
      if (realtimeConfig.limit) {
        query = query.limit(realtimeConfig.limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setData(result as T[]);
      setError('');
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up realtime subscription
    try {
      channel.current = supabase
        .channel(`custom-all-channel`)
        .on(
          'postgres_changes', 
          { event: '*', schema: 'public', table: realtimeConfig.table }, 
          (payload: any) => {
            realtimeConfig.onDataChange(payload);
            fetchData();
          }
        )
        .subscribe();
    } catch (err: any) {
      console.error('Error setting up realtime subscription:', err);
      setError(err.message || 'An error occurred with realtime subscription');
    }

    return () => {
      if (channel.current) {
        supabase.removeChannel(channel.current);
      }
    };
  }, [realtimeConfig.table]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, error, loading, refetch };
}
