
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RevenueReports from '@/components/provider/RevenueReports';
import PaymentManagement from '@/components/provider/PaymentManagement';
import ProviderControls from '@/components/provider/ProviderControls';
import SubscriptionPlans from '@/components/provider/SubscriptionPlans';
import DisputeResolutionPanel from '@/components/dashboard/DisputeResolutionPanel';

const RevenueReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Revenue & Finance</h1>
          <p className="text-muted-foreground mt-1">Analyze your earnings, manage payments, and track bookings.</p>
        </div>
        
        <PaymentManagement />
        
        <div>
          <h2 className="text-xl font-bold mb-4">Revenue Analytics</h2>
          <RevenueReports />
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Service Provider Controls</h2>
          <ProviderControls />
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Dispute Management</h2>
          <DisputeResolutionPanel role="provider" />
        </div>
        
        <SubscriptionPlans />
      </div>
    </DashboardLayout>
  );
};

export default RevenueReportsPage;
