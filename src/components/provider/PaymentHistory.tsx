
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchUserTransactions } from '@/services/paymentService';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CreditCard, Download, Filter } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PaymentHistory() {
  const { user } = useAuth();
  const [transactionType, setTransactionType] = React.useState<string>('all');

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['paymentTransactions', user?.id, transactionType],
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

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <Badge variant="secondary">Subscription</Badge>;
      case 'booking':
        return <Badge variant="secondary">Booking</Badge>;
      case 'payout':
        return <Badge variant="secondary">Payout</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your payment and transaction history</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="subscription">Subscriptions</SelectItem>
                  <SelectItem value="booking">Bookings</SelectItem>
                  <SelectItem value="payout">Payouts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                    <div>{getTransactionTypeIcon(transaction.transactionType)}</div>
                    <div className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</div>
                    <div>{getStatusBadge(transaction.status)}</div>
                    <div className={`text-right font-medium ${transaction.transactionType === 'payout' ? 'text-red-600' : ''}`}>
                      {transaction.transactionType === 'payout' ? '-' : ''}
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
                Your payment history will appear here once you have made or received payments.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
