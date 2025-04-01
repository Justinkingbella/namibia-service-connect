
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import SubscriptionPlans from '@/components/provider/SubscriptionPlans';

type Subscription = Tables<'user_subscriptions'> & {
  subscription_plans: Tables<'subscription_plans'>
};

const SubscriptionPageProvider = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans:subscription_plan_id (*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        setError('Error fetching subscription details. Please try again later.');
        console.error('Error fetching subscription:', error);
      } else {
        setSubscription(data);
        setError(null);
      }
    } catch (err) {
      setError('Unexpected error occurred. Please try again later.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    // Implementation for canceling subscription
    try {
      setIsLoading(true);
      
      if (!subscription) return;
      
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscription.id);
      
      if (error) {
        setError('Failed to cancel subscription. Please try again.');
        console.error('Error cancelling subscription:', error);
      } else {
        setSubscription(null);
        setError(null);
      }
    } catch (err) {
      setError('Unexpected error occurred. Please try again later.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground mt-1">Manage your subscription plan and preferences</p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!isLoading && subscription && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Subscription</CardTitle>
                  <Badge>{subscription.status}</Badge>
                </div>
                <CardDescription>Your active subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{subscription.subscription_plans.name}</h3>
                    <p className="text-muted-foreground">{subscription.subscription_plans.description}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Credits</span>
                        <span className="text-sm font-medium">
                          250/{subscription.subscription_plans.credits}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${Math.min(250 / subscription.subscription_plans.credits * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Bookings</span>
                        <span className="text-sm font-medium">
                          12/{subscription.subscription_plans.max_bookings}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${Math.min(12 / subscription.subscription_plans.max_bookings * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                    <h4 className="font-medium mb-2">Subscription Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing Cycle:</span>
                        <span>{subscription.subscription_plans.billing_cycle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span>N${subscription.subscription_plans.price}/{subscription.subscription_plans.billing_cycle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span>{new Date(subscription.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Renewal Date:</span>
                        <span>{new Date(subscription.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="capitalize">{subscription.payment_method}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => navigate('/dashboard/provider/payment-details')}>
                  Update Payment Method
                </Button>
                <Button variant="destructive" onClick={cancelSubscription}>
                  Cancel Subscription
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {!isLoading && !subscription && (
          <Alert variant="default" className="mb-6 border-yellow-400 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-600">No Active Subscription</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You don't have an active subscription plan. Choose one to start offering services on our platform.
            </AlertDescription>
          </Alert>
        )}
        
        {!subscription && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
            <SubscriptionPlans />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPageProvider;
