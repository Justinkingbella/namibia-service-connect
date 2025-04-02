
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPayments } from '@/hooks/usePaymentSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import PaymentStatusCard from '@/components/payment/PaymentStatusCard';
import { Navigate, useNavigate } from 'react-router-dom';
import { PaymentTransaction } from '@/services/namibiaPaymentService';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Wallet, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const PaymentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { payments, loading, refreshPayments } = useUserPayments();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  const pendingPayments = payments.filter(p => 
    p.status === 'pending' || p.status === 'processing' || p.status === 'awaiting_verification'
  );
  const completedPayments = payments.filter(p => p.status === 'completed');
  const failedPayments = payments.filter(p => 
    p.status === 'failed' || p.status === 'cancelled' || p.status === 'refunded'
  );

  const handlePaymentInitiated = (result: PaymentTransaction) => {
    setIsPaymentDialogOpen(false);
    refreshPayments();
  };

  const handleViewDetails = (payment: PaymentTransaction) => {
    setSelectedPayment(payment);
    setIsDetailsDialogOpen(true);
  };

  const renderPaymentStats = () => {
    const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <h3 className="text-2xl font-bold mt-1">N${totalPaid.toFixed(2)}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold mt-1">N${totalPending.toFixed(2)}</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Wallet className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <h3 className="text-2xl font-bold mt-1">{payments.length}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your payments and transactions
            </p>
          </div>
          <Button onClick={() => setIsPaymentDialogOpen(true)}>
            Make Payment
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            {renderPaymentStats()}

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all">All Payments</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed/Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {payments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Payments</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You haven't made any payments yet.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setIsPaymentDialogOpen(true)}
                      >
                        Make a Payment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {payments.map(payment => (
                      <PaymentStatusCard
                        key={payment.id}
                        payment={payment}
                        onViewDetails={() => handleViewDetails(payment)}
                        onSubmitProof={() => {
                          // Handle submitting proof
                        }}
                        refreshData={refreshPayments}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending">
                {pendingPayments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Pending Payments</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You don't have any pending payments.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingPayments.map(payment => (
                      <PaymentStatusCard
                        key={payment.id}
                        payment={payment}
                        onViewDetails={() => handleViewDetails(payment)}
                        onSubmitProof={() => {
                          // Handle submitting proof
                        }}
                        refreshData={refreshPayments}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedPayments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Completed Payments</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You don't have any completed payments.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedPayments.map(payment => (
                      <PaymentStatusCard
                        key={payment.id}
                        payment={payment}
                        onViewDetails={() => handleViewDetails(payment)}
                        refreshData={refreshPayments}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="failed">
                {failedPayments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Failed Payments</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You don't have any failed or cancelled payments.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {failedPayments.map(payment => (
                      <PaymentStatusCard
                        key={payment.id}
                        payment={payment}
                        onViewDetails={() => handleViewDetails(payment)}
                        refreshData={refreshPayments}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Make Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              Enter payment amount and description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (N$)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                placeholder="Enter payment description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!paymentAmount || !paymentDescription || parseFloat(paymentAmount) <= 0}
              onClick={() => {
                setIsPaymentDialogOpen(false);
                setTimeout(() => {
                  setIsPaymentDialogOpen(true);
                }, 100);
              }}
            >
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Selector */}
      {isPaymentDialogOpen && paymentAmount && paymentDescription && (
        <Dialog open={true} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <PaymentMethodSelector
              amount={parseFloat(paymentAmount)}
              description={paymentDescription}
              onPaymentInitiated={handlePaymentInitiated}
              onCancel={() => setIsPaymentDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogDescription>
                  Reference: {selectedPayment.reference}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm">{selectedPayment.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-sm">N${selectedPayment.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm">{new Date(selectedPayment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm">{selectedPayment.method}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm">{selectedPayment.description}</p>
                </div>

                {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Additional Details</p>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(selectedPayment.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentPage;
