
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserProfile from '@/components/customer/UserProfile';
import DisputeResolutionPanel from '@/components/dashboard/DisputeResolutionPanel';

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
        </div>
        
        <UserProfile />
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Dispute Resolution</h2>
          <DisputeResolutionPanel role="customer" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
