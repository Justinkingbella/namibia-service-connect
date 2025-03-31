
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WalletVerificationPanel from '@/components/provider/WalletVerificationPanel';
import { WalletVerification } from '@/types/payment';
import { toast } from 'sonner';

// Mock data for the provider's wallet verifications
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
    verificationStatus: 'submitted',
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: false,
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
    verificationStatus: 'verified',
    dateVerified: new Date('2023-05-14T16:30:00'),
    verifiedBy: 'admin1',
    customerConfirmed: true,
    providerConfirmed: true,
    adminVerified: true,
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
    verificationStatus: 'submitted',
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: false,
    proofType: 'reference'
  }
];

const ProviderWalletVerificationPage = () => {
  const [verifications, setVerifications] = useState<WalletVerification[]>(mockVerifications);
  
  // In a real app, we would fetch data from an API
  const { isLoading } = useQuery({
    queryKey: ['providerWalletVerifications'],
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
  
  const handleConfirmPayment = (verification: WalletVerification) => {
    setVerifications(prev => 
      prev.map(v => 
        v.id === verification.id 
          ? { ...v, providerConfirmed: true }
          : v
      )
    );
    
    // In a real app, we would send this to an API
    toast.success("Payment confirmed successfully");
  };
  
  const handleRejectPayment = (verification: WalletVerification, reason: string) => {
    setVerifications(prev => 
      prev.map(v => 
        v.id === verification.id 
          ? { 
              ...v, 
              providerConfirmed: false, 
              verificationStatus: 'rejected',
              notes: reason
            }
          : v
      )
    );
    
    // In a real app, we would send this to an API
    toast.success("Payment rejected with reason");
  };
  
  const pendingVerifications = verifications.filter(
    v => v.verificationStatus === 'submitted' && !v.providerConfirmed
  );
  
  const verifiedPayments = verifications.filter(
    v => v.providerConfirmed || v.verificationStatus === 'verified'
  );
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Payment Verifications</h1>
          <p className="text-muted-foreground">
            Verify customer wallet payments for your services
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <WalletVerificationPanel 
            providerId="provider-1"
            pendingVerifications={pendingVerifications}
            verifiedPayments={verifiedPayments}
            onConfirmPayment={handleConfirmPayment}
            onRejectPayment={handleRejectPayment}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderWalletVerificationPage;
