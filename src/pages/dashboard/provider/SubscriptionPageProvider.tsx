
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubscriptionPlans from '@/components/provider/SubscriptionPlans';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const SubscriptionPageProvider = () => {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchCurrentSubscription = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans:subscription_plan_id (*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }
      
      setCurrentSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePlan = async (planId: string) => {
    await fetchCurrentSubscription();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Subscription</h1>
          <p className="text-muted-foreground mt-1">Manage your service provider subscription plan</p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="space-y-2 text-center">
              <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground">Loading your subscription...</p>
            </div>
          </div>
        ) : (
          <>
            {currentSubscription ? (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Current Subscription</CardTitle>
                      <CardDescription>Your active subscription plan</CardDescription>
                    </div>
                    <Badge className="w-fit">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Plan</div>
                      <div className="text-lg font-semibold">{currentSubscription.subscription_plans?.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Price</div>
                      <div className="text-lg font-semibold">
                        N${currentSubscription.subscription_plans?.price}/{currentSubscription.subscription_plans?.billing_cycle}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Renewal Date</div>
                      <div className="text-lg font-semibold">
                        {format(new Date(currentSubscription.end_date), 'PPP')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Payment Method</div>
                      <div className="capitalize text-lg font-semibold">
                        {currentSubscription.payment_method?.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Usage</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Credits</span>
                          <span className="text-sm font-medium">
                            250/{currentSubscription.subscription_plans?.credits}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${Math.min(250 / currentSubscription.subscription_plans?.credits * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Bookings</span>
                          <span className="text-sm font-medium">
                            12/{currentSubscription.subscription_plans?.max_bookings}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${Math.min(12 / currentSubscription.subscription_plans?.max_bookings * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {currentSubscription.end_date && new Date(currentSubscription.end_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                    <Alert variant="warning" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Subscription Expiring Soon</AlertTitle>
                      <AlertDescription>
                        Your subscription will expire on {format(new Date(currentSubscription.end_date), 'PPP')}. 
                        Please renew your subscription to avoid service interruption.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>No Active Subscription</CardTitle>
                  <CardDescription>Choose a subscription plan to start offering services</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Subscription Required</AlertTitle>
                    <AlertDescription>
                      You need an active subscription to offer services on our platform.
                      Please choose a subscription plan below to continue.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
            
            <SubscriptionPlans 
              currentPlan={currentSubscription?.subscription_plan_id} 
              onChangePlan={handleChangePlan}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPageProvider;
