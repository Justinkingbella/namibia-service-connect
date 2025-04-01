
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubscriptionManagement from '@/components/admin/SubscriptionManagement';

const SubscriptionManagementPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage subscription plans for service providers.</p>
        </div>
        
        <SubscriptionManagement />
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionManagementPage;
