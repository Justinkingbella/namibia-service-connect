
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminProfile from '@/components/admin/AdminProfile';

const AdminProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your admin account information and settings</p>
        </div>
        
        <AdminProfile />
      </div>
    </DashboardLayout>
  );
};

export default AdminProfilePage;
