
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, UserSubscription } from '@/types/subscription';

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
