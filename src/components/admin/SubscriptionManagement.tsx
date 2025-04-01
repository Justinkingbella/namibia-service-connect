
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/types';
import { SubscriptionForm } from './SubscriptionForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Mock data for subscription plans
const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic Plan',
    description: 'Perfect for individuals and small service providers',
    price: 49.99,
    billingCycle: 'monthly',
    credits: 100,
    maxBookings: 20,
    features: [
      { id: '1', name: 'Basic listing', description: 'List your services', included: true },
      { id: '2', name: 'Customer messaging', description: 'Message with customers', included: true },
      { id: '3', name: 'Analytics dashboard', description: 'Basic analytics', included: true },
      { id: '4', name: 'Priority support', description: '24/7 support access', included: false },
      { id: '5', name: 'Featured listing', description: 'Appear at the top of search', included: false },
    ],
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'Professional Plan',
    description: 'Ideal for growing service providers',
    price: 99.99,
    billingCycle: 'monthly',
    credits: 300,
    maxBookings: 50,
    features: [
      { id: '1', name: 'Basic listing', description: 'List your services', included: true },
      { id: '2', name: 'Customer messaging', description: 'Message with customers', included: true },
      { id: '3', name: 'Analytics dashboard', description: 'Advanced analytics', included: true },
      { id: '4', name: 'Priority support', description: '24/7 support access', included: true },
      { id: '5', name: 'Featured listing', description: 'Appear at the top of search', included: false },
    ],
    isPopular: true,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    description: 'For large service providers with multiple services',
    price: 199.99,
    billingCycle: 'monthly',
    credits: 1000,
    maxBookings: 200,
    features: [
      { id: '1', name: 'Basic listing', description: 'List your services', included: true },
      { id: '2', name: 'Customer messaging', description: 'Message with customers', included: true },
      { id: '3', name: 'Analytics dashboard', description: 'Advanced analytics', included: true },
      { id: '4', name: 'Priority support', description: '24/7 support access', included: true },
      { id: '5', name: 'Featured listing', description: 'Appear at the top of search', included: true },
    ],
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  }
];

const SubscriptionManagement = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingPlan(null);
    }
  };

  const handleCreateSubscription = (plan: SubscriptionPlan) => {
    // In a real app, this would be an API call
    const newPlan = {
      ...plan,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSubscriptionPlans([...subscriptionPlans, newPlan]);
    setIsOpen(false);
    
    toast({
      title: "Subscription Plan Created",
      description: `${plan.name} has been successfully created.`,
    });
  };

  const handleUpdateSubscription = (plan: SubscriptionPlan) => {
    // In a real app, this would be an API call
    const updatedPlans = subscriptionPlans.map(p => 
      p.id === plan.id ? { ...plan, updatedAt: new Date().toISOString() } : p
    );
    
    setSubscriptionPlans(updatedPlans);
    setIsOpen(false);
    setEditingPlan(null);
    
    toast({
      title: "Subscription Plan Updated",
      description: `${plan.name} has been successfully updated.`,
    });
  };

  const handleDeleteSubscription = (id: string) => {
    // In a real app, this would be an API call
    const planToDelete = subscriptionPlans.find(p => p.id === id);
    
    setSubscriptionPlans(subscriptionPlans.filter(p => p.id !== id));
    
    toast({
      title: "Subscription Plan Deleted",
      description: `${planToDelete?.name} has been successfully deleted.`,
      variant: "destructive",
    });
  };

  const handleEditSubscription = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsOpen(true);
  };

  const togglePlanStatus = (id: string) => {
    // In a real app, this would be an API call
    const updatedPlans = subscriptionPlans.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() } : p
    );
    
    setSubscriptionPlans(updatedPlans);
    
    const plan = updatedPlans.find(p => p.id === id);
    toast({
      title: `Subscription Plan ${plan?.isActive ? 'Activated' : 'Deactivated'}`,
      description: `${plan?.name} has been ${plan?.isActive ? 'activated' : 'deactivated'}.`,
    });
  };

  const filteredPlans = activeTab === 'all' 
    ? subscriptionPlans 
    : subscriptionPlans.filter(plan => 
        activeTab === 'active' ? plan.isActive : !plan.isActive
      );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
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
      
      {/* Plans List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className={`shadow-sm transition duration-200 ${!plan.isActive ? 'opacity-70' : ''}`}>
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
            
            <CardContent>
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
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature.id} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        ) : (
                          <X className="h-4 w-4 text-gray-300 mr-2 mt-0.5" />
                        )}
                        <span className={feature.included ? "" : "text-gray-400"}>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div>
                <Badge variant={plan.isActive ? "default" : "outline"} className="mr-2">
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex space-x-2">
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
        <div className="border rounded-md overflow-hidden">
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
        <SheetContent className="sm:max-w-lg overflow-y-auto max-h-screen">
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
