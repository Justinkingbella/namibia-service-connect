
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WalletVerification } from '@/types/payment';
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
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">
                                Booking #{verification.bookingId?.substring(0, 8)}
                              </h3>
                              <span className="ml-2">
                                {getStatusBadge(verification.verificationStatus)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(verification.dateSubmitted)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">N${verification.amount.toFixed(2)}</div>
                            <p className="text-sm">
                              {verification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'EasyWallet'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Reference</Label>
                            <div className="font-medium">{verification.referenceNumber}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Customer Phone</Label>
                            <div className="font-medium flex items-center">
                              {verification.customerPhone}
                              <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {verification.notes && (
                          <div className="mt-2">
                            <Label className="text-xs text-muted-foreground">Notes</Label>
                            <p className="text-sm">{verification.notes}</p>
                          </div>
                        )}

                        <div className="mt-4 flex space-x-2">
                          {!verification.providerConfirmed && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleConfirm(verification)}
                                disabled={confirmingId === verification.id}
                              >
                                {confirmingId === verification.id ? 'Confirming...' : 'Confirm Payment'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedVerification(verification)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {verification.receiptImage && (
                        <div className="w-full md:w-40 bg-gray-100">
                          <img 
                            src={verification.receiptImage} 
                            alt="Receipt" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}

                {selectedVerification && (
                  <Card className="mt-4 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-600">Reject Payment</CardTitle>
                      <CardDescription>
                        Please provide a reason for rejecting this payment verification
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="reject-reason">Rejection Reason</Label>
                          <Textarea
                            id="reject-reason"
                            placeholder="Enter the reason for rejection"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(selectedVerification)}
                            disabled={rejectingId === selectedVerification.id}
                          >
                            {rejectingId === selectedVerification.id ? 'Rejecting...' : 'Confirm Rejection'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedVerification(null);
                              setRejectReason('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="verified">
            {verifiedPayments.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No verified payments yet</h3>
                <p className="text-muted-foreground">
                  Payments that you've verified will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Booking ID</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Reference</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedPayments.map((verification) => (
                      <tr key={verification.id} className="hover:bg-muted/50 border-b">
                        <td className="py-3 px-4">{formatDate(verification.dateVerified || verification.dateSubmitted)}</td>
                        <td className="py-3 px-4">#{verification.bookingId?.substring(0, 8)}</td>
                        <td className="py-3 px-4 font-medium">N${verification.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">{verification.referenceNumber}</td>
                        <td className="py-3 px-4">{verification.customerPhone}</td>
                        <td className="py-3 px-4">{getStatusBadge(verification.verificationStatus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WalletVerificationPanel;
