
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, CreditCard, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { subscribeUserToPlan } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/types/subscription';
import { Skeleton } from '@/components/ui/skeleton';
import { convertJsonToFeatures } from '@/types/subscription';

interface SubscriptionPlansProps {
  currentPlan?: string;
  onChangePlan?: (planId: string) => void;
  onSubscriptionChanged?: () => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  currentPlan = '',
  onChangePlan,
  onSubscriptionChanged
}) => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('pay_today');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  // Use the useRealtimeData hook to fetch subscription plans and listen for changes
  const { 
    data: plansData, 
    loading: isLoading, 
    error 
  } = useRealtimeData<any[]>({
    table: 'subscription_plans',
    onDataChange: (payload) => {
      console.log('Subscription plan changed:', payload);
    }
  });

  // Format the plans from Supabase to match our SubscriptionPlan type
  const plans: SubscriptionPlan[] = plansData ? plansData
    .filter((plan: any) => plan.is_active)
    .map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: Number(plan.price),
      billingCycle: plan.billing_cycle,
      credits: plan.credits,
      maxBookings: plan.max_bookings,
      features: convertJsonToFeatures(plan.features),
      isPopular: plan.is_popular || false,
      isActive: plan.is_active || false,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at
    }))
    .sort((a: SubscriptionPlan, b: SubscriptionPlan) => a.price - b.price) : [];

  const handleSubscribe = async () => {
    if (!user?.id || !selectedPlan) return;

    setIsProcessing(true);
    try {
      const subscription = await subscribeUserToPlan(user.id, selectedPlan, paymentMethod);
      if (subscription) {
        if (onChangePlan) {
          onChangePlan(selectedPlan);
        }
        if (onSubscriptionChanged) {
          onSubscriptionChanged();
        }
        setIsUpgradeModalOpen(false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const openSubscribeModal = (planId: string) => {
    setSelectedPlan(planId);
    setIsUpgradeModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
        <h3 className="font-medium">Error loading subscription plans</h3>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                    onClick={() => openSubscribeModal(plan.id)}
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
            <Button onClick={handleSubscribe} disabled={isProcessing}>
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
