import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { WalletVerification } from '@/types/payment';
import { CheckCircle, Clock, AlertCircle, Search, Download, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import WalletPaymentVerification from '@/components/customer/WalletPaymentVerification';
import { toast } from 'sonner';

// Mock data for customer's wallet verifications
const mockVerifications: WalletVerification[] = [
  {
    id: 'ver1',
    transactionId: 'trans1',
    bookingId: 'booking1234567',
    paymentMethod: 'easy_wallet',
    amount: 350.00,
    referenceNumber: 'EW123456789',
    customerPhone: '0812345678',
    providerPhone: '0876543210',
    dateSubmitted: new Date('2023-05-15T10:30:00'),
    verificationStatus: 'verified',
    dateVerified: new Date('2023-05-15T11:45:00'),
    customerConfirmed: true,
    providerConfirmed: true,
    adminVerified: true,
    proofType: 'receipt',
    receiptImage: '/placeholder.svg'
  },
  {
    id: 'ver2',
    transactionId: 'trans2',
    bookingId: 'booking7654321',
    paymentMethod: 'e_wallet',
    amount: 200.00,
    referenceNumber: 'TXN987654321',
    customerPhone: '0823456789',
    providerPhone: '0865432109',
    dateSubmitted: new Date('2023-05-14T15:45:00'),
    verificationStatus: 'submitted',
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: false,
    proofType: 'screenshot'
  },
  {
    id: 'ver3',
    transactionId: 'trans3',
    bookingId: 'booking9876543',
    paymentMethod: 'easy_wallet',
    amount: 150.00,
    referenceNumber: 'EW987654321',
    customerPhone: '0834567890',
    providerPhone: '0854321098',
    dateSubmitted: new Date('2023-05-13T09:15:00'),
    verificationStatus: 'rejected',
    notes: 'Invalid reference number provided',
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: false,
    proofType: 'reference'
  }
];

// Mock bookings that need payment
const mockPendingBookings = [
  {
    id: 'booking8765432',
    serviceId: 'service1',
    serviceName: 'House Cleaning',
    providerName: 'CleanPro Services',
    providerPhone: '0843210987',
    date: new Date('2023-05-20'),
    amount: 300.00
  },
  {
    id: 'booking7654321',
    serviceId: 'service2',
    serviceName: 'Plumbing Service',
    providerName: 'Quick Fix Plumbers',
    providerPhone: '0832109876',
    date: new Date('2023-05-22'),
    amount: 450.00
  }
];

const CustomerWalletVerificationsPage = () => {
  const [verifications, setVerifications] = useState<WalletVerification[]>(mockVerifications);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  // In a real app, we would fetch data from an API
  const { isLoading: loadingVerifications } = useQuery({
    queryKey: ['customerWalletVerifications'],
    queryFn: async () => {
      // Simulate API call
      return mockVerifications;
    },
    initialData: mockVerifications
  });
  
  // Update state from initialData
  useEffect(() => {
    setVerifications(mockVerifications);
  }, []);
  
  // In a real app, we would fetch pending bookings from an API
  const { data: pendingBookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['pendingBookings'],
    queryFn: async () => {
      // Simulate API call
      return mockPendingBookings;
    },
    initialData: mockPendingBookings
  });
  
  const handleVerificationSubmit = (verificationData: Partial<WalletVerification>) => {
    // In a real app, we would send this to an API and get a response
    const newVerification: WalletVerification = {
      id: `ver${Math.random().toString(36).substring(2, 9)}`,
      transactionId: `trans${Math.random().toString(36).substring(2, 9)}`,
      ...verificationData as any,
      adminVerified: false,
      verificationStatus: 'submitted',
      dateSubmitted: new Date(),
    };
    
    setVerifications(prev => [...prev, newVerification as WalletVerification]);
    setSelectedBookingId(null);
    toast.success("Payment verification submitted successfully");
  };
  
  const getStatusBadge = (status: WalletVerification['verificationStatus']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700"><Clock className="h-3 w-3 mr-1" /> Submitted</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700"><RefreshCcw className="h-3 w-3 mr-1" /> Expired</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const filteredVerifications = verifications.filter(v => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      v.referenceNumber.toLowerCase().includes(query) ||
      v.bookingId.toLowerCase().includes(query) ||
      v.paymentMethod.toLowerCase().includes(query)
    );
  });
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wallet Verifications</h1>
          <p className="text-muted-foreground">
            Manage your wallet payment verifications
          </p>
        </div>
        
        {selectedBookingId ? (
          <div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedBookingId(null)}
              className="mb-4"
            >
              Back to Verifications
            </Button>
            
            <WalletPaymentVerification
              bookingId={selectedBookingId}
              providerPhone={pendingBookings?.find(b => b.id === selectedBookingId)?.providerPhone || ''}
              amount={pendingBookings?.find(b => b.id === selectedBookingId)?.amount || 0}
              onVerificationSubmit={handleVerificationSubmit}
            />
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending Payments</TabsTrigger>
              <TabsTrigger value="verifications">My Verifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings Awaiting Payment</CardTitle>
                  <CardDescription>
                    Submit payment verification for your bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingBookings ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : pendingBookings && pendingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {pendingBookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{booking.serviceName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {booking.providerName} • {formatDate(booking.date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">N${booking.amount.toFixed(2)}</div>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                  <Clock className="h-3 w-3 mr-1" /> Payment Required
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <Button
                                onClick={() => setSelectedBookingId(booking.id)}
                              >
                                Verify Payment
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">All Payments Up to Date</h3>
                      <p className="text-muted-foreground mt-1">
                        You don't have any bookings pending payment verification
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="verifications">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Payment Verification History</CardTitle>
                      <CardDescription>
                        View the status of your wallet payment verifications
                      </CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search verifications"
                          className="pl-10 max-w-xs"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingVerifications ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredVerifications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Booking ID</th>
                            <th className="text-left py-3 px-4">Reference</th>
                            <th className="text-left py-3 px-4">Wallet Type</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVerifications.map((verification) => (
                            <tr key={verification.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{formatDate(verification.dateSubmitted)}</td>
                              <td className="py-3 px-4">#{verification.bookingId.substring(0, 8)}</td>
                              <td className="py-3 px-4 font-medium">{verification.referenceNumber}</td>
                              <td className="py-3 px-4">
                                {verification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'EasyWallet'}
                              </td>
                              <td className="py-3 px-4 font-medium">N${verification.amount.toFixed(2)}</td>
                              <td className="py-3 px-4">
                                {getStatusBadge(verification.verificationStatus)}
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="outline" size="sm" className="h-8">
                                  Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No verifications found</h3>
                      <p className="text-muted-foreground mt-1">
                        {searchQuery ? 'Try adjusting your search' : 'You haven\'t submitted any wallet payment verifications yet'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

// SearchIcon component
const SearchIcon = Search;

export default CustomerWalletVerificationsPage;
