
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { usePaymentHistory } from '@/hooks/usePaymentHistory';
import { Calendar, Clock, FileText, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { getMockTransactionData } from '@/services/paymentService';
import { PaymentHistory } from '@/types/payments';

const TransactionsPage = () => {
  const { user } = useAuth();
  const { paymentHistory, loading, error } = usePaymentHistory();
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get mock transaction data for demonstration
  const mockTransactions = React.useMemo(() => {
    return getMockTransactionData(user?.id || '', 20);
  }, [user?.id]);

  // Function to filter transactions
  const getFilteredTransactions = () => {
    return mockTransactions
      .filter(t => statusFilter === 'all' || t.status === statusFilter)
      .filter(t => typeFilter === 'all' || t.type === typeFilter)
      .filter(t => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          t.description.toLowerCase().includes(query) ||
          t.reference?.toLowerCase().includes(query) ||
          t.type.toLowerCase().includes(query)
        );
      })
      .filter(t => {
        if (dateRange === 'all') return true;
        
        const date = new Date(t.date);
        const today = new Date();
        
        if (dateRange === 'today') {
          return date.toDateString() === today.toDateString();
        }
        
        if (dateRange === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= weekAgo;
        }
        
        if (dateRange === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return date >= monthAgo;
        }
        
        return true;
      });
  };

  const filteredTransactions = getFilteredTransactions();

  // Function to get the badge for a transaction status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'failed': 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get the appropriate variant for transaction type
  const getTransactionTypeVariant = (type: string) => {
    switch (type) {
      case 'booking':
        return 'default';
      case 'payout':
        return 'outline';
      case 'refund':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Track all your financial transactions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Transaction History
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select
                  value={dateRange}
                  onValueChange={setDateRange}
                >
                  <SelectTrigger className="w-[130px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="booking">Bookings</SelectItem>
                    <SelectItem value="payout">Payouts</SelectItem>
                    <SelectItem value="refund">Refunds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-md border">
              <div className="bg-muted/50 p-4 text-sm font-medium grid grid-cols-5 gap-4">
                <div>Date</div>
                <div>Description</div>
                <div>Type</div>
                <div>Status</div>
                <div className="text-right">Amount</div>
              </div>
              <div className="divide-y">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 text-sm grid grid-cols-5 gap-4">
                    <div className="font-medium">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </div>
                    <div>{transaction.description}</div>
                    <div>
                      <Badge variant={getTransactionTypeVariant(transaction.type)}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Badge>
                    </div>
                    <div>{getStatusBadge(transaction.status)}</div>
                    <div className={`text-right font-medium ${transaction.type === 'refund' || transaction.type === 'payout' ? 'text-red-500' : 'text-green-500'}`}>
                      {transaction.amount < 0 ? '−' : '+'} 
                      N${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
