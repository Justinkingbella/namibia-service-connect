
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProviderVerification from '@/components/admin/ProviderVerification';

const ProviderVerificationPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Provider Verification</h1>
          <p className="text-muted-foreground mt-1">
            Review and verify service provider applications
          </p>
        </div>
        
        <ProviderVerification />
      </div>
    </DashboardLayout>
  );
};

export default ProviderVerificationPage;
