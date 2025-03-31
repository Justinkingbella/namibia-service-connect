
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdvancedAnalytics from '@/components/admin/AdvancedAnalytics';
import RegionalDemandMap from '@/components/admin/RegionalDemandMap';
import PaymentMethodsControl from '@/components/admin/PaymentMethodsControl';
import DisputeResolutionPanel from '@/components/dashboard/DisputeResolutionPanel';

const PlatformControlsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Platform Controls & Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive platform management and analytics dashboard</p>
        </div>
        
        <AdvancedAnalytics />
        
        <div>
          <h2 className="text-xl font-bold mb-4">Regional Service Demand</h2>
          <RegionalDemandMap />
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
          <PaymentMethodsControl />
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Dispute Resolution</h2>
          <DisputeResolutionPanel role="admin" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlatformControlsPage;
