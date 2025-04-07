
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WalletVerification, WalletVerificationStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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
          .eq('id', selectedVer.booking_id);
        
        if (bookingError) throw bookingError;
      }
      
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['adminWalletVerifications'] });
      toast.success("Payment verification approved");
      setSelectedVerification(null);
      setIsDetailDialogOpen(false);
      onApprove(id);
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
      return { id, reason };
    },
    onSuccess: ({ id, reason }) => {
      queryClient.invalidateQueries({ queryKey: ['adminWalletVerifications'] });
      toast.success("Payment verification rejected");
      setSelectedVerification(null);
      setRejectReason('');
      setIsRejectDialogOpen(false);
      setIsDetailDialogOpen(false);
      onReject(id, reason);
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
  
  const getStatusBadge = (status: WalletVerificationStatus | string) => {
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
  
  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return '';
    
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
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
              {verifications.map((verification) => (
                <tr key={verification.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-4">{formatDate(verification.dateSubmitted || verification.date)}</td>
                  <td className="py-3 px-4">{verification.referenceNumber || verification.reference}</td>
                  <td className="py-3 px-4">{verification.booking_id?.substring(0, 8) || ''}</td>
                  <td className="py-3 px-4">{verification.customerPhone}</td>
                  <td className="py-3 px-4">N${verification.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">{getStatusBadge(verification.verificationStatus || verification.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedVerification(verification);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {(verification.verificationStatus === 'submitted' || verification.status === 'submitted') && (
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
        
        {/* Verification Detail Dialog */}
        {selectedVerification && (
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
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
                    {getStatusBadge(selectedVerification.verificationStatus || selectedVerification.status)}
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
                    value={selectedVerification.referenceNumber || selectedVerification.reference} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                <div>
                  <Label>Booking ID</Label>
                  <Input 
                    value={selectedVerification.booking_id || ''} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                <div>
                  <Label>Customer Phone</Label>
                  <Input 
                    value={selectedVerification.customerPhone || ''} 
                    readOnly 
                    className="bg-gray-50 mt-1"
                  />
                </div>
                <div>
                  <Label>Date Submitted</Label>
                  <Input 
                    value={formatDate(selectedVerification.dateSubmitted || selectedVerification.date)} 
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
              
              {(selectedVerification.verificationStatus === 'rejected' || selectedVerification.status === 'rejected') && 
                selectedVerification.rejectionReason && (
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
                {(selectedVerification.verificationStatus === 'submitted' || selectedVerification.status === 'submitted') && (
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
                        setIsDetailDialogOpen(false);
                      }}
                      disabled={rejectMutation.isPending}
                    >
                      {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </div>
                )}
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
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
      </CardContent>
    </Card>
  );
};

export default WalletVerificationManagement;
