
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

type TableName = string;
type GenericData = Record<string, any>;

/**
 * A type-safe hook for querying Supabase data with proper error handling
 */
export function useSafeSupabaseQuery<T>(
  tableName: TableName,
  options: {
    select?: string;
    whereEqual?: Record<string, any>;
    order?: { column: string; ascending: boolean };
    limit?: number;
    single?: boolean;
    enabled?: boolean;
    onSuccess?: (data: T | T[]) => void;
    onError?: (error: PostgrestError) => void;
  } = {}
) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    if (options.enabled === false) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Start building the query
      // Using any here to work around the type issue with dynamic table names
      let query = supabase.from(tableName as any).select(options.select || '*');
      
      // Add equality conditions
      if (options.whereEqual) {
        for (const [key, value] of Object.entries(options.whereEqual)) {
          query = query.eq(key, value);
        }
      }
      
      // Add ordering
      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending 
        });
      }
      
      // Add limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Execute as single or multiple results query
      const { data: result, error: queryError } = options.single
        ? await query.single()
        : await query;
      
      if (queryError) {
        throw queryError;
      }
      
      setData(result as T | T[]);
      
      if (options.onSuccess) {
        options.onSuccess(result as T | T[]);
      }
    } catch (e) {
      const postgrestError = e as PostgrestError;
      setError(postgrestError);
      console.error(`Error fetching data from ${tableName}:`, e);
      
      if (options.onError) {
        options.onError(postgrestError);
      } else if (postgrestError.code !== 'PGRST116') {
        // Don't show toast for "no rows returned" errors
        toast.error(`Failed to fetch ${tableName}`, {
          description: postgrestError.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [
    tableName, 
    options.select, 
    JSON.stringify(options.whereEqual), 
    JSON.stringify(options.order),
    options.limit,
    options.single,
    options.enabled
  ]);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
}

/**
 * Helper hook for mutating data in Supabase with proper error handling
 */
export function useSafeSupabaseMutation<T extends GenericData>(tableName: TableName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const create = async (data: Partial<T>): Promise<{ data: T | null; error: PostgrestError | null }> => {
    setLoading(true);
    setError(null);
    
    try {
      // Use any to work around type issues with dynamic table names
      const { data: result, error: queryError } = await (supabase
        .from(tableName as any)
        .insert([data])
        .select()
        .single() as any);
      
      if (queryError) {
        setError(queryError);
        return { data: null, error: queryError };
      }
      
      return { data: result as T, error: null };
    } catch (e) {
      const postgrestError = e as PostgrestError;
      setError(postgrestError);
      console.error(`Error creating data in ${tableName}:`, e);
      return { data: null, error: postgrestError };
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Partial<T>): Promise<{ data: T | null; error: PostgrestError | null }> => {
    setLoading(true);
    setError(null);
    
    try {
      // Use any to work around type issues with dynamic table names
      const { data: result, error: queryError } = await (supabase
        .from(tableName as any)
        .update(data)
        .eq('id', id)
        .select()
        .single() as any);
      
      if (queryError) {
        setError(queryError);
        return { data: null, error: queryError };
      }
      
      return { data: result as T, error: null };
    } catch (e) {
      const postgrestError = e as PostgrestError;
      setError(postgrestError);
      console.error(`Error updating data in ${tableName}:`, e);
      return { data: null, error: postgrestError };
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<{ error: PostgrestError | null }> => {
    setLoading(true);
    setError(null);
    
    try {
      // Use any to work around type issues with dynamic table names
      const { error: queryError } = await (supabase
        .from(tableName as any)
        .delete()
        .eq('id', id) as any);
      
      if (queryError) {
        setError(queryError);
        return { error: queryError };
      }
      
      return { error: null };
    } catch (e) {
      const postgrestError = e as PostgrestError;
      setError(postgrestError);
      console.error(`Error deleting data from ${tableName}:`, e);
      return { error: postgrestError };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create,
    update,
    remove
  };
}
