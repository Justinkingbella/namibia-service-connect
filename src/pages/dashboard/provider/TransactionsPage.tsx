
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaymentHistory } from '@/hooks/usePaymentHistory';
import PaymentHistoryComponent from '@/components/provider/PaymentHistory';
import { Button } from '@/components/ui/button';
import { 
  Download, CreditCard, Filter, Search, 
  ArrowDownWideNarrow, ArrowUpWideNarrow
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isValid, parseISO } from 'date-fns';

const TransactionsPage = () => {
  const { paymentHistory, loading } = usePaymentHistory();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter and sort transactions
  const filteredTransactions = paymentHistory
    .filter((transaction) => {
      // Apply tab filter
      if (activeTab !== 'all' && transaction.type !== activeTab) return false;
      
      // Apply status filter
      if (filterStatus !== 'all' && transaction.status !== filterStatus) return false;
      
      // Apply payment method filter
      if (filterPaymentMethod !== 'all' && transaction.paymentMethod !== filterPaymentMethod) return false;
      
      // Apply search
      if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Extract unique payment methods
  const paymentMethods = Array.from(new Set(paymentHistory.map(t => t.paymentMethod)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              Manage and track all your transactions and payments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Withdraw Funds
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all your past transactions, payments, and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <TabsList className="mb-4 sm:mb-0">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="payment">Payments</TabsTrigger>
                  <TabsTrigger value="payout">Payouts</TabsTrigger>
                  <TabsTrigger value="refund">Refunds</TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortDirection === 'asc' 
                      ? <ArrowUpWideNarrow className="mr-2 h-4 w-4" /> 
                      : <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
                    }
                    Date
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                {paymentMethods.length > 0 && (
                  <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
                    <SelectTrigger className="w-[180px]">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Payment Method</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      {paymentMethods.map(method => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Description</th>
                        <th className="py-3 px-4 text-left font-medium">Type</th>
                        <th className="py-3 px-4 text-left font-medium">Amount</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center">Loading transactions...</td>
                        </tr>
                      ) : filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center">No transactions found.</td>
                        </tr>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b">
                            <td className="py-3 px-4">
                              {transaction.date ? formatDate(transaction.date) : formatDate(transaction.createdAt)}
                            </td>
                            <td className="py-3 px-4">{transaction.description}</td>
                            <td className="py-3 px-4 capitalize">{transaction.type}</td>
                            <td className="py-3 px-4">
                              <span className={transaction.type === 'refund' ? 'text-red-600' : transaction.type === 'payout' ? 'text-amber-600' : 'text-green-600'}>
                                {transaction.type === 'refund' || transaction.type === 'payout' ? '-' : '+'} 
                                N${transaction.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span 
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  transaction.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">{transaction.reference}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <PaymentHistoryComponent />
              </TabsContent>

              <TabsContent value="payout" className="space-y-4">
                <div className="py-8 text-center text-muted-foreground">
                  Payout history will be available soon.
                </div>
              </TabsContent>

              <TabsContent value="refund" className="space-y-4">
                <div className="py-8 text-center text-muted-foreground">
                  Refund history will be available soon.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
