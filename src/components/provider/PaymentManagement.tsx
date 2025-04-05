import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Plus, Wallet, Trash2, Building as BankIcon } from 'lucide-react';
import { PaymentMethod } from '@/types/payments';

interface PaymentManagementProps {
  type?: string;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({ type = 'methods' }) => {
  const [activeTab, setActiveTab] = useState<string>(type);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'bank_transfer',
      name: 'Bank Windhoek',
      details: {
        accountNumber: '1234567890',
        branchCode: '123456',
        accountHolder: 'John Doe',
        accountType: 'Savings'
      },
      is_default: true,
      user_id: '',
      created_at: '',
      updated_at: ''
    },
    {
      id: '2',
      type: 'ewallet',
      name: 'MTC Mobile Money',
      details: {
        phoneNumber: '0811234567',
        holderName: 'John Doe'
      },
      is_default: false,
      user_id: '',
      created_at: '',
      updated_at: ''
    },
    {
      id: '3',
      type: 'payfast',
      name: 'PayFast',
      details: {
        email: 'john@example.com'
      },
      is_default: false,
      user_id: '',
      created_at: '',
      updated_at: ''
    }
  ]);

  const handleRemoveMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetDefaultMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      is_default: method.id === id
    })));
  };

  const renderPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return <BankIcon className="h-5 w-5 text-blue-500" />;
      case 'ewallet':
        return <Wallet className="h-5 w-5 text-green-500" />;
      case 'payfast':
      case 'dpo':
      case 'credit_card':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatMethodName = (method: PaymentMethod) => {
    const details = method.details;
    
    switch (method.type) {
      case 'bank_transfer':
        return `${method.name} (${details.accountNumber ? '••••' + details.accountNumber.slice(-4) : 'Unknown'})`;
      case 'ewallet':
        return `${method.name} (${details.phoneNumber ? '••••' + details.phoneNumber.slice(-4) : 'Unknown'})`;
      case 'payfast':
        return `${method.name} (${details.email ? details.email.slice(0, 3) + '••••' : 'Unknown'})`;
      default:
        return method.name;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
        <CardDescription>
          Manage payment methods and view transaction history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="methods" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Payment Methods</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Method
              </Button>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {renderPaymentMethodIcon(method.type)}
                    </div>
                    <div>
                      <div className="font-medium">{formatMethodName(method)}</div>
                      <div className="text-sm text-muted-foreground">
                        {method.type === 'bank_transfer' ? 'Bank Account' : 
                         method.type === 'ewallet' ? 'Mobile Money' :
                         method.type === 'payfast' ? 'PayFast Account' : 'Payment Method'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.is_default && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">Default</Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={method.is_default}
                      onClick={() => handleSetDefaultMethod(method.id)}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              {paymentMethods.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No payment methods</h3>
                  <p className="text-muted-foreground">
                    Add a payment method to receive payouts from your service bookings
                  </p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-1" /> Add Payment Method
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">
                          {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {i % 2 === 0 ? 'Payout' : 'Service payment'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {i % 2 === 0 ? '- ' : '+ '}
                          N${(Math.random() * 1000).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {i === 0 ? paymentMethods[0].name : 
                           i === 1 ? paymentMethods[1].name : 
                           paymentMethods[i % paymentMethods.length].name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={i % 3 === 0 ? 'outline' : 'default'} className={
                            i % 3 === 0 ? 'bg-yellow-50 text-yellow-700' : 
                            i % 3 === 1 ? 'bg-green-100 text-green-800' : 
                            'bg-blue-100 text-blue-800'
                          }>
                            {i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Completed' : 'Processing'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentManagement;
