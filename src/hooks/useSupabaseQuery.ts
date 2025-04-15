
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostgrestResponse } from '@supabase/supabase-js';

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
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (options.enabled === false) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(options.table);

      if (options.select) {
        query = query.select(options.select);
      } else if (options.columns) {
        query = query.select(options.columns);
      } else {
        query = query.select('*');
      }

      // Apply filters if provided
      if (options.filter && Array.isArray(options.filter)) {
        for (const filter of options.filter) {
          if (filter.operator === 'in') {
            query = query.in(filter.column, filter.value);
          } else if (filter.operator === 'is') {
            query = query.is(filter.column, filter.value);
          } else if (filter.operator === 'eq') {
            query = query.eq(filter.column, filter.value);
          } else if (filter.operator === 'neq') {
            query = query.neq(filter.column, filter.value);
          } else if (filter.operator === 'gt') {
            query = query.gt(filter.column, filter.value);
          } else if (filter.operator === 'gte') {
            query = query.gte(filter.column, filter.value);
          } else if (filter.operator === 'lt') {
            query = query.lt(filter.column, filter.value);
          } else if (filter.operator === 'lte') {
            query = query.lte(filter.column, filter.value);
          }
        }
      }

      // Apply ordering if provided
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        });
      }

      // Apply limit if provided
      if (options.limit) {
        query = query.limit(options.limit);
      }

      // Fetch a single record if specified
      if (options.single) {
        if (options.id) {
          query = query.eq('id', options.id);
        }
        query = query.single();
      }

      const { data: result, error } = await query;

      if (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }

      setData(result);
    } catch (err: any) {
      console.error('Error in useSupabaseQuery:', err);
      setError(err);
      toast.error(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    options.table,
    options.columns,
    options.select,
    JSON.stringify(options.filter),
    JSON.stringify(options.orderBy),
    options.limit,
    options.single,
    options.enabled,
    options.id,
  ]);

  return { data, loading, error, refresh: fetchData };
}
