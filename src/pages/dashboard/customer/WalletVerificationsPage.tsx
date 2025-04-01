
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { WalletVerification, NamibianMobileOperator, NamibianBank } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarClock, FileText, CheckCircle, XCircle, Clock, Upload, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  }
];

// Mock fetch function
const fetchVerifications = async (): Promise<WalletVerification[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockVerifications;
};

const WalletVerificationsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedVerification, setSelectedVerification] = useState<WalletVerification | null>(null);
  const [isNewVerificationOpen, setIsNewVerificationOpen] = useState(false);
  
  // New verification form state
  const [newVerification, setNewVerification] = useState({
    paymentMethod: 'e_wallet' as 'e_wallet' | 'easy_wallet',
    amount: '',
    referenceNumber: '',
    providerPhone: '',
    proofType: 'receipt' as 'receipt' | 'screenshot' | 'reference',
    mobileOperator: 'MTC' as NamibianMobileOperator | undefined,
    bankUsed: undefined as NamibianBank | undefined,
    notes: ''
  });

  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['customerWalletVerifications'],
    queryFn: fetchVerifications
  });

  const filteredVerifications = verifications.filter(v => {
    if (activeTab === 'pending') return v.verificationStatus === 'pending' || v.verificationStatus === 'submitted';
    if (activeTab === 'verified') return v.verificationStatus === 'verified';
    if (activeTab === 'rejected') return v.verificationStatus === 'rejected';
    return true;
  });

  const handleSubmitNewVerification = () => {
    console.log('Submitting new verification', newVerification);
    // In a real app, you would call an API to create a new verification
    setIsNewVerificationOpen(false);
    // Reset form
    setNewVerification({
      paymentMethod: 'e_wallet',
      amount: '',
      referenceNumber: '',
      providerPhone: '',
      proofType: 'receipt',
      mobileOperator: 'MTC',
      bankUsed: undefined,
      notes: ''
    });
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">My Verifications</h1>
            <p className="text-muted-foreground">Track and submit wallet payment verifications.</p>
          </div>
          <Button onClick={() => setIsNewVerificationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Verification
          </Button>
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
                <Button onClick={() => setIsNewVerificationOpen(true)} className="mt-4">
                  Submit New Verification
                </Button>
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
                          <Label>Your Phone</Label>
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

                      {selectedVerification.receiptImage && (
                        <div>
                          <Label>Receipt/Proof</Label>
                          <div className="mt-2 border rounded-md p-2 bg-gray-50 text-center">
                            <p className="text-sm text-gray-500">(Receipt/proof image would display here)</p>
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

      {/* New Verification Dialog */}
      <Dialog open={isNewVerificationOpen} onOpenChange={setIsNewVerificationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit New Verification</DialogTitle>
            <DialogDescription>
              Provide details about your e-wallet or easy wallet payment to verify it with the provider.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={newVerification.paymentMethod}
                onValueChange={(value: 'e_wallet' | 'easy_wallet') => 
                  setNewVerification({
                    ...newVerification,
                    paymentMethod: value,
                    mobileOperator: value === 'e_wallet' ? 'MTC' : undefined,
                    bankUsed: value === 'easy_wallet' ? 'FNB' : undefined
                  })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="e_wallet" id="e_wallet" />
                  <Label htmlFor="e_wallet">E-Wallet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy_wallet" id="easy_wallet" />
                  <Label htmlFor="easy_wallet">Easy Wallet</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (N$)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newVerification.amount}
                  onChange={(e) => setNewVerification({...newVerification, amount: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  placeholder="e.g., EW12345678"
                  value={newVerification.referenceNumber}
                  onChange={(e) => setNewVerification({...newVerification, referenceNumber: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="provider-phone">Provider Phone Number</Label>
                <Input
                  id="provider-phone"
                  placeholder="+264 XX XXX XXXX"
                  value={newVerification.providerPhone}
                  onChange={(e) => setNewVerification({...newVerification, providerPhone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="proof-type">Proof Type</Label>
                <Select 
                  value={newVerification.proofType} 
                  onValueChange={(value: 'receipt' | 'screenshot' | 'reference') => 
                    setNewVerification({...newVerification, proofType: value})
                  }
                >
                  <SelectTrigger id="proof-type">
                    <SelectValue placeholder="Select proof type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt">Receipt</SelectItem>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="reference">Reference Number Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newVerification.paymentMethod === 'e_wallet' && (
                <div>
                  <Label htmlFor="mobile-operator">Mobile Operator</Label>
                  <Select 
                    value={newVerification.mobileOperator} 
                    onValueChange={(value: NamibianMobileOperator) => 
                      setNewVerification({...newVerification, mobileOperator: value})
                    }
                  >
                    <SelectTrigger id="mobile-operator">
                      <SelectValue placeholder="Select mobile operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MTC">MTC</SelectItem>
                      <SelectItem value="TN Mobile">TN Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {newVerification.paymentMethod === 'easy_wallet' && (
                <div>
                  <Label htmlFor="bank">Bank Used</Label>
                  <Select 
                    value={newVerification.bankUsed} 
                    onValueChange={(value: NamibianBank) => 
                      setNewVerification({...newVerification, bankUsed: value})
                    }
                  >
                    <SelectTrigger id="bank">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NED BANK">NED BANK</SelectItem>
                      <SelectItem value="FNB">FNB</SelectItem>
                      <SelectItem value="Bank Windhoek">Bank Windhoek</SelectItem>
                      <SelectItem value="Standard Bank">Standard Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about the payment"
                value={newVerification.notes}
                onChange={(e) => setNewVerification({...newVerification, notes: e.target.value})}
                className="h-20"
              />
            </div>
            
            <div>
              <Label>Upload Receipt/Screenshot (Optional)</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, PDF (max 2MB)</p>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg, application/pdf"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewVerificationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewVerification}>
              Submit Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

// For TypeScript compatibility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default WalletVerificationsPage;
