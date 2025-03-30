
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PlatformAnalytics from '@/components/admin/PlatformAnalytics';

const PlatformAnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into platform performance.</p>
        </div>
        
        <PlatformAnalytics />
      </div>
    </DashboardLayout>
  );
};

export default PlatformAnalyticsPage;
