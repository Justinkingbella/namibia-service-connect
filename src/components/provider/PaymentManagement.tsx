import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { PaymentMethod } from '@/types';

const PaymentManagement = () => {
  const { paymentMethods, loading, addPaymentMethod, updatePaymentMethod, removePaymentMethod } = usePaymentMethods();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSetDefault = async (id: string) => {
    try {
      await updatePaymentMethod(id, { isDefault: true });
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removePaymentMethod(id);
    } catch (error) {
      console.error('Error removing payment method:', error);
    }
  };

  const renderPaymentMethods = () => {
    if (loading) return <div className="py-4">Loading payment methods...</div>;
    
    if (paymentMethods.length === 0) {
      return <div className="py-4 text-muted-foreground">No payment methods found. Add one to get started.</div>;
    }
    
    return (
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id} 
            className={`p-4 border rounded-lg flex justify-between items-center ${method.isDefault ? 'bg-muted' : ''}`}
          >
            <div>
              <div className="font-medium">{method.name}</div>
              <div className="text-sm text-muted-foreground">{method.type}</div>
              {method.isDefault && <div className="text-xs text-primary mt-1">Default</div>}
            </div>
            <div className="flex gap-2">
              {!method.isDefault && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Set Default
                </Button>
              )}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleRemove(method.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          className="gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Method
        </Button>
      </CardHeader>
      <CardContent>
        {showAddForm ? (
          <div className="mb-4 p-4 border rounded-lg">
            {/* Add payment method form would go here */}
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        ) : null}
        {renderPaymentMethods()}
      </CardContent>
    </Card>
  );
};

export default PaymentManagement;
