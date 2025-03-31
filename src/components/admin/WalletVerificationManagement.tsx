
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WalletVerification } from '@/types/payment';
import { CheckCircle, XCircle, Eye, AlertTriangle, Search, ArrowDown, ArrowUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WalletVerificationManagementProps {
  verifications: WalletVerification[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const WalletVerificationManagement: React.FC<WalletVerificationManagementProps> = ({
  verifications,
  onApprove,
  onReject
}) => {
  const [selectedVerification, setSelectedVerification] = useState<WalletVerification | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [viewDetails, setViewDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const handleApprove = (id: string) => {
    onApprove(id);
    setSelectedVerification(null);
    toast.success("Payment verification approved");
  };
  
  const handleReject = (id: string) => {
    if (!rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    onReject(id, rejectReason);
    setSelectedVerification(null);
    setRejectReason('');
    toast.success("Payment verification rejected");
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
        v.providerPhone.includes(query)
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
                    <th className="text-left py-3 px-4">Provider</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Wallet Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVerifications.map((verification) => (
                    <tr key={verification.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(verification.dateSubmitted)}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{verification.referenceNumber}</td>
                      <td className="py-3 px-4">#{verification.bookingId.substring(0, 8)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{verification.customerPhone.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          {verification.customerPhone}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{verification.providerPhone.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          {verification.providerPhone}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">N${verification.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        {verification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'EasyWallet'}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(verification.verificationStatus)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedVerification(verification);
                              setViewDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {verification.verificationStatus === 'submitted' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600"
                                onClick={() => {
                                  setSelectedVerification(verification);
                                  setViewDetails(false);
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedVerification(verification);
                                  setViewDetails(false);
                                  setRejectReason('');
                                }}
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
                    <th className="text-left py-3 px-4">Provider</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVerifications
                    .filter(v => v.paymentMethod === 'e_wallet')
                    .map((verification) => (
                      <tr key={verification.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{formatDate(verification.dateSubmitted)}</td>
                        <td className="py-3 px-4 font-medium">{verification.referenceNumber}</td>
                        <td className="py-3 px-4">#{verification.bookingId.substring(0, 8)}</td>
                        <td className="py-3 px-4">{verification.customerPhone}</td>
                        <td className="py-3 px-4">{verification.providerPhone}</td>
                        <td className="py-3 px-4 font-medium">N${verification.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(verification.verificationStatus)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedVerification(verification);
                                setViewDetails(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {verification.verificationStatus === 'submitted' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600"
                                  onClick={() => {
                                    setSelectedVerification(verification);
                                    setViewDetails(false);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedVerification(verification);
                                    setViewDetails(false);
                                    setRejectReason('');
                                  }}
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
                    <th className="text-left py-3 px-4">Provider</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVerifications
                    .filter(v => v.paymentMethod === 'easy_wallet')
                    .map((verification) => (
                      <tr key={verification.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{formatDate(verification.dateSubmitted)}</td>
                        <td className="py-3 px-4 font-medium">{verification.referenceNumber}</td>
                        <td className="py-3 px-4">#{verification.bookingId.substring(0, 8)}</td>
                        <td className="py-3 px-4">{verification.customerPhone}</td>
                        <td className="py-3 px-4">{verification.providerPhone}</td>
                        <td className="py-3 px-4 font-medium">N${verification.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(verification.verificationStatus)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedVerification(verification);
                                setViewDetails(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {verification.verificationStatus === 'submitted' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600"
                                  onClick={() => {
                                    setSelectedVerification(verification);
                                    setViewDetails(false);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedVerification(verification);
                                    setViewDetails(false);
                                    setRejectReason('');
                                  }}
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
        
        {selectedVerification && !viewDetails && (
          <Dialog open={true} onOpenChange={() => setSelectedVerification(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedVerification.verificationStatus === 'submitted' 
                    ? 'Verification Action' 
                    : 'Payment Verification Details'}
                </DialogTitle>
                <DialogDescription>
                  {selectedVerification.verificationStatus === 'submitted'
                    ? 'Approve or reject this payment verification'
                    : 'Review payment verification details'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label className="text-muted-foreground">Wallet Type</Label>
                  <div className="font-medium">
                    {selectedVerification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'EasyWallet'}
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <div className="font-medium">N${selectedVerification.amount.toFixed(2)}</div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Reference Number</Label>
                  <div className="font-medium">{selectedVerification.referenceNumber}</div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Date Submitted</Label>
                  <div className="font-medium">{formatDate(selectedVerification.dateSubmitted)}</div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Customer Phone</Label>
                  <div className="font-medium">{selectedVerification.customerPhone}</div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Provider Phone</Label>
                  <div className="font-medium">{selectedVerification.providerPhone}</div>
                </div>
                
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Notes</Label>
                  <div className="font-medium">{selectedVerification.notes || 'No notes provided'}</div>
                </div>
                
                {selectedVerification.verificationStatus === 'submitted' && (
                  <div className="col-span-2 mt-4">
                    <Label htmlFor="reject-reason">Rejection Reason (if applicable)</Label>
                    <Input
                      id="reject-reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Provide a reason if rejecting this verification"
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter>
                {selectedVerification.verificationStatus === 'submitted' ? (
                  <div className="flex justify-between w-full">
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedVerification.id)}
                      disabled={!rejectReason}
                    >
                      Reject
                    </Button>
                    <Button onClick={() => handleApprove(selectedVerification.id)}>
                      Approve
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setSelectedVerification(null)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {selectedVerification && viewDetails && (
          <Dialog open={true} onOpenChange={() => setSelectedVerification(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  Payment Verification Details
                </DialogTitle>
                <DialogDescription>
                  Full details of the payment verification
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Payment Information</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label className="text-muted-foreground">Wallet Type</Label>
                        <div className="font-medium">
                          {selectedVerification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'EasyWallet'}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground">Amount</Label>
                        <div className="font-medium">N${selectedVerification.amount.toFixed(2)}</div>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground">Reference Number</Label>
                        <div className="font-medium">{selectedVerification.referenceNumber}</div>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground">Proof Type</Label>
                        <div className="font-medium capitalize">{selectedVerification.proofType}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Verification Details</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="font-medium mt-1">
                          {getStatusBadge(selectedVerification.verificationStatus)}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground">Date Submitted</Label>
                        <div className="font-medium">{formatDate(selectedVerification.dateSubmitted)}</div>
                      </div>
                      
                      {selectedVerification.dateVerified && (
                        <div>
                          <Label className="text-muted-foreground">Date Verified</Label>
                          <div className="font-medium">{formatDate(selectedVerification.dateVerified)}</div>
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-muted-foreground">Booking ID</Label>
                        <div className="font-medium">#{selectedVerification.bookingId}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Parties</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label className="text-muted-foreground">Customer Phone</Label>
                        <div className="font-medium">{selectedVerification.customerPhone}</div>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground">Provider Phone</Label>
                        <div className="font-medium">{selectedVerification.providerPhone}</div>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground">Customer Confirmed</Label>
                        <div className="font-medium">
                          {selectedVerification.customerConfirmed ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <XCircle className="h-4 w-4 mr-1" /> No
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground">Provider Confirmed</Label>
                        <div className="font-medium">
                          {selectedVerification.providerConfirmed ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <XCircle className="h-4 w-4 mr-1" /> No
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <div className="font-medium mt-1">
                      {selectedVerification.notes || 'No notes provided'}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  {selectedVerification.receiptImage ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Receipt/Proof</h3>
                      <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={selectedVerification.receiptImage} 
                          alt="Receipt" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No Receipt Uploaded</h3>
                      <p className="text-muted-foreground mt-2">
                        The customer did not upload a receipt or screenshot for this payment verification.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                {selectedVerification.verificationStatus === 'submitted' ? (
                  <div className="flex justify-between w-full">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setViewDetails(false);
                        setRejectReason('');
                      }}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleApprove(selectedVerification.id)}
                    >
                      Approve
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setSelectedVerification(null)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletVerificationManagement;
