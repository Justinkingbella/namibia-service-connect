
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSubscriptionStatus(userId?: string) {
  const [status, setStatus] = useState<'active' | 'inactive' | 'pending' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('status')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single();

        if (error) throw error;
        setStatus(data?.status || 'inactive');
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setStatus('inactive');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`subscription_status_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_subscriptions',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setStatus(payload.new.status);
        toast.info('Subscription status updated');
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { status, isLoading };
}
