
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';

interface SupabaseContextType {
  isSubscribed: boolean;
  enableRealtime: () => Promise<boolean>;
  enableTableRealtime: (tableName: string) => Promise<boolean>;
  subscribeToTable: (tableName: string, callback: (payload: any) => void) => RealtimeChannel;
}

const SupabaseContext = createContext<SupabaseContextType>({
  isSubscribed: false,
  enableRealtime: async () => false,
  enableTableRealtime: async () => false,
  subscribeToTable: () => ({} as RealtimeChannel)
});

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [channels, setChannels] = useState<Record<string, RealtimeChannel>>({});
  const { user } = useAuth();

  // Cleanup subscriptions when component unmounts or user changes
  useEffect(() => {
    return () => {
      Object.values(channels).forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user?.id]);

  const enableRealtime = async (): Promise<boolean> => {
    try {
      console.log('Enabling Supabase realtime...');
      
      // List of tables to enable realtime for
      const tables = [
        'profiles',
        'services',
        'bookings',
        'service_providers',
        'customers',
        'favorite_services',
        'reviews'
      ];
      
      // Enable realtime for each table
      for (const table of tables) {
        await enableTableRealtime(table);
      }
      
      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('Error enabling realtime:', error);
      return false;
    }
  };

  const enableTableRealtime = async (tableName: string): Promise<boolean> => {
    try {
      await supabase.rpc('supabase_functions.enable_realtime', {
        table_name: tableName
      });
      return true;
    } catch (error) {
      console.error(`Error enabling realtime for ${tableName}:`, error);
      return false;
    }
  };

  const subscribeToTable = (
    tableName: string, 
    callback: (payload: any) => void
  ): RealtimeChannel => {
    // Remove existing subscription if any
    if (channels[tableName]) {
      supabase.removeChannel(channels[tableName]);
    }

    // Create new subscription
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: tableName 
      }, payload => {
        callback(payload);
      })
      .subscribe();

    // Store the channel
    setChannels(prev => ({ ...prev, [tableName]: channel }));

    return channel;
  };

  return (
    <SupabaseContext.Provider value={{ 
      isSubscribed, 
      enableRealtime,
      enableTableRealtime,
      subscribeToTable
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => useContext(SupabaseContext);
