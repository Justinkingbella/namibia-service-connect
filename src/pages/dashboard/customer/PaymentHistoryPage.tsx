
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle, Search, Download, ArrowDown, ArrowUp, Calendar } from 'lucide-react';
import { Transaction } from '@/types/booking';
import { WalletTransaction } from '@/types/payment';
import { toast } from 'sonner';

// Mock data for customer's transactions
const mockBookingTransactions: Transaction[] = [
  {
    id: 'trans1',
    bookingId: 'booking1234567',
    amount: 350.00,
    fee: 0,
    net: 350.00,
    paymentMethod: 'e_wallet',
    status: 'completed',
    date: new Date('2023-05-15T10:30:00'),
    description: 'Payment for House Cleaning Service',
    reference: 'TXN987654321'
  },
  {
    id: 'trans2',
    bookingId: 'booking7654321',
    amount: 200.00,
    fee: 0,
    net: 200.00,
    paymentMethod: 'card',
    status: 'completed',
    date: new Date('2023-05-14T15:45:00'),
    description: 'Payment for Plumbing Service',
    reference: 'TXN123456789'
  },
  {
    id: 'trans3',
    bookingId: 'booking9876543',
    amount: 150.00,
    fee: 0,
    net: 150.00,
    paymentMethod: 'easy_wallet',
    status: 'pending',
    date: new Date('2023-05-13T09:15:00'),
    description: 'Payment for Car Wash Service'
  }
];

const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'wtrans1',
    walletType: 'e_wallet',
    referenceNumber: 'EW123456789',
    amount: 350.00,
    senderPhone: '0812345678',
    receiverPhone: '0823456789',
    status: 'completed',
    transactionDate: new Date('2023-05-15T10:30:00'),
    description: 'Payment for Booking #booking1234567',
    mobileOperator: 'MTC'
  },
  {
    id: 'wtrans2',
    walletType: 'easy_wallet',
    referenceNumber: 'EZ987654321',
    amount: 200.00,
    senderPhone: '0834567890',
    receiverPhone: '0823456789',
    status: 'completed',
    transactionDate: new Date('2023-05-14T15:45:00'),
    description: 'Payment for Booking #booking7654321',
    bankUsed: 'FNB'
  }
];

const CustomerPaymentHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<string>('all');
  
  const { data: bookingTransactions, isLoading: loadingBookingTransactions } = useQuery({
    queryKey: ['customerBookingTransactions'],
    queryFn: async () => {
      // Simulate API call
      return mockBookingTransactions;
    },
    initialData: mockBookingTransactions
  });
  
  const { data: walletTransactions, isLoading: loadingWalletTransactions } = useQuery({
    queryKey: ['customerWalletTransactions'],
    queryFn: async () => {
      // Simulate API call
      return mockWalletTransactions;
    },
    initialData: mockWalletTransactions
  });
  
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700"><ArrowDown className="h-3 w-3 mr-1" /> Refunded</Badge>;
      case 'disputed':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700"><AlertCircle className="h-3 w-3 mr-1" /> Disputed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Unknown</Badge>;
    }
  };
  
  const getWalletStatusBadge = (status: WalletTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'disputed':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700"><AlertCircle className="h-3 w-3 mr-1" /> Disputed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Unknown</Badge>;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'e_wallet':
        return 'E-Wallet';
      case 'easy_wallet':
        return 'Easy Wallet';
      case 'card':
        return 'Credit/Debit Card';
      case 'cash':
        return 'Cash';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };
  
  const filteredBookingTransactions = bookingTransactions.filter(transaction => {
    // Apply search filter
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !transaction.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(transaction.reference && transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Apply payment method filter
    if (paymentMethod !== 'all' && transaction.paymentMethod !== paymentMethod) {
      return false;
    }
    
    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const transactionDate = new Date(transaction.date);
      
      if (dateRange === 'today') {
        return transactionDate.toDateString() === now.toDateString();
      } else if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return transactionDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return transactionDate >= monthAgo;
      }
    }
    
    return true;
  });
  
  const filteredWalletTransactions = walletTransactions.filter(transaction => {
    // Apply search filter
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !transaction.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply payment method filter
    if (paymentMethod !== 'all' && transaction.walletType !== paymentMethod) {
      return false;
    }
    
    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const transactionDate = new Date(transaction.transactionDate);
      
      if (dateRange === 'today') {
        return transactionDate.toDateString() === now.toDateString();
      } else if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return transactionDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return transactionDate >= monthAgo;
      }
    }
    
    return true;
  });
  
  // Calculate total spent
  const totalSpent = bookingTransactions.reduce((sum, transaction) => {
    if (transaction.status === 'completed' || transaction.status === 'pending') {
      return sum + transaction.amount;
    }
    return sum;
  }, 0);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">
            Track your payments and transactions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <h3 className="text-2xl font-bold mt-1">N${totalSpent.toFixed(2)}</h3>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ArrowUp className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Payments</p>
                  <h3 className="text-2xl font-bold mt-1">{bookingTransactions.filter(t => t.status === 'completed').length}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <h3 className="text-2xl font-bold mt-1">{bookingTransactions.filter(t => t.status === 'pending').length}</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View all your payment transactions
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search transactions"
                    className="pl-10 max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
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
                
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-[140px]">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="e_wallet">E-Wallet</SelectItem>
                    <SelectItem value="easy_wallet">Easy Wallet</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bookings">
              <TabsList className="mb-6">
                <TabsTrigger value="bookings">Booking Payments</TabsTrigger>
                <TabsTrigger value="wallet">Wallet Payments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bookings">
                {loadingBookingTransactions ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredBookingTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Booking ID</th>
                          <th className="text-left py-3 px-4">Description</th>
                          <th className="text-left py-3 px-4">Method</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookingTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                            <td className="py-3 px-4">#{transaction.bookingId.substring(0, 8)}</td>
                            <td className="py-3 px-4 font-medium">{transaction.description}</td>
                            <td className="py-3 px-4">{getPaymentMethodLabel(transaction.paymentMethod)}</td>
                            <td className="py-3 px-4 font-medium">N${transaction.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              {getStatusBadge(transaction.status)}
                            </td>
                            <td className="py-3 px-4">{transaction.reference || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No transactions found</h3>
                    <p className="text-muted-foreground mt-1">
                      {searchQuery ? 'Try adjusting your search or filters' : 'You don\'t have any booking transactions yet'}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="wallet">
                {loadingWalletTransactions ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredWalletTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Reference</th>
                          <th className="text-left py-3 px-4">Description</th>
                          <th className="text-left py-3 px-4">Wallet Type</th>
                          <th className="text-left py-3 px-4">Receiver</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Provider</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWalletTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{formatDate(transaction.transactionDate)}</td>
                            <td className="py-3 px-4">{transaction.referenceNumber}</td>
                            <td className="py-3 px-4 font-medium">{transaction.description}</td>
                            <td className="py-3 px-4">{getPaymentMethodLabel(transaction.walletType)}</td>
                            <td className="py-3 px-4">{transaction.receiverPhone}</td>
                            <td className="py-3 px-4 font-medium">N${transaction.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              {getWalletStatusBadge(transaction.status)}
                            </td>
                            <td className="py-3 px-4">
                              {transaction.mobileOperator || transaction.bankUsed || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No wallet transactions found</h3>
                    <p className="text-muted-foreground mt-1">
                      {searchQuery ? 'Try adjusting your search or filters' : 'You don\'t have any wallet transactions yet'}
                    </p>
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

// Component imports
import { Wallet, CreditCard, Clock } from 'lucide-react';

// SearchIcon component
const SearchIcon = Search;

export default CustomerPaymentHistoryPage;
