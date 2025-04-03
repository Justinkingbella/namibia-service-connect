
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus, Trash, CheckCircle, XCircle, Users, Clock, Tag, BarChart4 } from "lucide-react";
import { SubscriptionPlan } from "@/components/admin/SubscriptionForm";

// Mock subscription plans
const mockSubscriptionPlans = [
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

// Mock subscriptions
const mockSubscriptions = [
  {
    id: "1",
    userId: "user1",
    userName: "Alice Johnson",
    planId: "2",
    planName: "Standard",
    status: "active",
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 6, 15),
    paymentStatus: "paid",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Bob Smith",
    planId: "3",
    planName: "Premium",
    status: "active",
    startDate: new Date(2023, 4, 20),
    endDate: new Date(2023, 5, 20),
    paymentStatus: "paid",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Charlie Brown",
    planId: "2",
    planName: "Standard",
    status: "expired",
    startDate: new Date(2023, 3, 10),
    endDate: new Date(2023, 4, 10),
    paymentStatus: "overdue",
  }
];

// Mock transaciton history
const mockTransactions = [
  {
    id: "1",
    userId: "user1",
    userName: "Alice Johnson",
    amount: 299,
    date: new Date(2023, 5, 15),
    status: "completed",
    paymentMethod: "credit_card",
    description: "Standard Plan Subscription",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Bob Smith",
    amount: 899,
    date: new Date(2023, 4, 20),
    status: "completed",
    paymentMethod: "paypal",
    description: "Premium Plan Subscription",
  },
  {
    id: "3",
    userId: "user3",
    userName: "Charlie Brown",
    amount: 299,
    date: new Date(2023, 3, 10),
    status: "failed",
    paymentMethod: "credit_card",
    description: "Standard Plan Subscription",
  }
];

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState(mockSubscriptionPlans);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState("plans");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(tx => 
    tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
  };

  const handleUpdatePlan = (updatedPlan: any) => {
    setPlans(plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
    setEditingPlan(null);
  };

  const handleAddPlan = (newPlan: any) => {
    setPlans([...plans, { ...newPlan, id: Date.now().toString() }]);
  };

  const handleTogglePlanStatus = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
    ));
  };

  const formatCurrency = (amount: number) => {
    return amount === 0 ? "Free" : `N$${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-NA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage subscription plans, view active subscriptions, and transaction history
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>Plans</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-1">
              <BarChart4 className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
          </TabsList>

          {(activeTab === "subscriptions" || activeTab === "transactions") && (
            <div className="my-4">
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          )}

          <TabsContent value="plans" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setEditingPlan({} as SubscriptionPlan)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Plan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className={plan.isActive ? "" : "opacity-60"}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={plan.isActive}
                          onCheckedChange={() => handleTogglePlanStatus(plan.id)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/{plan.billingCycle}</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          {feature.included ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                          )}
                          <span>
                            {feature.name}
                            {feature.limit ? ` (${feature.limit})` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" onClick={() => handleEditPlan(plan)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {editingPlan && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-lg">
                  <CardHeader>
                    <CardTitle>{editingPlan.id ? "Edit Plan" : "Add New Plan"}</CardTitle>
                    <CardDescription>
                      {editingPlan.id
                        ? "Update the subscription plan details"
                        : "Create a new subscription plan"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Plan Name</Label>
                        <Input
                          id="name"
                          value={editingPlan.name || ""}
                          onChange={(e) =>
                            setEditingPlan({ ...editingPlan, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={editingPlan.description || ""}
                          onChange={(e) =>
                            setEditingPlan({ ...editingPlan, description: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (NAD)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={editingPlan.price || 0}
                          onChange={(e) =>
                            setEditingPlan({
                              ...editingPlan,
                              price: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingCycle">Billing Cycle</Label>
                        <select
                          id="billingCycle"
                          className="w-full px-3 py-2 border rounded"
                          value={editingPlan.billingCycle || "monthly"}
                          onChange={(e) =>
                            setEditingPlan({
                              ...editingPlan,
                              billingCycle: e.target.value,
                            })
                          }
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={editingPlan.isActive !== false}
                          onCheckedChange={(checked) =>
                            setEditingPlan({ ...editingPlan, isActive: checked })
                          }
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPopular"
                          checked={editingPlan.isPopular === true}
                          onCheckedChange={(checked) =>
                            setEditingPlan({ ...editingPlan, isPopular: checked })
                          }
                        />
                        <Label htmlFor="isPopular">Mark as Popular</Label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setEditingPlan(null)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (editingPlan.id) {
                          handleUpdatePlan(editingPlan);
                        } else {
                          handleAddPlan(editingPlan);
                        }
                      }}
                    >
                      {editingPlan.id ? "Update Plan" : "Create Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>
                  Manage user subscriptions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length > 0 ? (
                      filteredSubscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell>{sub.userName}</TableCell>
                          <TableCell>{sub.planName}</TableCell>
                          <TableCell>{formatDate(sub.startDate)}</TableCell>
                          <TableCell>{formatDate(sub.endDate)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sub.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View all subscription payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{tx.userName}</TableCell>
                          <TableCell>{formatCurrency(tx.amount)}</TableCell>
                          <TableCell>{formatDate(tx.date)}</TableCell>
                          <TableCell>
                            {tx.paymentMethod.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tx.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : tx.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{tx.description}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
