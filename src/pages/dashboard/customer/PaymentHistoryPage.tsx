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
  Smartphone,
  ChevronRight,
  AlertCircle,
  Building
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
  {
    id: '6',
    date: new Date(Date.now() - 86400000 * 20),
    description: 'Payment for Errand Service',
    amount: 180,
    status: 'completed' as const,
    method: 'pay_fast' as PaymentMethod,
  },
  {
    id: '7',
    date: new Date(Date.now() - 86400000 * 25),
    description: 'Payment for Home Delivery',
    amount: 120,
    status: 'failed' as const,
    method: 'dop' as PaymentMethod,
  },
];

const PaymentHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const isMobile = useIsMobile();
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'pay_today':
        return <CreditCard className="h-4 w-4 mr-1" />;
      case 'pay_fast':
        return <CreditCard className="h-4 w-4 mr-1" />;
      case 'dop':
        return <CreditCard className="h-4 w-4 mr-1" />;
      case 'e_wallet':
      case 'easy_wallet':
        return <Smartphone className="h-4 w-4 mr-1" />;
      case 'bank_transfer':
        return <Building className="h-4 w-4 mr-1" />;
      case 'cash':
        return <Wallet className="h-4 w-4 mr-1" />;
      default:
        return <CreditCard className="h-4 w-4 mr-1" />;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'pay_today':
        return 'Pay Today';
      case 'pay_fast':
        return 'PayFast';
      case 'dop':
        return 'DOP';
      case 'e_wallet':
        return 'E-Wallet';
      case 'easy_wallet':
        return 'Easy Wallet';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
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
    if (activeTab === 'all') return true;
    return transaction.method === activeTab;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedTransactionId(null);
  };

  const handleViewTransaction = (id: string) => {
    setSelectedTransactionId(id === selectedTransactionId ? null : id);
  };

  const selectedTransaction = selectedTransactionId 
    ? mockTransactions.find(t => t.id === selectedTransactionId) 
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full max-w-full mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">View all your past payments and transactions.</p>
        </div>

        <Card className="w-full">
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
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <ScrollArea className="w-full">
                <TabsList className="mb-4 w-full inline-flex overflow-x-auto px-1 py-1">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pay_today">Pay Today</TabsTrigger>
                  <TabsTrigger value="pay_fast">PayFast</TabsTrigger>
                  <TabsTrigger value="dop">DOP</TabsTrigger>
                  <TabsTrigger value="e_wallet">E-Wallet</TabsTrigger>
                  <TabsTrigger value="easy_wallet">Easy Wallet</TabsTrigger>
                  <TabsTrigger value="bank_transfer">Bank Transfer</TabsTrigger>
                  <TabsTrigger value="cash">Cash</TabsTrigger>
                </TabsList>
              </ScrollArea>
              
              <TabsContent value={activeTab} className="mt-0">
                {isMobile ? (
                  <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 flex flex-col items-center justify-center text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>No transactions found</p>
                      </div>
                    ) : (
                      <>
                        {filteredTransactions.map((transaction) => (
                          <div key={transaction.id} className="border rounded-lg overflow-hidden">
                            <div 
                              className="p-4 bg-white flex justify-between items-center cursor-pointer"
                              onClick={() => handleViewTransaction(transaction.id)}
                            >
                              <div>
                                <div className="flex items-center">
                                  {getPaymentMethodIcon(transaction.method)}
                                  <span className="font-medium">{getPaymentMethodName(transaction.method)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{transaction.date.toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <p className="font-semibold">N${transaction.amount.toLocaleString()}</p>
                                  <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                                </div>
                                <ChevronRight className={`h-5 w-5 transition-transform ${selectedTransactionId === transaction.id ? 'rotate-90' : ''}`} />
                              </div>
                            </div>
                            {selectedTransactionId === transaction.id && (
                              <div className="p-4 bg-gray-50 border-t">
                                <h4 className="font-medium mb-2">Transaction Details</h4>
                                <dl className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Transaction ID:</dt>
                                    <dd>{transaction.id}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Description:</dt>
                                    <dd>{transaction.description}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Date:</dt>
                                    <dd>{transaction.date.toLocaleDateString()}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Payment Method:</dt>
                                    <dd className="flex items-center">
                                      {getPaymentMethodIcon(transaction.method)}
                                      {getPaymentMethodName(transaction.method)}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Amount:</dt>
                                    <dd className="font-medium">N${transaction.amount.toLocaleString()}</dd>
                                  </div>
                                  <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Status:</dt>
                                    <dd>{getStatusBadge(transaction.status)}</dd>
                                  </div>
                                </dl>
                                <div className="mt-4 flex justify-end">
                                  <Button size="sm" variant="outline">Download Receipt</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <ScrollArea className="max-h-[calc(100vh-370px)]">
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
                            {filteredTransactions.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                  <div className="flex flex-col items-center justify-center">
                                    <AlertCircle className="h-8 w-8 mb-2" />
                                    <p>No transactions found</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewTransaction(transaction.id)}>
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
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                    
                    {selectedTransaction && (
                      <div className="p-4 bg-gray-50 border-t">
                        <div className="max-w-4xl mx-auto">
                          <h4 className="font-medium text-lg mb-4">Transaction Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Transaction ID</p>
                                <p className="font-medium">{selectedTransaction.id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{selectedTransaction.date.toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <div className="pt-1">{getStatusBadge(selectedTransaction.status)}</div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-medium">{selectedTransaction.description}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Payment Method</p>
                                <p className="font-medium flex items-center">
                                  {getPaymentMethodIcon(selectedTransaction.method)}
                                  {getPaymentMethodName(selectedTransaction.method)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-medium text-lg">N${selectedTransaction.amount.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 flex justify-end">
                            <Button variant="outline" size="sm" className="mr-2">
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </Button>
                            <Button size="sm" onClick={() => setSelectedTransactionId(null)}>
                              Close Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistoryPage;
