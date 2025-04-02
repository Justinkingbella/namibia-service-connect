
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PaymentHistory from '@/components/provider/PaymentHistory';
import EarningsReport from '@/components/provider/EarningsReport';
import ProviderControls from '@/components/provider/ProviderControls';
import SubscriptionPlans from '@/components/provider/SubscriptionPlans';
import DisputeResolutionPanel from '@/components/dashboard/DisputeResolutionPanel';
import { fetchUserSubscription } from '@/services/subscriptionService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

const RevenueReportsPage = () => {
  const { user } = useAuth();
  
  const { data: subscription, refetch: refetchSubscription } = useQuery({
    queryKey: ['providerSubscription', user?.id],
    queryFn: () => fetchUserSubscription(user?.id || ''),
    enabled: !!user?.id
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Revenue & Finance</h1>
          <p className="text-muted-foreground mt-1">Analyze your earnings, manage payments, and track bookings.</p>
        </div>
        
        <Tabs defaultValue="earnings">
          <TabsList className="mb-6">
            <TabsTrigger value="earnings">Earnings & Payouts</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earnings">
            <EarningsReport />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentHistory />
          </TabsContent>
          
          <TabsContent value="subscription">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Subscription Management</h2>
              <SubscriptionPlans 
                currentPlan={subscription?.subscriptionPlanId}
                onSubscriptionChanged={refetchSubscription}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div>
              <h2 className="text-xl font-bold mb-4">Service Provider Controls</h2>
              <ProviderControls />
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Dispute Management</h2>
              <DisputeResolutionPanel role="provider" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RevenueReportsPage;
