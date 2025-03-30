
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CustomerProfile from '@/components/customer/CustomerProfile';

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
        </div>
        
        <CustomerProfile />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
