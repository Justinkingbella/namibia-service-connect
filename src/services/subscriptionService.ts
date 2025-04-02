import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertJsonToFeatures, convertFeaturesToJson } from '@/types/subscription';
import { canPerformSubscriptionAction, recordSubscriptionUsage } from './supabaseRpcService';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  isActive: boolean;
  features: any[];
  credits: number;
  isPopular: boolean;
  maxBookings: number;
  trialPeriodDays?: number;
  allowedServices?: number;
  sortOrder?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  creditsUsed?: number;
  creditsRemaining?: number;
  bookingsUsed?: number;
  bookingsRemaining?: number;
  autoRenew?: boolean;
  plan?: SubscriptionPlan;
}

// Fetch all active subscription plans
export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching subscription plans:', error);
      toast.error('Failed to load subscription plans');
      return [];
    }

    return data.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: Number(plan.price),
      billingCycle: plan.billing_cycle,
      isActive: plan.is_active,
      features: convertJsonToFeatures(plan.features),
      credits: plan.credits,
      isPopular: plan.is_popular || false,
      maxBookings: plan.max_bookings,
      trialPeriodDays: plan.trial_period_days || 0,
      allowedServices: plan.allowed_services || 1,
      sortOrder: plan.sort_order || 0
    }));
  } catch (error) {
    console.error('Unexpected error in fetchSubscriptionPlans:', error);
    toast.error('Something went wrong while loading subscription plans');
    return [];
  }
}

// Fetch a user's current subscription with usage metrics
export async function fetchUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plan_id (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which we don't want to show as an error
        console.error('Error fetching user subscription:', error);
        toast.error('Failed to load subscription data');
      }
      return null;
    }

    if (!data.plan) {
      toast.error('Subscription plan information not found');
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      subscriptionPlanId: data.subscription_plan_id,
      startDate: data.start_date,
      endDate: data.end_date,
      paymentMethod: data.payment_method,
      status: data.status as 'active' | 'pending' | 'cancelled' | 'expired',
      creditsUsed: data.credits_used || 0,
      creditsRemaining: data.credits_remaining || 0,
      bookingsUsed: data.bookings_used || 0,
      bookingsRemaining: data.bookings_remaining || 0,
      autoRenew: data.auto_renew !== undefined ? data.auto_renew : true,
      plan: {
        id: data.plan.id,
        name: data.plan.name,
        description: data.plan.description,
        price: Number(data.plan.price),
        billingCycle: data.plan.billing_cycle,
        isActive: data.plan.is_active,
        features: convertJsonToFeatures(data.plan.features),
        credits: data.plan.credits,
        isPopular: data.plan.is_popular || false,
        maxBookings: data.plan.max_bookings,
        trialPeriodDays: data.plan.trial_period_days || 0,
        allowedServices: data.plan.allowed_services || 1
      }
    };
  } catch (error) {
    console.error('Unexpected error in fetchUserSubscription:', error);
    toast.error('Something went wrong while loading your subscription');
    return null;
  }
}

// Export the RPC functions
export { canPerformSubscriptionAction, recordSubscriptionUsage };

