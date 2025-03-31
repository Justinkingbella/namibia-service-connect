
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WalletVerificationManagement from '@/components/admin/WalletVerificationManagement';
import { WalletVerification } from '@/types/payment';
import { toast } from 'sonner';

// Mock data for wallet verifications
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
    providerConfirmed: true,
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
    verificationStatus: 'rejected',
    notes: 'Invalid reference number provided',
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: false,
    proofType: 'reference'
  },
  {
    id: 'ver4',
    transactionId: 'trans4',
    bookingId: 'booking8765432',
    paymentMethod: 'e_wallet',
    amount: 500.00,
    referenceNumber: 'TXN456789012',
    customerPhone: '0845678901',
    providerPhone: '0843210987',
    dateSubmitted: new Date('2023-05-12T14:00:00'),
    verificationStatus: 'submitted',
    customerConfirmed: true,
    providerConfirmed: false,
    adminVerified: false,
    proofType: 'receipt'
  },
  {
    id: 'ver5',
    transactionId: 'trans5',
    bookingId: 'booking7654321',
    paymentMethod: 'easy_wallet',
    amount: 275.00,
    referenceNumber: 'EW567890123',
    customerPhone: '0856789012',
    providerPhone: '0832109876',
    dateSubmitted: new Date('2023-05-11T11:30:00'),
    verificationStatus: 'verified',
    dateVerified: new Date('2023-05-11T13:15:00'),
    verifiedBy: 'admin2',
    customerConfirmed: true,
    providerConfirmed: true,
    adminVerified: true,
    proofType: 'screenshot',
    receiptImage: '/placeholder.svg'
  }
];

const WalletVerificationPage = () => {
  const [verifications, setVerifications] = useState<WalletVerification[]>(mockVerifications);
  
  // In a real app, we would fetch data from an API
  const { isLoading } = useQuery({
    queryKey: ['walletVerifications'],
    queryFn: () => Promise.resolve(mockVerifications),
    onSuccess: (data) => {
      setVerifications(data);
    }
  });
  
  const handleApproveVerification = (id: string) => {
    setVerifications(prev => 
      prev.map(verification => 
        verification.id === id 
          ? {
              ...verification,
              verificationStatus: 'verified',
              dateVerified: new Date(),
              verifiedBy: 'admin',
              adminVerified: true
            }
          : verification
      )
    );
    
    toast.success("Payment verification approved successfully");
  };
  
  const handleRejectVerification = (id: string, reason: string) => {
    setVerifications(prev => 
      prev.map(verification => 
        verification.id === id 
          ? {
              ...verification,
              verificationStatus: 'rejected',
              notes: reason,
              adminVerified: false
            }
          : verification
      )
    );
    
    toast.success("Payment verification rejected");
  };
  
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
          <WalletVerificationManagement 
            verifications={verifications}
            onApprove={handleApproveVerification}
            onReject={handleRejectVerification}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default WalletVerificationPage;
