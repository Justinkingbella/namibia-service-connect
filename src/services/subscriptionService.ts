
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, UserSubscription, SubscriptionTransaction } from '@/types/subscription';
import { toast } from 'sonner';

/**
 * Fetch all subscription plans
 */
export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No subscription plans found, returning mock data');
      return mockSubscriptionPlans;
    }
    
    // Transform database data to SubscriptionPlan type
    const plans: SubscriptionPlan[] = data.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      billingCycle: plan.billing_cycle,
      isActive: plan.is_active,
      isPopular: plan.is_popular,
      trial_period_days: plan.trial_period_days,
      allowed_services: plan.allowed_services,
      credits: plan.credits,
      max_bookings: plan.max_bookings,
      created_at: plan.created_at,
      updated_at: plan.updated_at,
      // Parse features from JSON
      features: Array.isArray(plan.features) ? 
        plan.features.map((feature: any) => ({
          name: feature.name,
          included: feature.included,
          limit: feature.limit
        })) : []
    }));
    
    return plans;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return mockSubscriptionPlans;
  }
}

/**
 * Fetch user subscriptions
 */
export async function fetchUserSubscriptions(userId?: string): Promise<UserSubscription[]> {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plan:subscription_plan_id (name)
      `)
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return data.map(sub => ({
      ...sub,
      userId: sub.user_id,
      planId: sub.subscription_plan_id,
      planName: sub.subscription_plan?.name || 'Unknown Plan'
    }));
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    return [];
  }
}

/**
 * Subscribes a user to a subscription plan
 */
export async function subscribeUserToPlan(
  userId: string, 
  planId: string, 
  paymentMethodId: string
): Promise<{ success: boolean; message: string; subscription?: UserSubscription }> {
  try {
    // Get the plan details
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    if (planError || !planData) {
      throw new Error('Subscription plan not found');
    }
    
    // Check if user already has an active subscription
    const { data: existingSubscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (subscriptionError) {
      throw subscriptionError;
    }
    
    // If there's an existing subscription, update it to canceled
    if (existingSubscription) {
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          cancellation_date: new Date().toISOString(),
          cancellation_reason: 'Upgraded to a new plan',
        })
        .eq('id', existingSubscription.id);
      
      if (updateError) {
        throw updateError;
      }
    }
    
    // Calculate subscription dates
    const startDate = new Date();
    let endDate = new Date();
    
    switch (planData.billing_cycle) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }
    
    // Create new subscription
    const newSubscription = {
      user_id: userId,
      subscription_plan_id: planId,
      status: 'active',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      payment_method: paymentMethodId,
      auto_renew: true,
      credits_used: 0,
      credits_remaining: planData.credits || 0,
      bookings_used: 0,
      bookings_remaining: planData.max_bookings || 0,
    };
    
    const { data: subscription, error: insertError } = await supabase
      .from('user_subscriptions')
      .insert(newSubscription)
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }
    
    // Create transaction record
    const transaction = {
      user_id: userId,
      subscription_plan_id: planId,
      amount: planData.price,
      status: 'completed',
      payment_method: paymentMethodId,
      created_at: new Date().toISOString()
    };
    
    const { error: transactionError } = await supabase
      .from('subscription_transactions')
      .insert(transaction);
    
    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
      // Don't fail the subscription because of transaction record
    }
    
    return { 
      success: true, 
      message: `Successfully subscribed to ${planData.name} plan`,
      subscription: {
        ...subscription,
        userId: subscription.user_id,
        planId: subscription.subscription_plan_id,
        planName: planData.name
      }
    };
  } catch (error: any) {
    console.error('Error subscribing to plan:', error);
    return { success: false, message: error.message || 'Subscription failed' };
  }
}

/**
 * Cancel a user subscription
 */
export async function cancelSubscription(
  subscriptionId: string, 
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancellation_date: new Date().toISOString(),
        cancellation_reason: reason,
        auto_renew: false
      })
      .eq('id', subscriptionId);
    
    if (error) {
      throw error;
    }
    
    return { success: true, message: 'Subscription cancelled successfully' };
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return { success: false, message: error.message || 'Failed to cancel subscription' };
  }
}

// Mock data for testing when database has no plans
const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Free",
    description: "Basic free tier",
    price: 0,
    billingCycle: "monthly",
    features: [
      { name: "Max Services", limit: 1, included: true },
      { name: "Featured Services", included: false },
      { name: "Priority Support", included: false },
    ],
    isActive: true,
    isPopular: false,
  },
  {
    id: "2",
    name: "Standard",
    description: "Best for small providers",
    price: 299,
    billingCycle: "monthly",
    features: [
      { name: "Max Services", limit: 5, included: true },
      { name: "Featured Services", included: true },
      { name: "Priority Support", included: false },
    ],
    isActive: true,
    isPopular: true,
  },
  {
    id: "3",
    name: "Premium",
    description: "Best for professionals",
    price: 899,
    billingCycle: "monthly",
    features: [
      { name: "Max Services", limit: 20, included: true },
      { name: "Featured Services", included: true },
      { name: "Priority Support", included: true },
    ],
    isActive: true,
    isPopular: false,
  }
];
