
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileCheck,
  FileClock,
  FileX,
  CircleDollarSign,
  Wallet, 
  Plus, 
  ExternalLink, 
  ListFilter,
  Check,
  X,
  Receipt
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { WalletPaymentType, WalletVerificationStatus, WalletVerification } from '@/types';

// Mock data to showcase the UI
const mockVerifications: WalletVerification[] = [
  {
    id: '1',
    user_id: 'user123',
    booking_id: 'booking123',
    amount: 350,
    status: 'pending' as WalletVerificationStatus,
    reference: 'REF123456',
    method: 'mobile_money' as WalletPaymentType,
    date: new Date().toISOString(),
    customerPhone: '0811234567',
    mobileOperator: 'MTC',
    dateSubmitted: new Date().toISOString(),
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: false
  },
  {
    id: '2',
    user_id: 'user123',
    booking_id: 'booking124',
    amount: 500,
    status: 'verified' as WalletVerificationStatus,
    reference: 'REF789012',
    method: 'e_wallet' as WalletPaymentType,
    date: new Date(Date.now() - 3*24*60*60*1000).toISOString(), // 3 days ago
    customerPhone: '0811234567',
    walletNumber: '1234567890',
    dateSubmitted: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
    dateVerified: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
    customerConfirmed: true,
    providerConfirmed: true,
    adminVerified: true
  },
  {
    id: '3',
    user_id: 'user123',
    booking_id: 'booking125',
    amount: 750,
    status: 'rejected' as WalletVerificationStatus,
    reference: 'REF345678',
    method: 'bank_transfer' as WalletPaymentType,
    date: new Date(Date.now() - 7*24*60*60*1000).toISOString(), // 1 week ago
    customerPhone: '0811234567',
    dateSubmitted: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
    dateVerified: new Date(Date.now() - 6*24*60*60*1000).toISOString(),
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: true,
    rejectionReason: 'Invalid reference number provided'
  }
];

const WalletVerificationsPage: React.FC = () => {
  const [verifications, setVerifications] = useState<WalletVerification[]>(mockVerifications);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  
  const filteredVerifications = activeTab === 'all' 
    ? verifications 
    : verifications.filter(v => v.status === activeTab);

  // Status and methodology displays
  const getStatusBadge = (status: WalletVerificationStatus) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FileClock className="w-3 h-3 mr-1" />
          Pending
        </span>;
      case 'verified':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FileCheck className="w-3 h-3 mr-1" />
          Verified
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FileX className="w-3 h-3 mr-1" />
          Rejected
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  const getMethodBadge = (method: WalletPaymentType) => {
    switch(method) {
      case 'mobile_money':
        return <span className="text-sm text-blue-600">Mobile Money</span>;
      case 'e_wallet':
        return <span className="text-sm text-purple-600">E-Wallet</span>;
      case 'bank_transfer':
        return <span className="text-sm text-green-600">Bank Transfer</span>;
      case 'credit_card':
        return <span className="text-sm text-gray-600">Credit Card</span>;
      case 'debit_card':
        return <span className="text-sm text-gray-600">Debit Card</span>;
      default:
        return <span className="text-sm text-gray-600">{method}</span>;
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock handler for submitting a verification
  const handleSubmitVerification = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newVerification: WalletVerification = {
        id: `new-${Date.now()}`,
        user_id: 'user123',
        booking_id: 'booking-new',
        amount: 450,
        status: 'pending' as WalletVerificationStatus,
        reference: 'REF-NEW-' + Date.now().toString().substr(-6),
        method: 'mobile_money' as WalletPaymentType,
        date: new Date().toISOString(),
        customerPhone: '0811234567',
        dateSubmitted: new Date().toISOString(),
        customerConfirmed: true,
        providerConfirmed: false,
        adminVerified: false
      };
      
      setVerifications(prevVerifications => [newVerification, ...prevVerifications]);
      setIsSubmitting(false);
      setShowForm(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Verifications</h1>
            <p className="text-muted-foreground">
              Submit and track your payment verifications
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Verification'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Payment Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitVerification} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Booking Reference</label>
                    <input 
                      type="text" 
                      placeholder="Enter booking ID"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <input 
                      type="number" 
                      placeholder="Enter amount"
                      className="w-full p-2 border rounded-md"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Method</label>
                    <select className="w-full p-2 border rounded-md" required>
                      <option value="">Select payment method</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="e_wallet">E-Wallet</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reference Number</label>
                    <input 
                      type="text" 
                      placeholder="Transaction reference"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Receipt/Screenshot</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file"
                        accept="image/*"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="Any additional information"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Verification
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submitted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Verified Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {verifications.filter(v => v.status === 'verified').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {verifications.filter(v => v.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Verified Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(verifications.filter(v => v.status === 'verified').reduce((sum, v) => sum + v.amount, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                {filteredVerifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Wallet className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No verifications found</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't submitted any payment verifications for this category yet
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Verification
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Reference</th>
                          <th className="py-3 px-4 text-left">Method</th>
                          <th className="py-3 px-4 text-left">Amount</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVerifications.map((verification) => (
                          <tr key={verification.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div>
                                {formatDate(verification.date)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Booking: {verification.booking_id.substring(0, 8)}...
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {verification.reference}
                            </td>
                            <td className="py-3 px-4">
                              {getMethodBadge(verification.method)}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {formatCurrency(verification.amount)}
                            </td>
                            <td className="py-3 px-4">
                              {getStatusBadge(verification.status)}
                              {verification.status === 'rejected' && (
                                <div className="text-xs text-red-600 mt-1">
                                  {verification.rejectionReason}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="ml-2"
                                onClick={() => window.open(`/booking/${verification.booking_id}`, '_blank')}
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WalletVerificationsPage;
