import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, CreditCard, Wallet, BankIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PaymentDetailsPage = () => {
  const { user } = useAuth();

  // Mock payment methods for now
  const paymentMethods = [
    {
      id: '1',
      type: 'credit_card',
      name: 'Visa ending in 4242',
      details: {
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2024
      },
      isDefault: true
    },
    {
      id: '2',
      type: 'e_wallet',
      name: 'E-Wallet Account',
      details: {
        accountNumber: '081****789',
        provider: 'MTC'
      },
      isDefault: false
    }
  ];

  // Mock bank accounts
  const bankAccounts = [
    {
      id: '1',
      name: 'Main Bank Account',
      details: {
        bankName: 'Bank Windhoek',
        accountNumber: '****5678',
        accountType: 'Savings'
      },
      isDefault: true
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Details</h1>
          <p className="text-muted-foreground mt-1">Manage your payment methods and payout preferences</p>
        </div>
        
        <Tabs defaultValue="payment">
          <TabsList className="mb-6">
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="payout">Payout Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payment">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center">
                          {method.type === 'credit_card' ? (
                            <CreditCard className="h-5 w-5 mr-2" />
                          ) : (
                            <Wallet className="h-5 w-5 mr-2" />
                          )}
                          {method.name}
                        </CardTitle>
                        {method.isDefault && <Badge variant="outline">Default</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm text-muted-foreground">
                        {method.type === 'credit_card' ? (
                          <div className="space-y-1">
                            <div>Card: {method.details.brand.toUpperCase()}</div>
                            <div>Expires: {method.details.expiryMonth}/{method.details.expiryYear}</div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div>Provider: {method.details.provider}</div>
                            <div>Account: {method.details.accountNumber}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex gap-2">
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">Set as Default</Button>
                        )}
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Remove</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payout">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Payout Settings</h2>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Bank Account
                </Button>
              </div>
              
              <Alert>
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Payouts are processed every Friday. Make sure your bank account details are correct to avoid delays.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-2 gap-4">
                {bankAccounts.map((account) => (
                  <Card key={account.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center">
                          <BankIcon className="h-5 w-5 mr-2" />
                          {account.name}
                        </CardTitle>
                        {account.isDefault && <Badge variant="outline">Default</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Bank: {account.details.bankName}</div>
                        <div>Account Number: {account.details.accountNumber}</div>
                        <div>Account Type: {account.details.accountType}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex gap-2">
                        {!account.isDefault && (
                          <Button variant="outline" size="sm">Set as Default</Button>
                        )}
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Remove</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetailsPage;
