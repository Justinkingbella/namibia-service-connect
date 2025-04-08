
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaymentHistory } from '@/hooks/usePaymentHistory';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ChevronDown, ChevronUp, Download, Search } from 'lucide-react';

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const { paymentHistory, loadingHistory } = usePaymentHistory(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('payments');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredPayments = paymentHistory
    .filter(payment => 
      payment.type === 'payment' && 
      (
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatCurrency(payment.amount).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === 'amount') {
        return sortDirection === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (sortField === 'description') {
        return sortDirection === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      return 0;
    });
    
  const filteredPayout = paymentHistory
    .filter(payment => 
      payment.type === 'payout' && 
      (
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatCurrency(payment.amount).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === 'amount') {
        return sortDirection === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (sortField === 'description') {
        return sortDirection === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      return 0;
    });
    
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View and manage your payment transactions</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Review all your transaction records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="payments">Payments Received</TabsTrigger>
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="payments">
                <Table>
                  <TableCaption>A list of your recent payment transactions.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                        <div className="flex items-center">
                          Date {renderSortIcon('date')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                        <div className="flex items-center">
                          Description {renderSortIcon('description')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                        <div className="flex items-center">
                          Amount {renderSortIcon('amount')}
                        </div>
                      </TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingHistory ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">Loading transactions...</TableCell>
                      </TableRow>
                    ) : filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">No transactions found.</TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.createdAt)}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell className="capitalize">{payment.paymentMethod?.replace('_', ' ')}</TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="payouts">
                <Table>
                  <TableCaption>A list of your payout transactions.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                        <div className="flex items-center">
                          Date {renderSortIcon('date')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                        <div className="flex items-center">
                          Description {renderSortIcon('description')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                        <div className="flex items-center">
                          Amount {renderSortIcon('amount')}
                        </div>
                      </TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingHistory ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">Loading transactions...</TableCell>
                      </TableRow>
                    ) : filteredPayout.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">No payout transactions found.</TableCell>
                      </TableRow>
                    ) : (
                      filteredPayout.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>{formatDate(payout.createdAt)}</TableCell>
                          <TableCell>{payout.description}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
                          <TableCell className="capitalize">{payout.paymentMethod?.replace('_', ' ')}</TableCell>
                          <TableCell>{payout.reference}</TableCell>
                          <TableCell>
                            {payout.status === 'completed' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Completed
                              </Badge>
                            ) : payout.status === 'pending' ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Pending
                              </Badge>
                            ) : payout.status === 'failed' ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Failed
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
