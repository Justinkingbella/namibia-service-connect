
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PaymentMethod } from '@/types/payment';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Filter, 
  Calendar, 
  CreditCard, 
  Wallet, 
  Smartphone 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    date: new Date(),
    description: 'Payment for Home Cleaning Service',
    amount: 350,
    status: 'completed' as const,
    method: 'pay_today' as PaymentMethod,
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 2),
    description: 'Payment for Gardening Service',
    amount: 250,
    status: 'completed' as const,
    method: 'e_wallet' as PaymentMethod,
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000 * 5),
    description: 'Payment for Plumbing Service',
    amount: 450,
    status: 'completed' as const,
    method: 'easy_wallet' as PaymentMethod,
  },
  {
    id: '4',
    date: new Date(Date.now() - 86400000 * 10),
    description: 'Payment for Electrical Repair',
    amount: 550,
    status: 'pending' as const,
    method: 'bank_transfer' as PaymentMethod,
  },
  {
    id: '5',
    date: new Date(Date.now() - 86400000 * 15),
    description: 'Payment for Handyman Service',
    amount: 300,
    status: 'completed' as const,
    method: 'pay_today' as PaymentMethod,
  },
];

const PaymentHistoryPage = () => {
  const [filter, setFilter] = useState('all');
  const isMobile = useIsMobile();

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'pay_today':
        return <CreditCard className="h-4 w-4 mr-1" />;
      case 'e_wallet':
      case 'easy_wallet':
        return <Smartphone className="h-4 w-4 mr-1" />;
      case 'bank_transfer':
        return <Wallet className="h-4 w-4 mr-1" />;
      default:
        return <CreditCard className="h-4 w-4 mr-1" />;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'pay_today':
        return 'Pay Today';
      case 'e_wallet':
        return 'E-Wallet';
      case 'easy_wallet':
        return 'Easy Wallet';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.method === filter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">View all your past payments and transactions.</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>View and manage your payment history</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 w-full flex overflow-auto scrollbar-hide">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pay_today">Pay Today</TabsTrigger>
                <TabsTrigger value="e_wallet">E-Wallet</TabsTrigger>
                <TabsTrigger value="easy_wallet">Easy Wallet</TabsTrigger>
                <TabsTrigger value="bank_transfer">Bank Transfer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="overflow-hidden rounded-lg border">
                  <ScrollArea className={isMobile ? "h-[calc(100vh-370px)]" : ""}>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.date.toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {transaction.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                N${transaction.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  {getPaymentMethodIcon(transaction.method)}
                                  {getPaymentMethodName(transaction.method)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(transaction.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              {/* Duplicate for other tabs but showing filtered content */}
              <TabsContent value="pay_today" className="mt-0">
                {/* Same table structure but filtered for pay_today */}
                {/* ... */}
              </TabsContent>
              <TabsContent value="e_wallet" className="mt-0">
                {/* Same table structure but filtered for e_wallet */}
                {/* ... */}
              </TabsContent>
              <TabsContent value="easy_wallet" className="mt-0">
                {/* Same table structure but filtered for easy_wallet */}
                {/* ... */}
              </TabsContent>
              <TabsContent value="bank_transfer" className="mt-0">
                {/* Same table structure but filtered for bank_transfer */}
                {/* ... */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistoryPage;
