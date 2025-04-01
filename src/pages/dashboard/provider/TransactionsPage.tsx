import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/common/Button';
import { Download, Filter, Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PaymentPaymentMethod } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: string;
  bookingId: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  amount: number;
  fee: number;
  net: number;
  paymentMethod: PaymentPaymentMethod;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: Date;
  description: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    bookingId: 'bkg-001',
    serviceId: 'srv-001',
    serviceName: 'Home Cleaning Service',
    customerName: 'John Doe',
    amount: 500,
    fee: 50,
    net: 450,
    paymentMethod: 'pay_today',
    status: 'completed',
    date: new Date(2023, 5, 15),
    description: 'Payment for home cleaning service',
  },
  {
    id: 'txn-002',
    bookingId: 'bkg-002',
    serviceId: 'srv-002',
    serviceName: 'Plumbing Repair',
    customerName: 'Jane Smith',
    amount: 350,
    fee: 35,
    net: 315,
    paymentMethod: 'e_wallet',
    status: 'completed',
    date: new Date(2023, 5, 10),
    description: 'Payment for plumbing repair',
  },
  {
    id: 'txn-003',
    bookingId: 'bkg-003',
    serviceId: 'srv-003',
    serviceName: 'Electrical Installation',
    customerName: 'Robert Johnson',
    amount: 600,
    fee: 60,
    net: 540,
    paymentMethod: 'bank_transfer',
    status: 'pending',
    date: new Date(2023, 5, 5),
    description: 'Payment for electrical installation',
  },
  {
    id: 'txn-004',
    bookingId: 'bkg-004',
    serviceId: 'srv-004',
    serviceName: 'Gardening Service',
    customerName: 'Emily Davis',
    amount: 250,
    fee: 25,
    net: 225,
    paymentMethod: 'cash',
    status: 'completed',
    date: new Date(2023, 4, 28),
    description: 'Payment for gardening service',
  },
  {
    id: 'txn-005',
    bookingId: 'bkg-005',
    serviceId: 'srv-005',
    serviceName: 'Painting Service',
    customerName: 'Michael Wilson',
    amount: 800,
    fee: 80,
    net: 720,
    paymentMethod: 'pay_today',
    status: 'refunded',
    date: new Date(2023, 4, 20),
    description: 'Refund for painting service',
  },
];

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // In a real app, fetch transactions from API
    // For now, we'll just use the mock data
    console.log('Fetching transactions for provider:', user?.id);
  }, [user]);

  const filteredTransactions = transactions
    .filter((txn) => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          txn.serviceName.toLowerCase().includes(searchLower) ||
          txn.customerName.toLowerCase().includes(searchLower) ||
          txn.bookingId.toLowerCase().includes(searchLower) ||
          txn.id.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter((txn) => {
      // Apply status filter
      if (statusFilter) {
        return txn.status === statusFilter;
      }
      return true;
    })
    .sort((a, b) => {
      // Apply date sorting
      if (dateSort === 'asc') {
        return a.date.getTime() - b.date.getTime();
      } else {
        return b.date.getTime() - a.date.getTime();
      }
    });

  const getPaymentMethodName = (method: PaymentPaymentMethod): string => {
    switch (method) {
      case 'pay_today':
        return 'PayToday';
      case 'pay_fast':
        return 'PayFast';
      case 'e_wallet':
        return 'E-Wallet';
      case 'easy_wallet':
        return 'EasyWallet';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      case 'dop':
        return 'DOP';
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalEarnings = transactions
    .filter((txn) => txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.net, 0);

  const pendingEarnings = transactions
    .filter((txn) => txn.status === 'pending')
    .reduce((sum, txn) => sum + txn.net, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your service transactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N${totalEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N${pendingEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transaction Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                          All Statuses
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                          Failed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('refunded')}>
                          Refunded
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Date {dateSort === 'asc' ? '↑' : '↓'}
                    </Button>

                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">Date</th>
                          <th className="text-left p-3 text-sm font-medium">Transaction ID</th>
                          <th className="text-left p-3 text-sm font-medium">Service</th>
                          <th className="text-left p-3 text-sm font-medium">Customer</th>
                          <th className="text-left p-3 text-sm font-medium">Amount</th>
                          <th className="text-left p-3 text-sm font-medium">Fee</th>
                          <th className="text-left p-3 text-sm font-medium">Net</th>
                          <th className="text-left p-3 text-sm font-medium">Method</th>
                          <th className="text-left p-3 text-sm font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-muted/50">
                              <td className="p-3 text-sm">{formatDate(transaction.date)}</td>
                              <td className="p-3 text-sm font-mono text-xs">{transaction.id}</td>
                              <td className="p-3 text-sm">{transaction.serviceName}</td>
                              <td className="p-3 text-sm">{transaction.customerName}</td>
                              <td className="p-3 text-sm">N${transaction.amount.toFixed(2)}</td>
                              <td className="p-3 text-sm text-muted-foreground">
                                -N${transaction.fee.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm font-medium">
                                N${transaction.net.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm">
                                {getPaymentMethodName(transaction.paymentMethod)}
                              </td>
                              <td className="p-3 text-sm">{getStatusBadge(transaction.status)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="p-4 text-center text-muted-foreground">
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {/* Similar content as "all" but filtered for completed transactions */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">Date</th>
                          <th className="text-left p-3 text-sm font-medium">Transaction ID</th>
                          <th className="text-left p-3 text-sm font-medium">Service</th>
                          <th className="text-left p-3 text-sm font-medium">Customer</th>
                          <th className="text-left p-3 text-sm font-medium">Amount</th>
                          <th className="text-left p-3 text-sm font-medium">Fee</th>
                          <th className="text-left p-3 text-sm font-medium">Net</th>
                          <th className="text-left p-3 text-sm font-medium">Method</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {transactions
                          .filter((txn) => txn.status === 'completed')
                          .map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-muted/50">
                              <td className="p-3 text-sm">{formatDate(transaction.date)}</td>
                              <td className="p-3 text-sm font-mono text-xs">{transaction.id}</td>
                              <td className="p-3 text-sm">{transaction.serviceName}</td>
                              <td className="p-3 text-sm">{transaction.customerName}</td>
                              <td className="p-3 text-sm">N${transaction.amount.toFixed(2)}</td>
                              <td className="p-3 text-sm text-muted-foreground">
                                -N${transaction.fee.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm font-medium">
                                N${transaction.net.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm">
                                {getPaymentMethodName(transaction.paymentMethod)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {/* Similar content as "all" but filtered for pending transactions */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">Date</th>
                          <th className="text-left p-3 text-sm font-medium">Transaction ID</th>
                          <th className="text-left p-3 text-sm font-medium">Service</th>
                          <th className="text-left p-3 text-sm font-medium">Customer</th>
                          <th className="text-left p-3 text-sm font-medium">Amount</th>
                          <th className="text-left p-3 text-sm font-medium">Fee</th>
                          <th className="text-left p-3 text-sm font-medium">Net</th>
                          <th className="text-left p-3 text-sm font-medium">Method</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {transactions
                          .filter((txn) => txn.status === 'pending')
                          .map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-muted/50">
                              <td className="p-3 text-sm">{formatDate(transaction.date)}</td>
                              <td className="p-3 text-sm font-mono text-xs">{transaction.id}</td>
                              <td className="p-3 text-sm">{transaction.serviceName}</td>
                              <td className="p-3 text-sm">{transaction.customerName}</td>
                              <td className="p-3 text-sm">N${transaction.amount.toFixed(2)}</td>
                              <td className="p-3 text-sm text-muted-foreground">
                                -N${transaction.fee.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm font-medium">
                                N${transaction.net.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm">
                                {getPaymentMethodName(transaction.paymentMethod)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunded" className="mt-6">
            {/* Similar content as "all" but filtered for refunded transactions */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">Date</th>
                          <th className="text-left p-3 text-sm font-medium">Transaction ID</th>
                          <th className="text-left p-3 text-sm font-medium">Service</th>
                          <th className="text-left p-3 text-sm font-medium">Customer</th>
                          <th className="text-left p-3 text-sm font-medium">Amount</th>
                          <th className="text-left p-3 text-sm font-medium">Fee</th>
                          <th className="text-left p-3 text-sm font-medium">Net</th>
                          <th className="text-left p-3 text-sm font-medium">Method</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {transactions
                          .filter((txn) => txn.status === 'refunded')
                          .map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-muted/50">
                              <td className="p-3 text-sm">{formatDate(transaction.date)}</td>
                              <td className="p-3 text-sm font-mono text-xs">{transaction.id}</td>
                              <td className="p-3 text-sm">{transaction.serviceName}</td>
                              <td className="p-3 text-sm">{transaction.customerName}</td>
                              <td className="p-3 text-sm">N${transaction.amount.toFixed(2)}</td>
                              <td className="p-3 text-sm text-muted-foreground">
                                -N${transaction.fee.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm font-medium">
                                N${transaction.net.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm">
                                {getPaymentMethodName(transaction.paymentMethod)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
