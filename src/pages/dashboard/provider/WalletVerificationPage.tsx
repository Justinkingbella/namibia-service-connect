
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { WalletVerification } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { CalendarClock, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const mockVerifications: WalletVerification[] = [
  {
    id: '1',
    transactionId: 'TX12345',
    bookingId: 'B1001',
    paymentMethod: 'e_wallet',
    amount: 350,
    referenceNumber: 'EW78912345',
    customerPhone: '+264811234567',
    providerPhone: '+264817654321',
    dateSubmitted: new Date(Date.now() - 86400000 * 2),
    verificationStatus: 'verified',
    customerConfirmed: true,
    providerConfirmed: true,
    adminVerified: true,
    proofType: 'screenshot',
    mobileOperator: 'MTC'
  },
  {
    id: '2',
    transactionId: 'TX12346',
    bookingId: 'B1002',
    paymentMethod: 'easy_wallet',
    amount: 500,
    referenceNumber: 'EZ45678901',
    customerPhone: '+264811234567',
    providerPhone: '+264817654321',
    dateSubmitted: new Date(Date.now() - 86400000),
    verificationStatus: 'pending',
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: false,
    proofType: 'reference',
    bankUsed: 'FNB'
  },
  {
    id: '3',
    transactionId: 'TX12347',
    bookingId: 'B1003',
    paymentMethod: 'e_wallet',
    amount: 250,
    referenceNumber: 'EW12345678',
    customerPhone: '+264812345678',
    providerPhone: '+264817654321',
    dateSubmitted: new Date(),
    verificationStatus: 'submitted',
    customerConfirmed: true,
    providerConfirmed: true,
    adminVerified: false,
    proofType: 'receipt',
    mobileOperator: 'TN Mobile'
  }
];

// Mock fetch function
const fetchVerifications = async (): Promise<WalletVerification[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockVerifications;
};

const WalletVerificationPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedVerification, setSelectedVerification] = useState<WalletVerification | null>(null);

  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['walletVerifications'],
    queryFn: fetchVerifications
  });

  const filteredVerifications = verifications.filter(v => {
    if (activeTab === 'pending') return v.verificationStatus === 'pending' || v.verificationStatus === 'submitted';
    if (activeTab === 'verified') return v.verificationStatus === 'verified';
    if (activeTab === 'rejected') return v.verificationStatus === 'rejected';
    return true;
  });

  const confirmVerification = (id: string) => {
    console.log('Confirming verification', id);
    // In a real app, you would call an API to update the verification status
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'submitted':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Wallet Verifications</h1>
          <p className="text-muted-foreground">Manage and confirm your wallet payment verifications.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <CalendarClock className="h-10 w-10 mx-auto text-gray-400 animate-pulse" />
                <h3 className="mt-4 text-lg font-medium">Loading verifications...</h3>
              </div>
            ) : filteredVerifications.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                <CalendarClock className="h-10 w-10 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No verifications found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No {activeTab === 'all' ? '' : activeTab} wallet verifications at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 space-y-4">
                  {filteredVerifications.map((verification) => (
                    <div 
                      key={verification.id}
                      className={cn(
                        "bg-white rounded-xl border p-4 cursor-pointer hover:border-primary/50 transition-colors",
                        selectedVerification?.id === verification.id && "border-primary/50 shadow-sm"
                      )}
                      onClick={() => setSelectedVerification(verification)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium">{verification.paymentMethod === 'e_wallet' ? 'E-Wallet' : 'Easy Wallet'} Payment</div>
                          <div className="text-xs text-gray-500">Ref: {verification.referenceNumber}</div>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          getStatusBadgeClass(verification.verificationStatus)
                        )}>
                          {getStatusIcon(verification.verificationStatus)}
                          <span>
                            {verification.verificationStatus.charAt(0).toUpperCase() + verification.verificationStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount:</span>
                          <span className="font-medium">N${verification.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date:</span>
                          <span>{verification.dateSubmitted.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="lg:col-span-2">
                  {selectedVerification ? (
                    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          Verification Details
                        </h3>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          getStatusBadgeClass(selectedVerification.verificationStatus)
                        )}>
                          {getStatusIcon(selectedVerification.verificationStatus)}
                          <span>
                            {selectedVerification.verificationStatus.charAt(0).toUpperCase() + selectedVerification.verificationStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                      
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
                          <Label>Date Submitted</Label>
                          <Input 
                            value={selectedVerification.dateSubmitted.toLocaleDateString()} 
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
                          <Label>Provider Phone</Label>
                          <Input 
                            value={selectedVerification.providerPhone} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                        <div>
                          <Label>Proof Type</Label>
                          <Input 
                            value={selectedVerification.proofType.charAt(0).toUpperCase() + selectedVerification.proofType.slice(1)} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                        <div>
                          <Label>
                            {selectedVerification.paymentMethod === 'e_wallet' ? 'Mobile Operator' : 'Bank Used'}
                          </Label>
                          <Input 
                            value={selectedVerification.mobileOperator || selectedVerification.bankUsed || 'N/A'} 
                            readOnly 
                            className="bg-gray-50 mt-1"
                          />
                        </div>
                      </div>

                      {selectedVerification.notes && (
                        <div>
                          <Label>Notes</Label>
                          <Textarea 
                            value={selectedVerification.notes} 
                            readOnly 
                            className="bg-gray-50 mt-1 h-20"
                          />
                        </div>
                      )}

                      {selectedVerification.verificationStatus === 'pending' && (
                        <div className="space-y-4">
                          <div>
                            <Label>Confirmation Status</Label>
                            <Select defaultValue="confirm">
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="confirm">Confirm Receipt</SelectItem>
                                <SelectItem value="query">Query Payment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Notes (Optional)</Label>
                            <Textarea 
                              placeholder="Add any notes about this verification" 
                              className="mt-1 h-20"
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-3">
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              onClick={() => confirmVerification(selectedVerification.id)}
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">No verification selected</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Select a verification from the list to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// For TypeScript compatibility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default WalletVerificationPage;
