
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import SubscriptionPlans from '@/components/provider/SubscriptionPlans';
import { fetchUserSubscription, cancelSubscription, toggleAutoRenew, fetchSubscriptionPlans } from '@/services/subscriptionService';
import { useQuery } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { SubscriptionPlan } from '@/types/subscription';

const SubscriptionPageProvider = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plans = await fetchSubscriptionPlans();
        setAvailablePlans(plans.filter(plan => plan.isActive));
      } catch (error) {
        console.error('Error loading subscription plans:', error);
        toast.error('Failed to load subscription plans');
      }
    };
    loadPlans();
  }, []);

  const { data: subscription, isLoading, error, refetch } = useQuery({
    queryKey: ['providerSubscription', user?.id],
    queryFn: () => fetchUserSubscription(user?.id || ''),
    enabled: !!user?.id
  });

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    setIsProcessing(true);
    try {
      const success = await cancelSubscription(subscription.id, cancellationReason);
      if (success) {
        setShowCancelConfirm(false);
        refetch();
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleToggleAutoRenew = async (enabled: boolean) => {
    if (!subscription) return;
    
    setIsProcessing(true);
    try {
      const success = await toggleAutoRenew(subscription.id, enabled);
      if (success) {
        refetch();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getRemainingDays = () => {
    if (!subscription) return 0;
    const endDate = new Date(subscription.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderSubscriptionDetails = () => {
    if (!subscription || !subscription.plan) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Subscription</CardTitle>
              <Badge className={
                subscription.status === 'active' ? 'bg-green-500' :
                subscription.status === 'cancelled' ? 'bg-yellow-500' : 
                'bg-red-500'
              }>
                {subscription.status}
              </Badge>
            </div>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">{subscription.plan.name}</h3>
                <p className="text-muted-foreground">{subscription.plan.description}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Credits</span>
                    <span className="text-sm font-medium">
                      {subscription.credits_used}/{subscription.plan.credits}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${Math.min((subscription.credits_used || 0) / subscription.plan.credits * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Bookings</span>
                    <span className="text-sm font-medium">
                      {subscription.bookings_used}/{subscription.plan.maxBookings}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${Math.min((subscription.bookings_used || 0) / subscription.plan.maxBookings * 100, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 mb-1">
                    <span className="text-sm">Services</span>
                    <span className="text-sm font-medium">
                      0/{subscription.plan.allowedServices}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${0}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                <h4 className="font-medium mb-2">Subscription Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Cycle:</span>
                    <span>{subscription.plan.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span>N${subscription.plan.price}/{subscription.plan.billingCycle}</span>
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
                    <span className="text-muted-foreground">Days Remaining:</span>
                    <span>{getRemainingDays()} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="capitalize">{subscription.payment_method.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground">Auto-renew:</span>
                    <Switch 
                      checked={subscription.auto_renew} 
                      onCheckedChange={handleToggleAutoRenew}
                      disabled={isProcessing || subscription.status === 'cancelled'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard/provider/payment-details')}>
              Update Payment Method
            </Button>
            {subscription.status === 'active' && (
              <Button 
                variant="destructive" 
                onClick={() => setShowCancelConfirm(true)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Cancel Subscription'}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {showCancelConfirm && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Cancel Subscription</CardTitle>
              <CardDescription>
                Are you sure you want to cancel your subscription? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cancellation-reason" className="block text-sm font-medium">
                    Please tell us why you're cancelling (optional)
                  </label>
                  <textarea
                    id="cancellation-reason"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>What happens when you cancel:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Your subscription will remain active until the end of your billing period.</li>
                    <li>You will not be charged for the next billing cycle.</li>
                    <li>You will lose access to premium features when your subscription expires.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)} disabled={isProcessing}>
                Keep Subscription
              </Button>
              <Button variant="destructive" onClick={handleCancelSubscription} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Confirm Cancellation'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
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
            <AlertDescription>
              {error instanceof Error ? error.message : 'An error occurred while loading subscription details'}
            </AlertDescription>
          </Alert>
        )}
        
        {!isLoading && subscription && subscription.plan && (
          renderSubscriptionDetails()
        )}
        
        {!isLoading && !subscription && (
          <Alert className="mb-6 border-yellow-400 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-600">No Active Subscription</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You don't have an active subscription plan. Choose one to start offering services on our platform.
            </AlertDescription>
          </Alert>
        )}
        
        {!subscription?.status || subscription?.status === 'cancelled' ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
            <SubscriptionPlans />
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Change Plan</h2>
            <p className="text-sm text-muted-foreground mb-6">
              You can upgrade or downgrade your subscription at any time. Changes will take effect immediately.
            </p>
            <SubscriptionPlans />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPageProvider;
