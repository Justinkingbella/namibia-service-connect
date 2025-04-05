
import React, { createContext, useContext, useState, useEffect } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

interface SupabaseContextProps {
  isSubscribed: boolean;
  enableRealtime: () => Promise<boolean>;
  subscribeToTable: <T>(
    tableName: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    callback: (payload: RealtimePostgresChangesPayload<T>) => void,
    filter?: string
  ) => RealtimeChannel;
  unsubscribeChannel: (channel: RealtimeChannel) => void;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuthStore();

  // Effect to check if we need to enable realtime
  useEffect(() => {
    if (user && !isSubscribed) {
      enableRealtime().catch(console.error);
    }
  }, [user]);

  const enableRealtime = async () => {
    try {
      // Enable realtime feature
      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('Failed to enable realtime:', error);
      return false;
    }
  };

  const subscribeToTable = <T extends unknown>(
    tableName: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    callback: (payload: RealtimePostgresChangesPayload<T>) => void,
    filter?: string
  ) => {
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table: tableName,
          filter: filter,
        } as any,
        callback as any
      )
      .subscribe();

    return channel;
  };

  const unsubscribeChannel = (channel: RealtimeChannel) => {
    supabase.removeChannel(channel);
  };

  return (
    <SupabaseContext.Provider
      value={{
        isSubscribed,
        enableRealtime,
        subscribeToTable,
        unsubscribeChannel,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
