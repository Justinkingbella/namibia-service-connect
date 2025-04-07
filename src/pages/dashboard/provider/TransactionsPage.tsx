
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { PaymentHistory, PaymentMethodType } from '@/types';
import { CalendarIcon, DownloadIcon, FilterIcon, SearchIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { format } from 'date-fns';
import { usePaymentHistory } from '@/hooks/usePaymentHistory';
import { cn } from '@/lib/utils';

// Mock data for early development
const mockTransactions: PaymentHistory[] = [
  {
    id: '1',
    userId: 'user1',
    bookingId: 'booking1',
    amount: 250,
    description: 'House Cleaning Service Booking',
    status: 'completed',
    paymentMethod: 'pay_today' as PaymentMethodType, // Type assertion
    transactionId: 'tx_123456',
    createdAt: new Date().toISOString(),
    type: 'credit',
    date: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'user1',
    bookingId: 'booking2',
    amount: 350,
    description: 'Plumbing Repair Service',
    status: 'pending',
    paymentMethod: 'bank_transfer' as PaymentMethodType, // Type assertion
    transactionId: 'tx_123457',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    type: 'credit',
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    userId: 'user1',
    bookingId: 'booking3',
    amount: 500,
    description: 'Electrical Installation',
    status: 'completed',
    paymentMethod: 'cash' as PaymentMethodType,
    transactionId: 'tx_123458',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    type: 'credit',
    date: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    userId: 'user1',
    bookingId: 'booking4',
    amount: 1200,
    description: 'Full House Moving Service',
    status: 'failed',
    paymentMethod: 'credit_card' as PaymentMethodType,
    transactionId: 'tx_123459',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    type: 'credit',
    date: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '5',
    userId: 'user1',
    bookingId: 'booking5',
    amount: 750,
    description: 'Payout',
    status: 'completed',
    paymentMethod: 'pay_today' as PaymentMethodType, // Type assertion
    transactionId: 'tx_123460',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    type: 'debit',
    date: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: '6',
    userId: 'user1',
    bookingId: 'booking6',
    amount: 180,
    description: 'Tutoring Session',
    status: 'processing',
    paymentMethod: 'mobile_money' as PaymentMethodType,
    transactionId: 'tx_123461',
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    type: 'credit',
    date: new Date(Date.now() - 432000000).toISOString()
  }
];

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<PaymentHistory[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<PaymentHistory[]>(mockTransactions);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'processing' | 'failed'>('all');

  // For real implementation, use the custom hook
  // const { paymentHistory, loading } = usePaymentHistory();

  // Apply filters when any filter state changes
  React.useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.description?.toLowerCase().includes(term) || 
        tx.transactionId?.toLowerCase().includes(term)
      );
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let cutoff: Date;
      
      switch(dateFilter) {
        case '7days':
          cutoff = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30days':
          cutoff = new Date(now.setDate(now.getDate() - 30));
          break;
        case '90days':
          cutoff = new Date(now.setDate(now.getDate() - 90));
          break;
        default:
          cutoff = new Date(0); // Beginning of time
      }
      
      filtered = filtered.filter(tx => new Date(tx.createdAt) >= cutoff);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Apply tab filter (all, income, payouts)
    if (activeTab === 'income') {
      filtered = filtered.filter(tx => tx.type === 'credit');
    } else if (activeTab === 'payouts') {
      filtered = filtered.filter(tx => tx.type === 'debit');
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, dateFilter, statusFilter, activeTab, transactions]);

  const getPaymentMethodLabel = (method: PaymentMethodType) => {
    // Handle all payment method types correctly
    if (method === 'pay_today') {
      return "PayToday";
    } else if (method === 'pay_fast') {
      return "PayFast";
    } else if (method === 'bank_transfer' || method === 'Bank Transfer') {
      return "Bank Transfer";
    } else if (method === 'mobile_money') {
      return "Mobile Money";
    } else if (method === 'dop') {
      return "Direct Operator Payment";
    } else {
      // Handle other payment methods by converting to title case
      return method
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'credit' ? 'Income' : 'Payout';
  };

  const getTypeBadge = (type: string) => {
    return type === 'credit' 
      ? <Badge variant="outline" className="bg-green-50 text-green-700">Income</Badge>
      : <Badge variant="outline" className="bg-blue-50 text-blue-700">Payout</Badge>;
  };

  const totalIncome = filteredTransactions
    .filter(tx => tx.type === 'credit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPayouts = filteredTransactions
    .filter(tx => tx.type === 'debit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">View and manage your payment history</p>
          </div>
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Download Statement
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {filteredTransactions.filter(tx => tx.type === 'credit' && tx.status === 'completed').length} paid bookings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPayouts)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {filteredTransactions.filter(tx => tx.type === 'debit' && tx.status === 'completed').length} withdrawals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  filteredTransactions
                    .filter(tx => tx.type === 'credit' && (tx.status === 'pending' || tx.status === 'processing'))
                    .reduce((sum, tx) => sum + tx.amount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {filteredTransactions.filter(tx => tx.type === 'credit' && (tx.status === 'pending' || tx.status === 'processing')).length} bookings
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all your payments and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                <TabsList>
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="payouts">Payouts</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FilterIcon className="h-4 w-4" />
                        Filter
                        <span className="sr-only">Filter options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => setDateFilter('all')}>
                        All Time
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateFilter('7days')}>
                        Last 7 days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateFilter('30days')}>
                        Last 30 days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateFilter('90days')}>
                        Last 90 days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        All Statuses
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('processing')}>
                        Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                        Failed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="flex items-center gap-2">
                    <DownloadIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found matching your filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Method</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {format(new Date(transaction.createdAt), 'dd MMM yyyy')}
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(transaction.createdAt), 'h:mm a')}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {transaction.transactionId}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {getTypeBadge(transaction.type || 'credit')}
                          </td>
                          <td className={cn(
                            "py-3 px-4 font-medium",
                            transaction.type === 'credit' ? "text-green-600" : "text-blue-600"
                          )}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </td>
                          <td className="py-3 px-4">
                            {getPaymentMethodLabel(transaction.paymentMethod)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(transaction.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
