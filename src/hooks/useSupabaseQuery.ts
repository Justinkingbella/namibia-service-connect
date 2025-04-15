
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      // Build the query using the type-safe API
      let query = supabase.from(options.table);
      
      // Select columns
      if (options.select) {
        query = query.select(options.select);
      } else if (options.columns) {
        query = query.select(options.columns);
      } else {
        query = query.select('*');
      }

      // Apply filters if provided using type assertion to overcome type issues
      if (options.filter && Array.isArray(options.filter)) {
        for (const filter of options.filter) {
          const column = filter.column;
          const value = filter.value;
          
          // Use a switch with type assertions for each case
          switch (filter.operator) {
            case 'eq':
              query = query.eq(column, value) as any;
              break;
            case 'neq':
              query = query.neq(column, value) as any;
              break;
            case 'gt':
              query = query.gt(column, value) as any;
              break;
            case 'gte':
              query = query.gte(column, value) as any;
              break;
            case 'lt':
              query = query.lt(column, value) as any;
              break;
            case 'lte':
              query = query.lte(column, value) as any;
              break;
            case 'in':
              query = query.in(column, value) as any;
              break;
            case 'is':
              query = query.is(column, value) as any;
              break;
          }
        }
      }

      // Apply ordering if provided
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        }) as any;
      }

      // Apply limit if provided
      if (options.limit) {
        query = query.limit(options.limit) as any;
      }

      // Fetch a single record if specified
      let result;
      if (options.single) {
        if (options.id) {
          query = query.eq('id', options.id) as any;
        }
        result = await (query as any).maybeSingle();
      } else {
        result = await query;
      }

      const { data: resultData, error: queryError } = result;

      if (queryError) {
        throw new Error(`Error fetching data: ${queryError.message}`);
      }

      setData(resultData);
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
