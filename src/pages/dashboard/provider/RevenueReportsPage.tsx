
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RevenueReports from '@/components/provider/RevenueReports';

const RevenueReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Revenue Reports</h1>
          <p className="text-muted-foreground mt-1">Analyze your earnings and booking trends.</p>
        </div>
        
        <RevenueReports />
      </div>
    </DashboardLayout>
  );
};

export default RevenueReportsPage;
