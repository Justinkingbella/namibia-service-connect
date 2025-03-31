
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Wallet, 
  RefreshCw, 
  Download,
  Copy,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PaymentMethod, Transaction, Withdrawal } from '@/types/booking';

// Mock data for payment methods
const mockPaymentMethods = [
  { id: '1', name: 'N$ Bank Transfer', type: 'bank_transfer', isDefault: true, details: 'Bank of Namibia - ****4567' },
  { id: '2', name: 'PayToday', type: 'pay_today', isDefault: false, details: 'Connected Account' },
  { id: '3', name: 'Mobile Wallet', type: 'e_wallet', isDefault: false, details: 'MTN Mobile Money - 098*****123' },
];

// Mock transactions
const mockTransactions: Transaction[] = [
  { 
    id: 't1', 
    bookingId: 'b1', 
    amount: 250, 
    fee: 25, 
    net: 225, 
    paymentMethod: 'pay_today', 
    status: 'completed', 
    date: new Date('2023-05-15'), 
    description: 'House Cleaning Service' 
  },
  { 
    id: 't2', 
    bookingId: 'b2', 
    amount: 120, 
    fee: 12, 
    net: 108, 
    paymentMethod: 'e_wallet', 
    status: 'completed', 
    date: new Date('2023-05-10'), 
    description: 'Plumbing Repair' 
  },
  { 
    id: 't3', 
    bookingId: 'b3', 
    amount: 75, 
    fee: 7.5, 
    net: 67.5, 
    paymentMethod: 'bank_transfer', 
    status: 'pending', 
    date: new Date('2023-05-05'), 
    description: 'Garden Maintenance' 
  },
];

// Mock withdrawals
const mockWithdrawals: Withdrawal[] = [
  {
    id: 'w1',
    providerId: 'p1',
    amount: 500,
    fee: 10,
    net: 490,
    method: 'bank_transfer',
    status: 'completed',
    accountDetails: 'Bank of Namibia - ****4567',
    date: new Date('2023-05-01'),
    reference: 'WD-12345'
  },
  {
    id: 'w2',
    providerId: 'p1',
    amount: 350,
    fee: 7,
    net: 343,
    method: 'e_wallet',
    status: 'processing',
    accountDetails: 'MTN Mobile Money - 098*****123',
    date: new Date('2023-04-15'),
    reference: 'WD-12340'
  }
];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NA', { style: 'currency', currency: 'NAD' }).format(amount);
};

// Format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

// Payment method display
const PaymentMethodCard = ({ 
  method, 
  onSetDefault, 
  onRemove 
}: { 
  method: typeof mockPaymentMethods[0], 
  onSetDefault: () => void, 
  onRemove: () => void 
}) => {
  return (
    <Card className={`${method.isDefault ? 'border-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{method.name}</CardTitle>
          {method.isDefault && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Default
            </Badge>
          )}
        </div>
        <CardDescription>{method.details}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2 flex justify-between">
        {!method.isDefault && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSetDefault}
          >
            Set as Default
          </Button>
        )}
        <Button 
          variant={method.isDefault ? "ghost" : "ghost"} 
          size="sm"
          onClick={onRemove}
          disabled={method.isDefault}
        >
          {method.isDefault ? "Cannot Remove Default" : "Remove"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PaymentDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('payment-methods');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('1'); // Default to first payment method

  // In a real app, these would be API calls
  const { data: paymentMethods } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => Promise.resolve(mockPaymentMethods),
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => Promise.resolve(mockTransactions),
  });

  const { data: withdrawals } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: () => Promise.resolve(mockWithdrawals),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Details</h1>
          <p className="text-muted-foreground">
            Manage your payment methods, view transactions, and withdraw funds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
              <CardDescription>Available for withdrawal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">N$ 1,245.00</div>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button>
                <Wallet className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Balance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Statement
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Payment Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods?.map(method => (
                <PaymentMethodCard 
                  key={method.id} 
                  method={method} 
                  onSetDefault={() => console.log('Set default', method.id)}
                  onRemove={() => console.log('Remove', method.id)}
                />
              ))}
              
              <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                <CardContent className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Add Payment Method</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a new bank account or mobile wallet to receive payments
                  </p>
                  <Button>
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Your payment method is used to receive payouts from your service bookings. 
                Make sure your details are correct to avoid payment delays.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your recent earnings from completed bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Fee</th>
                        <th className="text-left py-3 px-4">Net</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.map(transaction => (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4">{formatCurrency(transaction.amount)}</td>
                          <td className="py-3 px-4 text-destructive">-{formatCurrency(transaction.fee)}</td>
                          <td className="py-3 px-4 font-medium">{formatCurrency(transaction.net)}</td>
                          <td className="py-3 px-4">{getStatusBadge(transaction.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="ghost">View All Transactions</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Withdrawal</CardTitle>
                <CardDescription>
                  Withdraw your available balance to your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Withdrawal Amount (N$)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="Enter amount" 
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <select 
                      id="payment-method"
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                    >
                      {paymentMethods?.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.name} - {method.details}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex justify-between text-sm">
                      <span>Withdrawal amount:</span>
                      <span>{withdrawAmount ? formatCurrency(parseFloat(withdrawAmount)) : 'N$ 0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Fee (2%):</span>
                      <span className="text-destructive">
                        -{withdrawAmount ? formatCurrency(parseFloat(withdrawAmount) * 0.02) : 'N$ 0.00'}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>You'll receive:</span>
                      <span>
                        {withdrawAmount 
                          ? formatCurrency(parseFloat(withdrawAmount) * 0.98) 
                          : 'N$ 0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                >
                  Request Withdrawal
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
                <CardDescription>
                  Your recent withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Reference</th>
                        <th className="text-left py-3 px-4">Method</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals?.map(withdrawal => (
                        <tr key={withdrawal.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{formatDate(withdrawal.date)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {withdrawal.reference}
                              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                          <td className="py-3 px-4">{withdrawal.method}</td>
                          <td className="py-3 px-4 font-medium">{formatCurrency(withdrawal.amount)}</td>
                          <td className="py-3 px-4">{getStatusBadge(withdrawal.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetailsPage;
