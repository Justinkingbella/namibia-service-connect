
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
      // Build the query using the type-safe API
      // Use 'any' to bypass type checking for dynamic table names
      let query = supabase.from(options.table as any);
      
      // Select columns
      if (options.select) {
        query = query.select(options.select) as any;
      } else if (options.columns) {
        query = query.select(options.columns) as any;
      } else {
        query = query.select('*') as any;
      }

      // Apply filters if provided using type assertion to overcome type issues
      if (options.filter && Array.isArray(options.filter)) {
        for (const filter of options.filter) {
          const column = filter.column;
          const value = filter.value;
          
          // Use a switch with type assertions for each case
          switch (filter.operator) {
            case 'eq':
              query = (query as any).eq(column, value);
              break;
            case 'neq':
              query = (query as any).neq(column, value);
              break;
            case 'gt':
              query = (query as any).gt(column, value);
              break;
            case 'gte':
              query = (query as any).gte(column, value);
              break;
            case 'lt':
              query = (query as any).lt(column, value);
              break;
            case 'lte':
              query = (query as any).lte(column, value);
              break;
            case 'in':
              query = (query as any).in(column, value);
              break;
            case 'is':
              query = (query as any).is(column, value);
              break;
          }
        }
      }

      // Apply ordering if provided
      if (options.orderBy) {
        query = (query as any).order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        });
      }

      // Apply limit if provided
      if (options.limit) {
        query = (query as any).limit(options.limit);
      }

      // Fetch a single record if specified
      let result;
      if (options.single) {
        if (options.id) {
          query = (query as any).eq('id', options.id);
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
