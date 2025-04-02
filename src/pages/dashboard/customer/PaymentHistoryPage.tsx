
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fetchUserTransactions } from '@/services/paymentService';

const PaymentHistoryPage = () => {
  const { user } = useAuth();
  const [transactionType, setTransactionType] = React.useState<string>('all');

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['customerPaymentTransactions', user?.id, transactionType],
    queryFn: async () => {
      const allTransactions = await fetchUserTransactions(user?.id || '');
      
      if (transactionType === 'all') {
        return allTransactions;
      }
      
      return allTransactions.filter(t => t.transactionType === transactionType);
    },
    enabled: !!user?.id
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-muted-foreground mt-1">View your payment and transaction history</p>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end mb-4">
            <Select
              value={transactionType}
              onValueChange={setTransactionType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="booking">Bookings</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>View your entire payment history</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 gap-2 p-4 text-sm font-medium border-b bg-muted/50">
                      <div>Date</div>
                      <div>Description</div>
                      <div>Type</div>
                      <div>Method</div>
                      <div>Status</div>
                      <div className="text-right">Amount</div>
                    </div>
                    <div className="divide-y">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="grid grid-cols-6 gap-2 p-4 text-sm">
                          <div className="font-medium">
                            {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                          </div>
                          <div>{transaction.description || 'Transaction'}</div>
                          <div><Badge variant="secondary">{transaction.transactionType}</Badge></div>
                          <div className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</div>
                          <div>{getStatusBadge(transaction.status)}</div>
                          <div className={`text-right font-medium ${transaction.transactionType === 'refund' ? 'text-green-600' : ''}`}>
                            {transaction.transactionType === 'refund' ? '+' : ''}
                            N${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>No transactions found</AlertTitle>
                    <AlertDescription>
                      Your payment history will appear here once you have made payments.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Payments</CardTitle>
                <CardDescription>Payments for service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Similar content to "all" tab but filtered to booking transactions */}
                <Alert>
                  <AlertTitle>No booking payments found</AlertTitle>
                  <AlertDescription>
                    Your booking payment history will appear here.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="refunds">
            <Card>
              <CardHeader>
                <CardTitle>Refunds</CardTitle>
                <CardDescription>Refunds and credits received</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Similar content to "all" tab but filtered to refund transactions */}
                <Alert>
                  <AlertTitle>No refunds found</AlertTitle>
                  <AlertDescription>
                    Your refund history will appear here.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistoryPage;
