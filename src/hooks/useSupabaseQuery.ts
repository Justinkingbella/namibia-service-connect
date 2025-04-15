
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

type QueryOptions = {
  table: string;
  columns?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  idColumn?: string;
  id?: string | null;
  relationTable?: string;
  relationFilter?: Record<string, any>;
};

/**
 * A custom hook for handling Supabase queries with TypeScript support
 */
export function useSupabaseQuery<T>(options: QueryOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let query = supabase.from(options.table);

        // Select columns if provided, otherwise select all
        if (options.columns) {
          query = query.select(options.columns);
        } else {
          query = query.select('*');
        }

        // Handle relation if provided
        if (options.relationTable) {
          // Cast relation table to any to avoid type checking
          // This is necessary because supabase's typing doesn't allow for dynamic relation names
          query = query.select(`*, ${options.relationTable}(*)`) as any;
        }

        // Apply filters if provided
        if (options.filters) {
          for (const [key, value] of Object.entries(options.filters)) {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else if (value === null) {
              query = query.is(key, null);
            } else {
              query = query.eq(key, value);
            }
          }
        }

        // Apply relation filters if provided
        if (options.relationTable && options.relationFilter) {
          for (const [key, value] of Object.entries(options.relationFilter)) {
            const filterKey = `${options.relationTable}.${key}`;
            if (Array.isArray(value)) {
              query = query.in(filterKey, value);
            } else if (value === null) {
              query = query.is(filterKey, null);
            } else {
              query = query.eq(filterKey, value);
            }
          }
        }

        // Apply ordering if provided
        if (options.orderBy) {
          query = query.order(
            options.orderBy.column, 
            { ascending: options.orderBy.ascending ?? true }
          );
        }

        // Apply limit if provided
        if (options.limit) {
          query = query.limit(options.limit);
        }

        // Execute query - either for a single item or multiple items
        let response: PostgrestResponse<T> | PostgrestSingleResponse<T>;
        
        if (options.id && options.idColumn) {
          response = await query.eq(options.idColumn, options.id).single();
        } else {
          response = await query;
        }

        if (response.error) {
          throw new Error(response.error.message);
        }

        setData(response.data as T);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [
    options.table,
    options.columns,
    options.id,
    options.idColumn,
    JSON.stringify(options.filters),
    JSON.stringify(options.orderBy),
    options.limit,
    options.relationTable,
    JSON.stringify(options.relationFilter),
  ]);

  return { data, error, loading };
}

export default useSupabaseQuery;
