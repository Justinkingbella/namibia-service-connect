
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubscriptionManagement from '@/components/admin/SubscriptionManagement';

const SubscriptionPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Subscription Management | Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage subscription plans and customer subscriptions</p>
        </div>
        
        <Card className="p-6">
          <SubscriptionManagement />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
