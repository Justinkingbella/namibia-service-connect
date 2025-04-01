
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProviderProfile from '@/components/provider/ProviderProfile';

const ProviderProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Provider Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your provider account and business information</p>
        </div>
        
        <ProviderProfile />
      </div>
    </DashboardLayout>
  );
};

export default ProviderProfilePage;
