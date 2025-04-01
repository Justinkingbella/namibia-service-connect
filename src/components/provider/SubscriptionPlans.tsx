
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, CreditCard, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan } from '@/types/subscription';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionPlansProps {
  currentPlan?: string;
  onChangePlan?: (planId: string) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  currentPlan = '',
  onChangePlan 
}) => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('pay_today');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('isActive', true)
        .order('price', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast.error("Failed to load subscription plans.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("You must be logged in to change your subscription.");
      return;
    }

    setIsProcessing(true);
    try {
      // Find the plan
      const plan = plans.find(p => p.id === selectedPlan);
      if (!plan) throw new Error("Selected plan not found");

      // In a real app, this would connect to a payment gateway
      // For now, we'll simulate a subscription update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the user's subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_plan_id: selectedPlan,
          payment_method: paymentMethod,
          status: 'active',
          start_date: new Date().toISOString(),
          // For demo, subscription lasts 30 days for monthly, 365 for yearly
          end_date: new Date(
            Date.now() + (plan.billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
          ).toISOString(),
        });
      
      if (error) throw error;
      
      if (onChangePlan) {
        onChangePlan(selectedPlan);
      }
      
      toast.success(`Successfully switched to ${plan.name} plan!`);
      setIsUpgradeModalOpen(false);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast.error("Failed to process subscription change. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openUpgradeModal = (planId: string) => {
    setSelectedPlan(planId);
    setIsUpgradeModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="space-y-2 text-center">
          <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Subscription Plans</h2>
        <p className="text-muted-foreground">Choose the plan that works for your business</p>
      </div>
      
      {plans.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No subscription plans available at the moment.</p>
          <p className="text-sm">Please check back later or contact support.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`border-gray-200 h-full flex flex-col ${currentPlan === plan.id ? 'ring-2 ring-primary' : ''} ${plan.isPopular ? 'shadow-md' : ''} relative`}>
              {plan.isPopular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <Badge className="bg-primary text-white">Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">N${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.billingCycle}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Credits</div>
                    <div className="text-xl font-bold">{plan.credits}</div>
                    <div className="text-xs text-muted-foreground">credits per {plan.billingCycle}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Max Bookings</div>
                    <div className="text-xl font-bold">{plan.maxBookings}</div>
                    <div className="text-xs text-muted-foreground">bookings per {plan.billingCycle}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Features:</div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature.id} className="flex items-start">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-gray-300 mr-2 mt-0.5 shrink-0" />
                          )}
                          <span className={feature.included ? "" : "text-gray-400"}>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto pt-4 border-t">
                {currentPlan === plan.id ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.isPopular ? "default" : "outline"}
                    onClick={() => openUpgradeModal(plan.id)}
                  >
                    {Number(plans.find(p => p.id === currentPlan)?.price || 0) > plan.price 
                      ? 'Downgrade' 
                      : 'Upgrade'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan && plans.length > 0 ? (
                <>
                  {Number(plans.find(p => p.id === currentPlan)?.price || 0) > 
                   Number(plans.find(p => p.id === selectedPlan)?.price || 0)
                    ? 'Downgrade to ' 
                    : 'Upgrade to '}
                  {plans.find(p => p.id === selectedPlan)?.name}
                </>
              ) : 'Change Subscription Plan'}
            </DialogTitle>
            <DialogDescription>
              {Number(plans.find(p => p.id === currentPlan)?.price || 0) > 
               Number(plans.find(p => p.id === selectedPlan)?.price || 0)
                ? 'Are you sure you want to downgrade? You will lose access to premium features.'
                : 'Choose your payment method to complete the upgrade.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span>Subscription fee</span>
                <span className="font-medium">
                  N${plans.find(p => p.id === selectedPlan)?.price}/{plans.find(p => p.id === selectedPlan)?.billingCycle}
                </span>
              </div>
              
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="pay_today" id="pay_today" />
                  <Label htmlFor="pay_today" className="flex-1">PayToday</Label>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="pay_fast" id="pay_fast" />
                  <Label htmlFor="pay_fast" className="flex-1">PayFast</Label>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="e_wallet" id="e_wallet" />
                  <Label htmlFor="e_wallet" className="flex-1">E-Wallet</Label>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="flex-1">Bank Transfer</Label>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
              </RadioGroup>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsUpgradeModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleUpgrade} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isProcessing ? "Processing..." : 
                Number(plans.find(p => p.id === currentPlan)?.price || 0) > 
                Number(plans.find(p => p.id === selectedPlan)?.price || 0) 
                  ? "Confirm Downgrade" 
                  : "Complete Upgrade"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-medium mb-2">Enterprise Solutions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Need custom solutions for your business? Contact our sales team for tailored
          enterprise packages with advanced features and dedicated support.
        </p>
        <Button variant="outline" size="sm">
          Contact Enterprise Sales
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
