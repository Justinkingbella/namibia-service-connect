import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon, XMarkIcon, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchSubscriptionPlans, subscribeUserToPlan } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/types/subscription';

const SubscriptionPlans = ({ onSelectPlan }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const data = await fetchSubscriptionPlans();
        setPlans(data.filter(plan => plan.isActive));
      } catch (error) {
        console.error('Failed to load subscription plans:', error);
        toast({
          title: "Error",
          description: "Failed to load subscription plans",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionPlans();
    
    // If we have a user, check their current subscription
    if (user?.id) {
      // This would be implemented in a real app
      // Here we just simulate with the standard plan
      setCurrentPlanId("2");
    }
  }, [user?.id]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan || !user?.id) return;
    
    try {
      // In a real implementation, we would use a payment process here
      // For demo purposes, we'll just directly subscribe the user
      const result = await subscribeUserToPlan(
        user.id,
        selectedPlan.id,
        'card_default' // This would come from payment flow in a real app
      );
      
      if (result.success) {
        toast({
          title: "Subscription Updated",
          description: `You are now subscribed to the ${selectedPlan.name} plan`,
        });
        setCurrentPlanId(selectedPlan.id);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to process subscription",
        variant: "destructive"
      });
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlanId === planId;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Choose Your Subscription Plan</h2>
        <p className="text-muted-foreground">
          Select a plan that best fits your business needs. Upgrade anytime as your business grows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col ${plan.isPopular ? 'border-primary shadow-lg' : ''} relative`}
          >
            {plan.isPopular && (
              <Badge className="absolute top-4 right-4 bg-primary text-white">
                Popular
              </Badge>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="mb-6">
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? 'Free' : `N$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/{plan.billingCycle}</span>
                )}
              </div>
              
              {renderTrialPeriod(plan)}
              
              <ul className="space-y-3">
                {plan.features.map((feature) => renderFeature(feature))}
                
                {plan.maxBookings && (
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Up to {plan.maxBookings} bookings/month</span>
                  </li>
                )}
                
                {plan.allowedServices && (
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Up to {plan.allowedServices} active services</span>
                  </li>
                )}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={isCurrentPlan(plan.id)}
                variant={plan.isPopular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan)}
              >
                {isCurrentPlan(plan.id) ? 'Current Plan' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              You're about to subscribe to the {selectedPlan?.name} plan.
              {selectedPlan?.price ? ` You will be charged N$${selectedPlan.price}/${selectedPlan.billingCycle}.` : ''}
              {selectedPlan?.trialPeriodDays ? ` Includes a ${selectedPlan.trialPeriodDays}-day free trial.` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-medium mb-2">Plan Features:</h3>
            <ul className="space-y-2">
              {selectedPlan?.features.map((feature) => (
                <li key={feature.name} className="flex items-center">
                  {feature.included ? (
                    <CheckIcon className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  )}
                  {feature.name}
                  {feature.limit !== undefined ? ` (${feature.limit})` : ""}
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubscription}>
              Confirm Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