// Subscribe a user to a plan
export async function subscribeToPlan(
  userId: string,
  planId: string,
  paymentMethod: string
): Promise<Subscription | null> {
  try {
    // Calculate end date based on billing cycle
    const startDate = new Date();
    const endDate = new Date();
    
    // First get the plan details
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) {
      console.error('Error fetching plan details:', planError);
      toast.error('Failed to load subscription plan details');
      return null;
    }
    
    // Set end date based on billing cycle
    if (planData.billing_cycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      // Default to monthly
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Check for existing subscription
    const { data: existingData, error: existingError } = await supabase
      .from('user_subscriptions')
      .select('*, plan:subscription_plan_id(*)')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (existingError) {
      console.error('Error checking existing subscriptions:', existingError);
      toast.error('Failed to verify subscription status');
      return null;
    }

    // Begin transaction operations
    // If there's an existing subscription, update it to cancelled
    if (existingData && existingData.length > 0) {
      const now = new Date().toISOString();
      
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          cancellation_date: now,
          updated_at: now
        })
        .eq('id', existingData[0].id);

      if (updateError) {
        console.error('Error cancelling existing subscription:', updateError);
        toast.error('Failed to update existing subscription');
        return null;
      }
    }

    // Create new subscription
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert([{
        user_id: userId,
        subscription_plan_id: planId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        payment_method: paymentMethod,
        status: 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to create subscription');
      return null;
    }

    // Record the payment transaction
    const transactionData = {
      user_id: userId,
      subscription_id: data.id,
      amount: planData.price,
      transaction_type: existingData && existingData.length > 0 ? 
        (Number(planData.price) > Number(existingData[0].plan?.price || 0) ? 'upgrade' : 'downgrade') : 
        'subscription_payment',
      payment_method: paymentMethod,
      status: 'completed',
      description: `Subscription to ${planData.name} plan`
    };

    // Insert into subscription_transactions table
    await supabase
      .from('subscription_transactions')
      .insert({
        user_id: userId,
        subscription_plan_id: planId,
        amount: planData.price,
        payment_method: paymentMethod,
        status: 'completed'
      });

    // Update provider subscription tier if applicable
    try {
      await supabase
        .from('service_providers')
        .update({
          subscription_tier: planData.name.toLowerCase(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } catch (providerError) {
      console.error('Error updating provider profile:', providerError);
      // Continue anyway, this is not critical
    }

    toast.success(`Successfully subscribed to ${planData.name} plan`);

    // Return the new subscription with plan details
    return {
      id: data.id,
      userId: data.user_id,
      subscriptionPlanId: data.subscription_plan_id,
      startDate: data.start_date,
      endDate: data.end_date,
      paymentMethod: data.payment_method,
      status: data.status as 'active' | 'pending' | 'cancelled' | 'expired',
      creditsUsed: 0,
      creditsRemaining: planData.credits,
      bookingsUsed: 0,
      bookingsRemaining: planData.max_bookings,
      autoRenew: true,
      plan: {
        id: planData.id,
        name: planData.name,
        description: planData.description,
        price: Number(planData.price),
        billingCycle: planData.billing_cycle,
        isActive: planData.is_active,
        features: convertJsonToFeatures(planData.features),
        credits: planData.credits,
        isPopular: planData.is_popular || false,
        maxBookings: planData.max_bookings,
        trialPeriodDays: planData.trial_period_days || 0,
        allowedServices: planData.allowed_services || 1
      }
    };
  } catch (error) {
    console.error('Unexpected error in subscribeToPlan:', error);
    toast.error('Something went wrong during subscription process');
    return null;
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancellation_date: now,
        cancellation_reason: reason || 'User cancelled',
        auto_renew: false,
        updated_at: now
      })
      .eq('id', subscriptionId);

    if (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
      return false;
    }

    // Log the cancellation in the audit trail
    try {
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('user_id, subscription_plan_id')
        .eq('id', subscriptionId)
        .single();

      if (subData) {
        await supabase
          .from('subscription_audit_logs')
          .insert([{
            user_id: subData.user_id,
            subscription_id: subscriptionId,
            event_type: 'subscription_cancelled',
            new_state: {
              status: 'cancelled',
              cancellation_date: now,
              cancellation_reason: reason
            }
          }]);
      }
    } catch (auditError) {
      console.error('Error logging subscription cancellation:', auditError);
      // Continue anyway, this is not critical
    }

    toast.success('Subscription cancelled successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in cancelSubscription:', error);
    toast.error('Something went wrong while cancelling your subscription');
    return false;
  }
}

// Fetch subscription usage history
export async function fetchSubscriptionUsage(userId: string, metricName?: string): Promise<any[]> {
  try {
    let query = supabase
      .from('subscription_usage')
      .select(`
        id,
        metric_name,
        usage_count,
        usage_date,
        reference_id,
        created_at,
        subscription_id
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (metricName) {
      query = query.eq('metric_name', metricName);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching subscription usage:', error);
      toast.error('Failed to load usage history');
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in fetchSubscriptionUsage:', error);
    return [];
  }
}

// Fetch subscription invoices
export async function fetchSubscriptionInvoices(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('subscription_invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscription invoices:', error);
      toast.error('Failed to load invoice history');
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in fetchSubscriptionInvoices:', error);
    return [];
  }
}

// Toggle auto-renew setting
export async function toggleAutoRenew(subscriptionId: string, autoRenew: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        auto_renew: autoRenew,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);

    if (error) {
      console.error('Error updating auto-renew setting:', error);
      toast.error('Failed to update renewal settings');
      return false;
    }

    toast.success(autoRenew ? 
      'Subscription will automatically renew' : 
      'Auto-renewal has been disabled');
    return true;
  } catch (error) {
    console.error('Unexpected error in toggleAutoRenew:', error);
    toast.error('Something went wrong while updating your settings');
    return false;
  }
}

// For component importing
export { subscribeToPlan as subscribeUserToPlan };
