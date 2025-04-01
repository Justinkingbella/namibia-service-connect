
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PaymentMethod } from '@/types/payment';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
  ExternalLink
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    date: new Date(),
    description: 'Payment received for Home Cleaning Service',
    amount: 350,
    fee: 35,
    net: 315,
    status: 'completed' as const,
    method: 'pay_today' as PaymentMethod,
    customer: 'John Doe',
    phone: '081234567',
    bookingId: 'BKG-12345',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 2),
    description: 'Payment received for Deep Cleaning Service',
    amount: 500,
    fee: 50,
    net: 450,
    status: 'completed' as const,
    method: 'e_wallet' as PaymentMethod,
    customer: 'Jane Smith',
    phone: '0812345678',
    bookingId: 'BKG-12346',
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000 * 5),
    description: 'Payment received for Post-Construction Cleaning',
    amount: 750,
    fee: 75,
    net: 675,
    status: 'completed' as const,
    method: 'easy_wallet' as PaymentMethod,
    customer: 'Michael Brown',
    phone: '0813456789',
    bookingId: 'BKG-12347',
  },
  {
    id: '4',
    date: new Date(Date.now() - 86400000 * 8),
    description: 'Payment received for Home Repair',
    amount: 450,
    fee: 45,
    net: 405,
    status: 'pending' as const,
    method: 'bank_transfer' as PaymentMethod,
    customer: 'Sam Wilson',
    phone: '0814567890',
    bookingId: 'BKG-12348',
  },
  {
    id: '5',
    date: new Date(Date.now() - 86400000 * 12),
    description: 'Payment received for Electrical Work',
    amount: 650,
    fee: 65,
    net: 585,
    status: 'completed' as const,
    method: 'pay_today' as PaymentMethod,
    customer: 'Maria Johnson',
    phone: '0815678901',
    bookingId: 'BKG-12349',
  },
];

const TransactionsPage = () => {
  const [filter, setFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
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
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">View all your payments received and platform fees.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Earnings</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">N$ 2,700.00</div>
              <p className="text-sm text-muted-foreground mt-1">After platform fees</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">This Month</CardTitle>
              <CardDescription>June 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">N$ 1,125.00</div>
              <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Platform Fees</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">N$ 270.00</div>
              <p className="text-sm text-muted-foreground mt-1">10% of total transactions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>View and manage your earnings</CardDescription>
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
                  <ScrollArea className={isMobile ? "h-[calc(100vh-490px)]" : ""}>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                -N${transaction.fee.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                N${transaction.net.toLocaleString()}
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
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Drawer>
                                  <DrawerTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => setSelectedTransaction(transaction)}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      <span className="sr-only">View</span>
                                    </Button>
                                  </DrawerTrigger>
                                  <DrawerContent>
                                    <DrawerHeader>
                                      <DrawerTitle>Transaction Details</DrawerTitle>
                                      <DrawerDescription>
                                        View complete information about this transaction
                                      </DrawerDescription>
                                    </DrawerHeader>
                                    {selectedTransaction && (
                                      <div className="px-4 pb-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                          <div>
                                            <h4 className="text-sm font-medium text-gray-500">Transaction ID</h4>
                                            <p className="font-medium">{selectedTransaction.id}</p>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-medium text-gray-500">Booking ID</h4>
                                            <p className="font-medium">{selectedTransaction.bookingId}</p>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-medium text-gray-500">Date</h4>
                                            <p className="font-medium">
                                              {selectedTransaction.date.toLocaleDateString()} at {selectedTransaction.date.toLocaleTimeString()}
                                            </p>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                            <p>{getStatusBadge(selectedTransaction.status)}</p>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                                            <p className="font-medium">{selectedTransaction.customer}</p>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                                            <p className="font-medium">{selectedTransaction.phone}</p>
                                          </div>
                                        </div>

                                        <div className="rounded-md bg-gray-50 p-4 mb-4">
                                          <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm text-gray-500">Method</p>
                                              <p className="font-medium flex items-center">
                                                {getPaymentMethodIcon(selectedTransaction.method)}
                                                {getPaymentMethodName(selectedTransaction.method)}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Description</p>
                                              <p className="font-medium">{selectedTransaction.description}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Amount</p>
                                              <p className="font-medium">N${selectedTransaction.amount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-gray-500">Fee</p>
                                              <p className="font-medium text-red-500">
                                                -N${selectedTransaction.fee.toLocaleString()}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                              <p className="font-medium">Net Amount</p>
                                              <p className="font-bold text-green-600">
                                                N${selectedTransaction.net.toLocaleString()}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <DrawerFooter>
                                      <Button>Download Receipt</Button>
                                      <DrawerClose asChild>
                                        <Button variant="outline">Close</Button>
                                      </DrawerClose>
                                    </DrawerFooter>
                                  </DrawerContent>
                                </Drawer>
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
          <CardFooter className="border-t pt-4 flex justify-between">
            <p className="text-sm text-muted-foreground">Showing {filteredTransactions.length} of {filteredTransactions.length} transactions</p>
            <Button variant="outline" size="sm">
              View More
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
