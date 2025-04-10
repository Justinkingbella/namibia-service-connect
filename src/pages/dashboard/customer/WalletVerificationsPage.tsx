
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { WalletVerification } from '@/types';
import { getVerifications } from '@/services/walletService';

const verifications: WalletVerification[] = [
  {
    id: '1',
    user_id: 'user123',
    amount: 250,
    verificationStatus: 'pending',
    date: '2024-03-15',
    method: 'mobile_money',
    paymentMethod: 'mobile_money',
    referenceNumber: 'MMTX-123456',
    customerPhone: '+264811234567',
    walletNumber: '+264811234567',
    walletName: 'John Doe',
  },
  {
    id: '2',
    user_id: 'user123',
    amount: 175, 
    verificationStatus: 'submitted',
    date: '2024-03-14',
    method: 'bank_transfer',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'BT-789012',
    customerPhone: '+264821234567',
    walletNumber: '12345678910',
    walletName: 'Sarah Smith',
  },
];

const WalletVerificationsPage = () => {
  const [walletVerifications, setWalletVerifications] = useState<WalletVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        // Replace with actual API call when available
        const data = getVerifications() as WalletVerification[];
        setWalletVerifications(data);
      } catch (error) {
        console.error('Error fetching wallet verifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVerifications();
    }
  }, [user]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Wallet Verifications</CardTitle>
          <CardDescription>
            View and manage your wallet verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              {loading ? (
                <div>Loading pending verifications...</div>
              ) : (
                <div>
                  {walletVerifications.filter(v => v.verificationStatus === 'pending').map(verification => (
                    <div key={verification.id} className="py-2">
                      {verification.walletName} - {verification.amount} - {verification.date}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="approved">
              <div>Approved verifications content</div>
            </TabsContent>
            <TabsContent value="rejected">
              <div>Rejected verifications content</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletVerificationsPage;
