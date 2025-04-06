
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod, PaymentMethodType } from '@/types';
import { CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const PaymentManagement = () => {
  const { paymentMethods, loading, deletePaymentMethod, setDefaultPaymentMethod } = usePaymentMethods();
  const { toast } = useToast();
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({
    name: '',
    type: 'credit_card' as PaymentMethodType,
    isDefault: false,
    details: {}
  });

  const handleAddMethod = () => {
    // This would typically integrate with a payment provider
    // For now, we're just simulating adding a method
    toast({
      title: 'Payment Method Added',
      description: `${newMethod.name} has been added to your account.`,
      variant: 'default'
    });

    setIsAddingMethod(false);
    setNewMethod({
      name: '',
      type: 'credit_card',
      isDefault: false,
      details: {}
    });
  };

  const handleRemove = async (id: string) => {
    try {
      const success = await deletePaymentMethod(id);
      if (success) {
        toast({
          title: 'Payment Method Removed',
          description: 'The payment method has been removed from your account.',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove payment method. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const success = await setDefaultPaymentMethod(id);
      if (success) {
        toast({
          title: 'Default Payment Method Updated',
          description: 'Your default payment method has been updated.',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to update default payment method. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getMethodIcon = (type: PaymentMethodType) => {
    // Custom icon logic based on payment method type
    return <CreditCard className="h-5 w-5" />;
  };

  const getMethodTypeLabel = (type: PaymentMethodType) => {
    if (type === 'credit_card') return 'Credit Card';
    if (type === 'debit_card') return 'Debit Card';
    if (type === 'bank_transfer') return 'Bank Transfer';
    if (type === 'e_wallet') return 'E-Wallet';
    if (type === 'cash') return 'Cash';
    if (type === 'mobile_money') return 'Mobile Money';
    if (type === 'payfast') return 'PayFast';
    if (type === 'ewallet') return 'E-Wallet';
    return type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your payment methods and default payment options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="methods">
          <TabsList className="mb-4">
            <TabsTrigger value="methods">Your Payment Methods</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="methods">
            <div className="space-y-4">
              {loading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : paymentMethods.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    You haven't added any payment methods yet. Add your first payment method to receive payments.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getMethodIcon(method.type)}
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{getMethodTypeLabel(method.type)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault ? (
                          <Button variant="outline" size="sm" disabled>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Default
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                            Set Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleRemove(method.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {isAddingMethod ? (
                <div className="border p-4 rounded-lg space-y-4">
                  <h4 className="font-medium">Add New Payment Method</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Method Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="e.g. My Visa Card"
                        value={newMethod.name}
                        onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Payment Type</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={newMethod.type}
                        onChange={(e) => setNewMethod({...newMethod, type: e.target.value as PaymentMethodType})}
                      >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="e_wallet">E-Wallet</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <input
                      type="checkbox"
                      id="default-method"
                      checked={newMethod.isDefault}
                      onChange={(e) => setNewMethod({...newMethod, isDefault: e.target.checked})}
                    />
                    <label htmlFor="default-method">Set as default payment method</label>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={handleAddMethod}>Save Method</Button>
                    <Button variant="outline" onClick={() => setIsAddingMethod(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setIsAddingMethod(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Payment Method
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="wallet">
            <div className="p-6 text-center border rounded-lg">
              <h3 className="text-xl font-medium mb-2">Wallet Balance</h3>
              <p className="text-3xl font-bold mb-4">N$0.00</p>
              <p className="text-muted-foreground mb-4">
                Your wallet allows you to receive payments for your services directly.
              </p>
              <Button disabled>Top Up Wallet (Coming Soon)</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentManagement;
