
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/types/subscription';
import { SubscriptionForm } from './SubscriptionForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SubscriptionManagement = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setSubscriptionPlans(data || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingPlan(null);
    }
  };

  const handleCreateSubscription = async (plan: SubscriptionPlan) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([plan])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setSubscriptionPlans([...subscriptionPlans, data]);
      setIsOpen(false);
      
      toast({
        title: "Subscription Plan Created",
        description: `${plan.name} has been successfully created.`,
      });
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription plan.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubscription = async (plan: SubscriptionPlan) => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(plan)
        .eq('id', plan.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setSubscriptionPlans(subscriptionPlans.map(p => p.id === data.id ? data : p));
      setIsOpen(false);
      setEditingPlan(null);
      
      toast({
        title: "Subscription Plan Updated",
        description: `${plan.name} has been successfully updated.`,
      });
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription plan.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      const planToDelete = subscriptionPlans.find(p => p.id === id);
      
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setSubscriptionPlans(subscriptionPlans.filter(p => p.id !== id));
      
      toast({
        title: "Subscription Plan Deleted",
        description: `${planToDelete?.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription plan.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubscription = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsOpen(true);
  };

  const togglePlanStatus = async (id: string) => {
    try {
      const plan = subscriptionPlans.find(p => p.id === id);
      if (!plan) return;
      
      const updatedPlan = { 
        ...plan, 
        isActive: !plan.isActive, 
        updatedAt: new Date().toISOString() 
      };
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(updatedPlan)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setSubscriptionPlans(subscriptionPlans.map(p => p.id === id ? data : p));
      
      toast({
        title: `Subscription Plan ${data.isActive ? 'Activated' : 'Deactivated'}`,
        description: `${data.name} has been ${data.isActive ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      console.error('Error toggling plan status:', error);
      toast({
        title: "Error",
        description: "Failed to update plan status.",
        variant: "destructive",
      });
    }
  };

  const filteredPlans = activeTab === 'all' 
    ? subscriptionPlans 
    : subscriptionPlans.filter(plan => 
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={() => setIsOpen(true)}>
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
                {plan.isPopular && (
                  <Badge className="bg-green-600">Popular</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="mb-4">
                <div className="text-2xl font-bold">N${plan.price}</div>
                <div className="text-sm text-muted-foreground">per {plan.billingCycle}</div>
              </div>
              
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
                >
                  {plan.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleEditSubscription(plan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDeleteSubscription(plan.id)}
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
          <Button onClick={() => setIsOpen(true)}>
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
                      >
                        {plan.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditSubscription(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDeleteSubscription(plan.id)}
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
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SubscriptionManagement;
