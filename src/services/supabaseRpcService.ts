
import { supabase } from '@/integrations/supabase/client';

/**
 * Call Supabase RPC function to check if user can perform an action based on subscription
 */
export async function canPerformSubscriptionAction(
  userId: string, 
  action: string, 
  quantity: number = 1
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc(
      'can_perform_subscription_action',
      {
        p_user_id: userId,
        p_action: action,
        p_quantity: quantity
      }
    );
    
    if (error) {
      console.error('Error checking subscription capability:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Unexpected error in canPerformSubscriptionAction:', error);
    return false;
  }
}

/**
 * Call Supabase RPC function to record subscription usage
 */
export async function recordSubscriptionUsage(
  userId: string, 
  metricName: string, 
  count: number = 1, 
  referenceId?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc(
      'record_subscription_usage',
      {
        p_user_id: userId,
        p_metric_name: metricName,
        p_count: count,
        p_reference_id: referenceId
      }
    );
    
    if (error) {
      console.error('Error recording subscription usage:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Unexpected error in recordSubscriptionUsage:', error);
    return false;
  }
}
