
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

interface UseSupabaseQueryOptions<T> {
  table: string;
  columns?: string;
  select?: string;
  filter?: {
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'is';
    value: any;
  }[];
  orderBy?: { column: string; ascending: boolean };
  limit?: number;
  single?: boolean;
  enabled?: boolean;
  id?: string;
  relations?: string;
}

export function useSupabaseQuery<T = any>(options: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<PostgrestError | Error | null>(null);

  const fetchData = async () => {
    if (options.enabled === false) return;
    setLoading(true);
    setError(null);

    try {
      // Use type assertion to work around the type constraints
      // This is safe because we're passing the table name as a string,
      // which is what the Supabase client expects
      let query = supabase.from(options.table as any);
      
      // Apply select statement
      if (options.select) {
        query = query.select(options.select);
      } else if (options.columns) {
        query = query.select(options.columns);
      } else {
        query = query.select('*');
      }
      
      // Apply filters
      if (options.filter && options.filter.length > 0) {
        for (const filter of options.filter) {
          switch (filter.operator) {
            case 'eq':
              query = query.eq(filter.column, filter.value);
              break;
            case 'neq':
              query = query.neq(filter.column, filter.value);
              break;
            case 'gt':
              query = query.gt(filter.column, filter.value);
              break;
            case 'gte':
              query = query.gte(filter.column, filter.value);
              break;
            case 'lt':
              query = query.lt(filter.column, filter.value);
              break;
            case 'lte':
              query = query.lte(filter.column, filter.value);
              break;
            case 'in':
              query = query.in(filter.column, filter.value);
              break;
            case 'is':
              query = query.is(filter.column, filter.value);
              break;
          }
        }
      }
      
      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending
        });
      }
      
      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Get single item by ID if specified
      if (options.id) {
        query = query.eq('id', options.id);
      }
      
      // Execute query
      const { data: result, error: queryError } = options.single
        ? await query.single()
        : await query;
      
      if (queryError) {
        throw queryError;
      }
      
      setData(result as T | T[]);
    } catch (err) {
      console.error('Supabase query error:', err);
      setError(err as PostgrestError | Error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.table, options.id, options.enabled]);
  
  return { data, loading, error, refetch: fetchData };
}
