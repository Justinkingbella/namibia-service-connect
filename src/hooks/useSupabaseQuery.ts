import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

type TableName = keyof Database['public']['Tables'];

export function useSupabaseQuery<T>(
  tableName: string,
  options: {
    select?: string;
    match?: Record<string, any>;
    order?: { column: string; ascending: boolean };
    limit?: number;
    page?: number;
    filters?: Array<{
      column: string;
      operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'is';
      value: any;
    }>;
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(tableName as any).select(options.select || '*');

      if (options.filters && options.filters.length > 0) {
        for (const filter of options.filters) {
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
            case 'lt':
              query = query.lt(filter.column, filter.value);
              break;
            case 'gte':
              query = query.gte(filter.column, filter.value);
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

      if (options.match) {
        Object.entries(options.match).forEach(([column, value]) => {
          query = query.eq(column, value);
        });
      }

      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending,
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
        
        if (options.page && options.page > 1) {
          const offset = (options.page - 1) * options.limit;
          query = query.range(offset, offset + options.limit - 1);
        }
      }

      const { data: result, error: queryError } = await query;
      
      const countQuery = supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true });
        
      if (options.filters && options.filters.length > 0) {
        for (const filter of options.filters) {
          switch (filter.operator) {
            case 'eq':
              countQuery.eq(filter.column, filter.value);
              break;
            case 'neq':
              countQuery.neq(filter.column, filter.value);
              break;
            case 'gt':
              countQuery.gt(filter.column, filter.value);
              break;
            case 'lt':
              countQuery.lt(filter.column, filter.value);
              break;
            case 'gte':
              countQuery.gte(filter.column, filter.value);
              break;
            case 'lte':
              countQuery.lte(filter.column, filter.value);
              break;
            case 'in':
              countQuery.in(filter.column, filter.value);
              break;
            case 'is':
              countQuery.is(filter.column, filter.value);
              break;
          }
        }
      }
      
      if (options.match) {
        Object.entries(options.match).forEach(([column, value]) => {
          countQuery.eq(column, value);
        });
      }
      
      const { count: totalCount, error: countError } = await countQuery;

      if (queryError) {
        throw queryError;
      }

      if (countError) {
        console.warn('Error fetching count:', countError);
      }

      setData(result as T[]);
      setCount(totalCount);
    } catch (e) {
      const postgrestError = e as PostgrestError;
      setError(postgrestError);
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, JSON.stringify(options)]);

  return {
    data,
    error,
    loading,
    count,
    refetch: fetchData,
  };
}
