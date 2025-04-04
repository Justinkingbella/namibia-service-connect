
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type SubscriptionStatus = 'active' | 'pending' | 'inactive';

export function useSubscriptionStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>('inactive');
  const [planId, setPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user?.id) {
        setStatus('inactive');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('id, status, subscription_plan_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('end_date', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No active subscription found
            setStatus('inactive');
            setPlanId(null);
          } else {
            console.error('Error fetching subscription status:', error);
            setStatus('inactive');
          }
        } else if (data) {
          // Map the status from the database to our SubscriptionStatus type
          if (data.status === 'active') {
            setStatus('active');
          } else if (data.status === 'pending') {
            setStatus('pending');
          } else {
            setStatus('inactive');
          }
          
          setPlanId(data.subscription_plan_id);
        }
      } catch (error) {
        console.error('Error in useSubscriptionStatus:', error);
        setStatus('inactive');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user?.id]);

  return { status, planId, loading, isActive: status === 'active' };
}
