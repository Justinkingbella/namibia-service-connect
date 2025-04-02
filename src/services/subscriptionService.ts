
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, convertJsonToFeatures } from '@/types';
import { toast } from 'sonner';
import { recordPaymentTransaction } from './paymentService';

export interface Subscription {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  createdAt: string;
  updatedAt: string;
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
    price: Number(plan.price),
    billingCycle: plan.billing_cycle as 'monthly' | 'yearly',
    credits: plan.credits,
    maxBookings: plan.max_bookings,
    features: convertJsonToFeatures(plan.features),
    isPopular: plan.is_popular || false,
    isActive: plan.is_active || false,
    createdAt: plan.created_at || new Date().toISOString(),
    updatedAt: plan.updated_at || new Date().toISOString()
  }));
}

// Fetch a user's active subscription
export async function fetchUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      subscription_plans:subscription_plan_id (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user subscription:', error);
      toast.error('Failed to load subscription details');
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
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    plan: data.subscription_plans ? {
      id: data.subscription_plans.id,
      name: data.subscription_plans.name,
      description: data.subscription_plans.description,
      price: Number(data.subscription_plans.price),
      billingCycle: data.subscription_plans.billing_cycle as 'monthly' | 'yearly',
      credits: data.subscription_plans.credits,
      maxBookings: data.subscription_plans.max_bookings,
      features: convertJsonToFeatures(data.subscription_plans.features),
      isPopular: data.subscription_plans.is_popular || false,
      isActive: data.subscription_plans.is_active || false,
      createdAt: data.subscription_plans.created_at || new Date().toISOString(),
      updatedAt: data.subscription_plans.updated_at || new Date().toISOString()
    } : undefined
  };
}

// Subscribe a user to a plan
export async function subscribeUserToPlan(
  userId: string,
  planId: string,
  paymentMethod: string
): Promise<Subscription | null> {
  try {
    // Get plan details first
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;

    // Calculate end date based on billing cycle
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (planData.billing_cycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create subscription transaction record
    const { data: transactionData, error: transactionError } = await supabase
      .from('subscription_transactions')
      .insert([{
        user_id: userId,
        subscription_plan_id: planId,
        amount: planData.price,
        payment_method: paymentMethod,
        status: 'completed'
      }])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Create or update subscription
    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        subscription_plan_id: planId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        payment_method: paymentMethod,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    // Record payment transaction
    await recordPaymentTransaction({
      userId,
      amount: planData.price,
      fee: 0,
      netAmount: planData.price,
      transactionType: 'subscription',
      paymentMethod,
      referenceId: data.id,
      status: 'completed',
      description: `Subscription to ${planData.name} plan`
    });

    // Update provider's subscription tier if applicable
    const { error: providerError } = await supabase
      .from('service_providers')
      .update({ subscription_tier: planData.name.toLowerCase() })
      .eq('id', userId);

    if (providerError) {
      console.error('Error updating provider subscription tier:', providerError);
    }

    toast.success('Successfully subscribed to the plan');
    
    return {
      id: data.id,
      userId: data.user_id,
      subscriptionPlanId: data.subscription_plan_id,
      startDate: data.start_date,
      endDate: data.end_date,
      paymentMethod: data.payment_method,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      plan: {
        id: planData.id,
        name: planData.name,
        description: planData.description,
        price: Number(planData.price),
        billingCycle: planData.billing_cycle as 'monthly' | 'yearly',
        credits: planData.credits,
        maxBookings: planData.max_bookings,
        features: convertJsonToFeatures(planData.features),
        isPopular: planData.is_popular || false,
        isActive: planData.is_active || false,
        createdAt: planData.created_at || new Date().toISOString(),
        updatedAt: planData.updated_at || new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error subscribing to plan:', error);
    toast.error('Failed to subscribe to the plan');
    return null;
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId);

    if (error) throw error;
    
    toast.success('Subscription successfully cancelled');
    return true;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    toast.error('Failed to cancel subscription');
    return false;
  }
}

// Fetch all subscription transactions for a user
export async function fetchSubscriptionTransactions(userId: string) {
  const { data, error } = await supabase
    .from('subscription_transactions')
    .select(`
      *,
      subscription_plans:subscription_plan_id (name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscription transactions:', error);
    toast.error('Failed to load subscription history');
    return [];
  }

  return data.map(item => ({
    id: item.id,
    userId: item.user_id,
    planId: item.subscription_plan_id,
    planName: item.subscription_plans?.name || 'Unknown Plan',
    amount: Number(item.amount),
    paymentMethod: item.payment_method,
    status: item.status,
    paymentId: item.payment_id,
    createdAt: item.created_at
  }));
}
