
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertJsonToFeatures } from '@/types/subscription';

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
}

export interface Subscription {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  plan?: SubscriptionPlan;
}

// Fetch all active subscription plans
export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
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
    price: plan.price,
    billingCycle: plan.billing_cycle,
    isActive: plan.is_active,
    features: convertJsonToFeatures(plan.features),
    credits: plan.credits,
    isPopular: plan.is_popular || false,
    maxBookings: plan.max_bookings
  }));
}

// Fetch a user's current subscription
export async function fetchUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      plan:subscription_plan_id (
        id,
        name,
        description,
        price,
        billing_cycle,
        is_active,
        features,
        credits,
        is_popular,
        max_bookings
      )
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

  return {
    id: data.id,
    userId: data.user_id,
    subscriptionPlanId: data.subscription_plan_id,
    startDate: data.start_date,
    endDate: data.end_date,
    paymentMethod: data.payment_method,
    status: data.status as 'active' | 'pending' | 'cancelled' | 'expired',
    plan: data.plan ? {
      id: data.plan.id,
      name: data.plan.name,
      description: data.plan.description,
      price: data.plan.price,
      billingCycle: data.plan.billing_cycle,
      isActive: data.plan.is_active,
      features: convertJsonToFeatures(data.plan.features),
      credits: data.plan.credits,
      isPopular: data.plan.is_popular || false,
      maxBookings: data.plan.max_bookings
    } : undefined
  };
}

// Subscribe a user to a plan
export async function subscribeToPlan(
  userId: string,
  planId: string,
  paymentMethod: string
): Promise<Subscription | null> {
  // Calculate end date based on billing cycle (assuming monthly for now)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

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

  // Check for existing subscription
  const { data: existingData, error: existingError } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active');

  if (existingError) {
    console.error('Error checking existing subscriptions:', existingError);
    toast.error('Failed to verify subscription status');
    return null;
  }

  // If there's an existing subscription, update it to cancelled
  if (existingData && existingData.length > 0) {
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
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
      status: 'active' as 'active' | 'pending' | 'cancelled' | 'expired'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription:', error);
    toast.error('Failed to create subscription');
    return null;
  }

  // Update provider subscription tier if applicable
  const { error: providerError } = await supabase
    .from('service_providers')
    .update({
      subscription_tier: planData.name.toLowerCase(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (providerError) {
    console.error('Error updating provider profile:', providerError);
    toast.error('Subscription created, but provider profile update failed');
  }

  toast.success(`Successfully subscribed to ${planData.name} plan`);

  return {
    id: data.id,
    userId: data.user_id,
    subscriptionPlanId: data.subscription_plan_id,
    startDate: data.start_date,
    endDate: data.end_date,
    paymentMethod: data.payment_method,
    status: data.status as 'active' | 'pending' | 'cancelled' | 'expired',
    plan: {
      id: planData.id,
      name: planData.name,
      description: planData.description,
      price: planData.price,
      billingCycle: planData.billing_cycle,
      isActive: planData.is_active,
      features: convertJsonToFeatures(planData.features),
      credits: planData.credits,
      isPopular: planData.is_popular || false,
      maxBookings: planData.max_bookings
    }
  };
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'cancelled' as 'active' | 'pending' | 'cancelled' | 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId);

  if (error) {
    console.error('Error cancelling subscription:', error);
    toast.error('Failed to cancel subscription');
    return false;
  }

  toast.success('Subscription cancelled successfully');
  return true;
}

// For component importing
export { subscribeToPlan as subscribeUserToPlan };
