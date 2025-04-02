
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SupabaseContextType {
  isSubscribed: boolean;
  enableRealtime: () => void;
  disableRealtime: () => void;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [channel, setChannel] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const enableRealtime = () => {
    if (isSubscribed) return;

    // Subscribe to all relevant tables
    const newChannel = supabase
      .channel('global-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, 
        (payload) => console.log('Profile change:', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_history' }, 
        (payload) => console.log('Payment history change:', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disputes' }, 
        (payload) => console.log('Dispute change:', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, 
        (payload) => console.log('Booking change:', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, 
        (payload) => console.log('Service change:', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorite_services' }, 
        (payload) => console.log('Favorite change:', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_addresses' }, 
        (payload) => console.log('Address change:', payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_methods' }, 
        (payload) => console.log('Payment method change:', payload))
      .subscribe();

    setChannel(newChannel);
    setIsSubscribed(true);
  };

  const disableRealtime = () => {
    if (!isSubscribed || !channel) return;
    
    supabase.removeChannel(channel);
    setChannel(null);
    setIsSubscribed(false);
  };

  useEffect(() => {
    // Enable realtime by default
    enableRealtime();

    // Cleanup on unmount
    return () => {
      disableRealtime();
    };
  }, []);

  const value = {
    isSubscribed,
    enableRealtime,
    disableRealtime
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
