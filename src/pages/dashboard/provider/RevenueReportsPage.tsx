
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RevenueReports from '@/components/provider/RevenueReports';
import PaymentManagement from '@/components/provider/PaymentManagement';
import ProviderControls from '@/components/provider/ProviderControls';
import SubscriptionPlans from '@/components/provider/SubscriptionPlans';
import DisputeResolutionPanel from '@/components/dashboard/DisputeResolutionPanel';
import { SubscriptionTier } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const RevenueReportsPage = () => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>('free');
  
  const handlePlanChange = (plan: SubscriptionTier) => {
    setCurrentPlan(plan);
    toast.success(`Your subscription has been updated to ${plan} plan.`);
  };
  
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
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earnings">
            <PaymentManagement />
          </TabsContent>
          
          <TabsContent value="analytics">
            <div>
              <h2 className="text-xl font-bold mb-4">Revenue Analytics</h2>
              <RevenueReports />
            </div>
          </TabsContent>
          
          <TabsContent value="subscription">
            <SubscriptionPlans currentPlan={currentPlan} onChangePlan={handlePlanChange} />
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
