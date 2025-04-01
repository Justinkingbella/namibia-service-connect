import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, BarChart2, Download, ArrowDown, CheckCircle, Clock } from 'lucide-react';
import { PaymentPaymentMethod } from '@/types';

interface PaymentManagementProps {
  providerId?: string;
}

type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface Transaction {
  id: string;
  amount: number;
  fee: number;
  net: number;
  date: Date;
  bookingId: string;
  serviceName: string;
  paymentMethod: PaymentPaymentMethod;
  status: 'completed' | 'pending' | 'failed';
}

interface Withdrawal {
  id: string;
  amount: number;
  fee: number;
  net: number;
  date: Date;
  method: string;
  accountDetails: string;
  status: WithdrawalStatus;
}

const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    amount: 500,
    fee: 50,
    net: 450,
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
    bookingId: '1',
    serviceName: 'Home Cleaning Service',
    paymentMethod: 'pay_today',
    status: 'completed'
  },
  {
    id: 'trans-2',
    amount: 350,
    fee: 35,
    net: 315,
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
    bookingId: '2',
    serviceName: 'Plumbing Repair',
    paymentMethod: 'e_wallet',
    status: 'completed'
  },
  {
    id: 'trans-3',
    amount: 300,
    fee: 30,
    net: 270,
    date: new Date(Date.now() - 86400000 * 7), // 7 days ago
    bookingId: '3',
    serviceName: 'Deep Cleaning',
    paymentMethod: 'pay_today',
    status: 'completed'
  }
];

const mockWithdrawals: Withdrawal[] = [
  {
    id: 'with-1',
    amount: 800,
    fee: 10,
    net: 790,
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    method: 'Bank Transfer',
    accountDetails: '**** 1234',
    status: 'completed'
  },
  {
    id: 'with-2',
    amount: 500,
    fee: 5,
    net: 495,
    date: new Date(Date.now() - 86400000 * 10), // 10 days ago
    method: 'E-Wallet',
    accountDetails: '0812345678',
    status: 'completed'
  },
  {
    id: 'with-3',
    amount: 600,
    fee: 6,
    net: 594,
    date: new Date(),
    method: 'PayFast',
    accountDetails: 'user@example.com',
    status: 'pending'
  }
];

export const PaymentManagement: React.FC<PaymentManagementProps> = ({ providerId }) => {
  const [activeTab, setActiveTab] = useState('earnings');
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>('bank_transfer');
  
  const totalEarnings = mockTransactions.reduce((sum, transaction) => sum + transaction.net, 0);
  const pendingEarnings = mockTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, transaction) => sum + transaction.net, 0);
  const availableBalance = totalEarnings - mockWithdrawals
    .filter(w => w.status !== 'failed')
    .reduce((sum, withdrawal) => sum + withdrawal.net, 0);

  const getStatusBadge = (status: WithdrawalStatus | 'completed' | 'pending' | 'failed') => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 mr-1" /> Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Clock className="h-3 w-3 mr-1" /> Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodName = (method: PaymentPaymentMethod) => {
    switch (method) {
      case 'pay_today': return 'PayToday';
      case 'pay_fast': return 'PayFast';
      case 'e_wallet': return 'E-Wallet';
      case 'dop': return 'DOP';
      case 'easy_wallet': return 'EasyWallet';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cash': return 'Cash';
      default: return method;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
        <CardDescription>
          Track your earnings, request withdrawals, and view payment history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <h3 className="text-2xl font-bold">N${totalEarnings.toFixed(2)}</h3>
                </div>
                <BarChart2 className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <h3 className="text-2xl font-bold">N${availableBalance.toFixed(2)}</h3>
                </div>
                <DollarSign className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Earnings</p>
                  <h3 className="text-2xl font-bold">N${pendingEarnings.toFixed(2)}</h3>
                </div>
                <Clock className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="earnings" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="request">Request Withdrawal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earnings">
            <div className="rounded-md border">
              <div className="flex justify-between p-4">
                <h3 className="font-medium">Recent Transactions</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 text-sm font-medium">Date</th>
                      <th className="text-left p-3 text-sm font-medium">Service</th>
                      <th className="text-left p-3 text-sm font-medium">Payment Method</th>
                      <th className="text-left p-3 text-sm font-medium">Amount</th>
                      <th className="text-left p-3 text-sm font-medium">Fee</th>
                      <th className="text-left p-3 text-sm font-medium">Net</th>
                      <th className="text-left p-3 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-muted/50">
                        <td className="p-3 text-sm">{formatDate(transaction.date)}</td>
                        <td className="p-3 text-sm">{transaction.serviceName}</td>
                        <td className="p-3 text-sm">{getPaymentMethodName(transaction.paymentMethod)}</td>
                        <td className="p-3 text-sm">N${transaction.amount.toFixed(2)}</td>
                        <td className="p-3 text-sm text-muted-foreground">-N${transaction.fee.toFixed(2)}</td>
                        <td className="p-3 text-sm font-medium">N${transaction.net.toFixed(2)}</td>
                        <td className="p-3 text-sm">{getStatusBadge(transaction.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="withdrawals">
            <div className="rounded-md border">
              <div className="flex justify-between p-4">
                <h3 className="font-medium">Withdrawal History</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 text-sm font-medium">Date</th>
                      <th className="text-left p-3 text-sm font-medium">Method</th>
                      <th className="text-left p-3 text-sm font-medium">Account</th>
                      <th className="text-left p-3 text-sm font-medium">Amount</th>
                      <th className="text-left p-3 text-sm font-medium">Fee</th>
                      <th className="text-left p-3 text-sm font-medium">Net</th>
                      <th className="text-left p-3 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-muted/50">
                        <td className="p-3 text-sm">{formatDate(withdrawal.date)}</td>
                        <td className="p-3 text-sm">{withdrawal.method}</td>
                        <td className="p-3 text-sm">{withdrawal.accountDetails}</td>
                        <td className="p-3 text-sm">N${withdrawal.amount.toFixed(2)}</td>
                        <td className="p-3 text-sm text-muted-foreground">-N${withdrawal.fee.toFixed(2)}</td>
                        <td className="p-3 text-sm font-medium">N${withdrawal.net.toFixed(2)}</td>
                        <td className="p-3 text-sm">{getStatusBadge(withdrawal.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="request">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Request Withdrawal</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Available balance: <span className="font-medium">N${availableBalance.toFixed(2)}</span>
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="amount">
                      Amount (N$)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min="0"
                      max={availableBalance}
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="method">
                      Withdrawal Method
                    </label>
                    <select
                      id="method"
                      value={withdrawalMethod}
                      onChange={(e) => setWithdrawalMethod(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="e_wallet">E-Wallet</option>
                      <option value="pay_fast">PayFast</option>
                      <option value="dop">DOP</option>
                      <option value="easy_wallet">EasyWallet</option>
                    </select>
                  </div>
                  
                  {withdrawalMethod === 'bank_transfer' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="bank">
                          Bank Name
                        </label>
                        <input
                          id="bank"
                          type="text"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="account">
                          Account Number
                        </label>
                        <input
                          id="account"
                          type="text"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  )}
                  
                  {(withdrawalMethod === 'e_wallet' || withdrawalMethod === 'dop' || withdrawalMethod === 'easy_wallet') && (
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  )}
                  
                  {withdrawalMethod === 'pay_fast' && (
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button disabled={withdrawalAmount <= 0 || withdrawalAmount > availableBalance}>
                      <ArrowDown className="h-4 w-4 mr-2" /> Request Withdrawal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentManagement;
