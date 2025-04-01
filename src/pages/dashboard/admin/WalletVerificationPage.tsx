
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { WalletVerification } from '@/types/payment';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Eye, AlertTriangle, Search, ArrowDown, ArrowUp, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WalletVerificationPage = () => {
  const [selectedVerification, setSelectedVerification] = useState<WalletVerification | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch wallet verifications from Supabase
  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['adminWalletVerifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallet_verification_requests')
        .select('*, bookings!inner(*)');
      
      if (error) {
        console.error('Error fetching verifications:', error);
        toast.error('Failed to load verifications');
        return [];
      }
      
      // Transform data to match our frontend type
      return data.map(v => ({
        id: v.id,
        bookingId: v.booking_id,
        customerId: v.customer_id,
        providerId: v.provider_id,
        amount: v.amount,
        paymentMethod: v.payment_method as 'e_wallet' | 'easy_wallet',
        referenceNumber: v.reference_number,
        customerPhone: v.customer_phone,
        providerPhone: v.provider_phone,
        dateSubmitted: new Date(v.date_submitted),
        verificationStatus: v.verification_status as WalletVerification['verificationStatus'],
        dateVerified: v.date_verified ? new Date(v.date_verified) : undefined,
        verifiedBy: v.verified_by,
        notes: v.notes,
        customerConfirmed: v.customer_confirmed,
        providerConfirmed: v.provider_confirmed,
        adminVerified: v.admin_verified,
        proofType: v.proof_type as 'receipt' | 'screenshot' | 'reference',
        receiptImage: v.receipt_image,
        mobileOperator: v.mobile_operator as any,
        bankUsed: v.bank_used as any,
        rejectionReason: v.rejection_reason
      }));
    }
  });
  
  // Approve verification mutation
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('wallet_verification_requests')
        .update({
          verification_status: 'verified',
          date_verified: new Date().toISOString(),
          verified_by: user.id,
          admin_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Also update the booking payment status
      const selectedVer = verifications.find(v => v.id === id);
      if (selectedVer) {
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedVer.bookingId);
        
        if (bookingError) throw bookingError;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWalletVerifications'] });
      toast.success("Payment verification approved");
      setSelectedVerification(null);
    },
    onError: (error) => {
      console.error('Error approving verification:', error);
      toast.error("Failed to approve verification");
    }
  });
  
  // Reject verification mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason: string }) => {
      const { error } = await supabase
        .from('wallet_verification_requests')
        .update({
          verification_status: 'rejected',
          rejection_reason: reason,
          admin_verified: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWalletVerifications'] });
      toast.success("Payment verification rejected");
      setSelectedVerification(null);
      setRejectReason('');
      setIsRejectDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error rejecting verification:', error);
      toast.error("Failed to reject verification");
    }
  });
  
  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };
  
  const handleReject = (id: string) => {
    if (!rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    rejectMutation.mutate({ id, reason: rejectReason });
  };
  
  const filteredVerifications = verifications.filter(v => {
    // Filter by status
    if (filterStatus !== 'all' && v.verificationStatus !== filterStatus) {
      return false;
    }
    
    // Search by reference number, booking ID, or phone numbers
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        v.referenceNumber.toLowerCase().includes(query) ||
        v.bookingId.toLowerCase().includes(query) ||
        v.customerPhone.includes(query) ||
        (v.providerPhone && v.providerPhone.includes(query))
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected field
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime();
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'status') {
      comparison = a.verificationStatus.localeCompare(b.verificationStatus);
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
  
  const getStatusBadge = (status: WalletVerification['verificationStatus']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Submitted</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Expired</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const pendingCount = verifications.filter(v => v.verificationStatus === 'submitted').length;
  const verifiedCount = verifications.filter(v => v.verificationStatus === 'verified').length;
  const rejectedCount = verifications.filter(v => v.verificationStatus === 'rejected').length;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Payment Verifications</h1>
          <p className="text-muted-foreground">
            Manage and verify wallet payment transactions from customers and providers
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Wallet Payment Verification Management</CardTitle>
              <CardDescription>
                Review and manage wallet payment verifications from customers and providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground text-sm">Pending Approvals</p>
                        <h3 className="text-2xl font-bold">{pendingCount}</h3>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground text-sm">Verified Payments</p>
                        <h3 className="text-2xl font-bold">{verifiedCount}</h3>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground text-sm">Rejected Payments</p>
                        <h3 className="text-2xl font-bold">{rejectedCount}</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <XCircle className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by reference, booking ID or phone"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  >
                    {sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="e_wallet">E-Wallet</TabsTrigger>
                  <TabsTrigger value="easy_wallet">EasyWallet</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Reference</th>
                          <th className="text-left py-3 px-4">Booking ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVerifications.map((verification) => (
                          <tr key={verification.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4">{formatDate(verification.dateSubmitted)}</td>
                            <td className="py-3 px-4">{verification.referenceNumber}</td>
                            <td className="py-3 px-4">{verification.bookingId.substring(0, 8)}</td>
                            <td className="py-3 px-4">{verification.customerPhone}</td>
                            <td className="py-3 px-4">N${verification.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">{getStatusBadge(verification.verificationStatus)}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setSelectedVerification(verification)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                {verification.verificationStatus === 'submitted' && (
                                  <>
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={() => handleApprove(verification.id)}
                                      disabled={approveMutation.isPending}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedVerification(verification);
                                        setIsRejectDialogOpen(true);
                                      }}
                                      disabled={rejectMutation.isPending}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="e_wallet">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Reference</th>
                          <th className="text-left py-3 px-4">Booking ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVerifications
                          .filter(v => v.paymentMethod === 'e_wallet')
                          .map((verification) => (
                            <tr key={verification.id} className="border-b hover:bg-slate-50">
                              <td className="py-3 px-4">{formatDate(verification.dateSubmitted)}</td>
                              <td className="py-3 px-4">{verification.referenceNumber}</td>
                              <td className="py-3 px-4">{verification.bookingId.substring(0, 8)}</td>
                              <td className="py-3 px-4">{verification.customerPhone}</td>
                              <td className="py-3 px-4">N${verification.amount.toLocaleString()}</td>
                              <td className="py-3 px-4">{getStatusBadge(verification.verificationStatus)}</td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setSelectedVerification(verification)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  
                                  {verification.verificationStatus === 'submitted' && (
                                    <>
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        onClick={() => handleApprove(verification.id)}
                                        disabled={approveMutation.isPending}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedVerification(verification);
                                          setIsRejectDialogOpen(true);
                                        }}
                                        disabled={rejectMutation.isPending}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="easy_wallet">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Reference</th>
                          <th className="text-left py-3 px-4">Booking ID</th>
                          <th className="text-left py-3 px-4">Customer</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVerifications
                          .filter(v => v.paymentMethod === 'easy_wallet')
                          .map((verification) => (
                            <tr key={verification.id} className="border-b hover:bg-slate-50">
                              <td className="py-3 px-4">{formatDate(verification.dateSubmitted)}</td>
                              <td className="py-3 px-4">{verification.referenceNumber}</td>
                              <td className="py-3 px-4">{verification.bookingId.substring(0, 8)}</td>
                              <td className="py-3 px-4">{verification.customerPhone}</td>
                              <td className="py-3 px-4">N${verification.amount.toLocaleString()}</td>
                              <td className="py-3 px-4">{getStatusBadge(verification.verificationStatus)}</td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setSelectedVerification(verification)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  
                                  {verification.verificationStatus === 'submitted' && (
                                    <>
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        onClick={() => handleApprove(verification.id)}
                                        disabled={approveMutation.isPending}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedVerification(verification);
                                          setIsRejectDialogOpen(true);
                                        }}
                                        disabled={rejectMutation.isPending}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {/* Verification Detail Dialog */}
        {selectedVerification && (
          <Dialog open={!!selectedVerification && !isRejectDialogOpen} onOpenChange={() => setSelectedVerification(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Verification Details</DialogTitle>
                <DialogDescription>
                  Details for payment verification #{selectedVerification.id.substring(0, 8)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Payment Method</Label>
                  <Input 
                    value={selectedVerification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'Easy Wallet'} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1 py-2 px-3 bg-gray-50 rounded border">
                    {getStatusBadge(selectedVerification.verificationStatus)}
                  </div>
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input 
                    value={`N$${selectedVerification.amount.toLocaleString()}`} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                <div>
                  <Label>Reference Number</Label>
                  <Input 
                    value={selectedVerification.referenceNumber} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                <div>
                  <Label>Booking ID</Label>
                  <Input 
                    value={selectedVerification.bookingId} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                <div>
                  <Label>Customer Phone</Label>
                  <Input 
                    value={selectedVerification.customerPhone} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                <div>
                  <Label>Date Submitted</Label>
                  <Input 
                    value={formatDate(selectedVerification.dateSubmitted)} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                {selectedVerification.dateVerified && (
                  <div>
                    <Label>Date Verified</Label>
                    <Input 
                      value={formatDate(selectedVerification.dateVerified)} 
                      readOnly 
                      className="bg-gray-50 mt-1"
                    />
                  </div>
                )}
              </div>
              
              {selectedVerification.receiptImage && (
                <div className="mt-4">
                  <Label>Receipt Image</Label>
                  <div className="mt-2 border rounded-md overflow-hidden">
                    <img 
                      src={selectedVerification.receiptImage} 
                      alt="Receipt" 
                      className="w-full max-h-64 object-contain"
                    />
                  </div>
                </div>
              )}
              
              {selectedVerification.notes && (
                <div className="mt-4">
                  <Label>Notes</Label>
                  <Textarea
                    value={selectedVerification.notes}
                    readOnly
                    className="bg-gray-50 mt-1 h-20"
                  />
                </div>
              )}
              
              {selectedVerification.verificationStatus === 'rejected' && selectedVerification.rejectionReason && (
                <div className="mt-4">
                  <Label>Rejection Reason</Label>
                  <Textarea
                    value={selectedVerification.rejectionReason}
                    readOnly
                    className="bg-red-50 border-red-200 mt-1 h-20"
                  />
                </div>
              )}
              
              <DialogFooter>
                {selectedVerification.verificationStatus === 'submitted' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      onClick={() => handleApprove(selectedVerification.id)}
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsRejectDialogOpen(true);
                      }}
                      disabled={rejectMutation.isPending}
                    >
                      {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </div>
                )}
                <Button variant="outline" onClick={() => setSelectedVerification(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Reject Dialog */}
        {selectedVerification && (
          <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Verification</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this verification.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Rejection</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for rejection"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="h-32"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setRejectReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedVerification.id)}
                  disabled={rejectMutation.isPending || !rejectReason}
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WalletVerificationPage;
