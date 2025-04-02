import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X, Info, AlertTriangle, Zap, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan, convertJsonToFeatures, convertFeaturesToJson } from '@/types/subscription';
import { SubscriptionForm } from './SubscriptionForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRealtimeData } from '@/hooks/useRealtimeData';

const SubscriptionManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use real-time data hook to get and listen for subscription plan changes
  const { 
    data: subscriptionPlans = [], 
    loading: isLoading, 
    error, 
    refetch 
  } = useRealtimeData<any>({
    table: 'subscription_plans',
    onDataChange: (payload) => {
      console.log('Subscription plan changed:', payload);
      if (payload.eventType === 'INSERT') {
        toast.success('New subscription plan added');
      } else if (payload.eventType === 'UPDATE') {
        toast.success('Subscription plan updated');
      } else if (payload.eventType === 'DELETE') {
        toast.success('Subscription plan deleted');
      }
    }
  });

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingPlan(null);
    }
  };

  const handleCreateSubscription = async (plan: SubscriptionPlan) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setPermissionError(null);
    
    try {
      // Convert features to the correct format
      const planToInsert = {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        billing_cycle: plan.billingCycle,
        features: convertFeaturesToJson(plan.features),
        credits: plan.credits,
        max_bookings: plan.maxBookings,
        is_popular: plan.isPopular || false,
        is_active: plan.isActive,
        trial_period_days: plan.trialPeriodDays || 0,
        allowed_services: plan.allowedServices || 1,
        sort_order: plan.sortOrder || 0
      };
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([planToInsert])
        .select();
      
      if (error) {
        throw error;
      }
      
      setIsOpen(false);
      toast.success(`${plan.name} has been successfully created.`);
      
      // The real-time subscription should automatically update the UI
      await refetch();
    } catch (error: any) {
      console.error('Error creating subscription plan:', error);
      
      if (error.code === '42501') {
        setPermissionError("Permission denied. You don't have sufficient privileges to create subscription plans.");
      } else {
        toast.error("Failed to create subscription plan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubscription = async (plan: SubscriptionPlan) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setPermissionError(null);
    
    try {
      // Convert features to the correct format
      const planToUpdate = {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        billing_cycle: plan.billingCycle,
        features: convertFeaturesToJson(plan.features),
        credits: plan.credits,
        max_bookings: plan.maxBookings,
        is_popular: plan.isPopular || false,
        is_active: plan.isActive,
        trial_period_days: plan.trialPeriodDays || 0,
        allowed_services: plan.allowedServices || 1,
        sort_order: plan.sortOrder || 0,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('subscription_plans')
        .update(planToUpdate)
        .eq('id', plan.id);
      
      if (error) {
        throw error;
      }
      
      setIsOpen(false);
      setEditingPlan(null);
      toast.success(`${plan.name} has been successfully updated.`);
      
      // The real-time subscription should automatically update the UI
      await refetch();
    } catch (error: any) {
      console.error('Error updating subscription plan:', error);
      
      if (error.code === '42501') {
        setPermissionError("Permission denied. You don't have sufficient privileges to update subscription plans.");
      } else {
        toast.error("Failed to update subscription plan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setPermissionError(null);
    
    try {
      const planToDelete = subscriptionPlans.find((p: any) => p.id === id);
      
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success(`${planToDelete?.name} has been successfully deleted.`);
      
      // The real-time subscription should automatically update the UI
      await refetch();
    } catch (error: any) {
      console.error('Error deleting subscription plan:', error);
      
      if (error.code === '42501') {
        setPermissionError("Permission denied. You don't have sufficient privileges to delete subscription plans.");
      } else {
        toast.error("Failed to delete subscription plan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubscription = (plan: SubscriptionPlan) => {
    // Create a properly formatted plan for editing
    const formattedPlan: SubscriptionPlan = {
      ...plan,
      features: plan.features && Array.isArray(plan.features) 
        ? plan.features.map((f: any) => ({
            id: f.id || crypto.randomUUID(),
            name: f.name || '',
            description: f.description || '',
            included: f.included !== undefined ? f.included : true
          }))
        : []
    };
    
    setEditingPlan(formattedPlan);
    setIsOpen(true);
  };

  const togglePlanStatus = async (id: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setPermissionError(null);
    
    try {
      const plan = subscriptionPlans.find((p: any) => p.id === id);
      if (!plan) return;
      
      const updatedStatus = !plan.is_active;
      
      const { error } = await supabase
        .from('subscription_plans')
        .update({ 
          is_active: updatedStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success(`${plan.name} has been ${updatedStatus ? 'activated' : 'deactivated'}.`);
      
      // The real-time subscription should automatically update the UI
      await refetch();
    } catch (error: any) {
      console.error('Error toggling plan status:', error);
      
      if (error.code === '42501') {
        setPermissionError("Permission denied. You don't have sufficient privileges to update subscription plans.");
      } else {
        toast.error("Failed to update plan status.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format plan data from Supabase to match our SubscriptionPlan type
  const formattedPlans = subscriptionPlans.map((plan: any) => ({
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
    trialPeriodDays: plan.trial_period_days || 0,
    allowedServices: plan.allowed_services || 1,
    sortOrder: plan.sort_order || 0,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at
  }));

  const filteredPlans = activeTab === 'all' 
    ? formattedPlans 
    : formattedPlans.filter(plan => 
        activeTab === 'active' ? plan.isActive : !plan.isActive
      );

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
      {permissionError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Permission Error</AlertTitle>
          <AlertDescription>{permissionError}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load subscription plans'}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={() => setIsOpen(true)} disabled={isSubmitting}>
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>
      
      {/* Plans Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className={`shadow-sm transition duration-200 h-full flex flex-col ${!plan.isActive ? 'opacity-70' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {plan.isPopular && (
                    <Badge className="bg-green-600">Popular</Badge>
                  )}
                  {plan.trialPeriodDays > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {plan.trialPeriodDays} Day Trial
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="mb-4">
                <div className="text-2xl font-bold">N${plan.price}</div>
                <div className="text-sm text-muted-foreground">per {plan.billingCycle}</div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                
                <div>
                  <div className="text-sm font-medium">Allowed Services</div>
                  <div className="text-xl font-bold">{plan.allowedServices}</div>
                  <div className="text-xs text-muted-foreground">service listings</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Features:</div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
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
            
            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 border-t pt-4 mt-auto">
              <div>
                <Badge variant={plan.isActive ? "default" : "outline"} className="mr-2">
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 sm:flex-none"
                  onClick={() => togglePlanStatus(plan.id)}
                  disabled={isSubmitting}
                >
                  {plan.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleEditSubscription(plan)}
                  disabled={isSubmitting}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDeleteSubscription(plan.id)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredPlans.length === 0 && (
        <div className="text-center py-10 border border-dashed rounded-md">
          <Info className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-1">No Plans Found</h3>
          <p className="text-muted-foreground mb-4">There are no subscription plans in this category.</p>
          <Button onClick={() => setIsOpen(true)} disabled={isSubmitting}>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </div>
      )}
      
      {/* Table View for larger screens */}
      <div className="hidden lg:block mt-8">
        <h2 className="text-xl font-semibold mb-4">Subscription Plans Table View</h2>
        <div className="border rounded-md overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price (N$)</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Max Bookings</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Trial</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    {plan.name}
                    {plan.isPopular && (
                      <Badge className="ml-2 bg-green-600">Popular</Badge>
                    )}
                  </TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell>{plan.billingCycle}</TableCell>
                  <TableCell>{plan.credits}</TableCell>
                  <TableCell>{plan.maxBookings}</TableCell>
                  <TableCell>{plan.allowedServices}</TableCell>
                  <TableCell>{plan.trialPeriodDays > 0 ? `${plan.trialPeriodDays} days` : '-'}</TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "default" : "outline"}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => togglePlanStatus(plan.id)}
                        disabled={isSubmitting}
                      >
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditSubscription(plan)}
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDeleteSubscription(plan.id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Subscription Form Sheet */}
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-lg w-full overflow-y-auto max-h-screen">
          <SheetHeader>
            <SheetTitle>{editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</SheetTitle>
            <SheetDescription>
              {editingPlan 
                ? 'Make changes to the existing subscription plan.' 
                : 'Fill in the details to create a new subscription plan.'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            <SubscriptionForm 
              initialData={editingPlan} 
              onSubmit={editingPlan ? handleUpdateSubscription : handleCreateSubscription}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SubscriptionManagement;
