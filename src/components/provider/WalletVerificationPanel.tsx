
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WalletVerification, WalletVerificationStatus } from '@/types';
import { CheckCircle, Clock, AlertCircle, Phone, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface WalletVerificationPanelProps {
  providerId: string;
  pendingVerifications: WalletVerification[];
  verifiedPayments: WalletVerification[];
  onConfirmPayment: (verification: WalletVerification) => void;
  onRejectPayment: (verification: WalletVerification, reason: string) => void;
}

const WalletVerificationPanel: React.FC<WalletVerificationPanelProps> = ({
  providerId,
  pendingVerifications,
  verifiedPayments,
  onConfirmPayment,
  onRejectPayment
}) => {
  const [rejectReason, setRejectReason] = useState<string>('');
  const [selectedVerification, setSelectedVerification] = useState<WalletVerification | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const handleConfirm = (verification: WalletVerification) => {
    setConfirmingId(verification.id);
    setTimeout(() => {
      onConfirmPayment(verification);
      setConfirmingId(null);
      toast.success("Payment confirmed successfully");
    }, 1000);
  };

  const handleReject = (verification: WalletVerification) => {
    if (!rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setRejectingId(verification.id);
    setTimeout(() => {
      onRejectPayment(verification, rejectReason);
      setRejectReason('');
      setRejectingId(null);
      setSelectedVerification(null);
      toast.success("Payment rejected");
    }, 1000);
  };

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return '';
    
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: WalletVerificationStatus | string | undefined) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Payment Verifications</CardTitle>
        <CardDescription>
          Verify customer wallet payments and manage verification requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending <Badge variant="secondary" className="ml-2">{pendingVerifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified <Badge variant="secondary" className="ml-2">{verifiedPayments.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingVerifications.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No pending verifications</h3>
                <p className="text-muted-foreground">
                  When customers submit wallet payment verifications, they will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map((verification) => (
                  <Card key={verification.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="font-medium">Booking ID:</span>
                              <span className="ml-2 text-sm text-muted-foreground">
                                {verification.booking_id?.substring(0, 8) || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center mb-1">
                              <span className="font-medium">Amount:</span>
                              <span className="ml-2 text-green-600 font-semibold">
                                N${verification.amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center mb-1">
                              <span className="font-medium">Reference:</span>
                              <span className="ml-2 text-sm">
                                {verification.referenceNumber || verification.reference || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center mb-1">
                              <span className="font-medium">Customer:</span>
                              <span className="ml-2 text-sm flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {verification.customerPhone || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">Date:</span>
                              <span className="ml-2 text-sm">
                                {formatDate(verification.dateSubmitted || verification.date)}
                              </span>
                            </div>
                          </div>
                          <div>
                            {getStatusBadge(verification.verificationStatus || verification.status)}
                          </div>
                        </div>
                        
                        {(verification.verificationStatus === 'submitted' || verification.status === 'submitted') && (
                          <div className="mt-4 flex items-center justify-end space-x-2">
                            <Button 
                              variant="outline"
                              className="text-red-600"
                              onClick={() => setSelectedVerification(verification)}
                              disabled={confirmingId === verification.id || rejectingId === verification.id}
                            >
                              Reject
                            </Button>
                            <Button 
                              onClick={() => handleConfirm(verification)}
                              loading={confirmingId === verification.id}
                              disabled={confirmingId === verification.id || rejectingId === verification.id}
                            >
                              Confirm Payment
                            </Button>
                          </div>
                        )}
                        
                        {selectedVerification?.id === verification.id && (
                          <div className="mt-4 border-t pt-4">
                            <Label>Reason for rejection</Label>
                            <Textarea
                              className="mt-2"
                              placeholder="Provide a reason why you're rejecting this payment verification"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <div className="flex justify-end mt-2 space-x-2">
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  setSelectedVerification(null);
                                  setRejectReason('');
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive"
                                onClick={() => handleReject(verification)}
                                loading={rejectingId === verification.id}
                                disabled={!rejectReason || rejectingId === verification.id}
                              >
                                Confirm Rejection
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verified">
            {verifiedPayments.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No verified payments</h3>
                <p className="text-muted-foreground">
                  Verified payments will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {verifiedPayments.map((verification) => (
                  <div key={verification.id} className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium">Booking ID:</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {verification.booking_id?.substring(0, 8) || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium">Amount:</span>
                          <span className="ml-2 text-green-600 font-semibold">
                            N${verification.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium">Reference:</span>
                          <span className="ml-2 text-sm">
                            {verification.referenceNumber || verification.reference || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium">Date verified:</span>
                          <span className="ml-2 text-sm">
                            {formatDate(verification.dateVerified)}
                          </span>
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(verification.verificationStatus || verification.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WalletVerificationPanel;
