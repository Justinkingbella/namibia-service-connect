
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminProfile from '@/components/admin/AdminProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const AdminProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is loaded and is admin
    if (!isLoading && user) {
      if (user.role !== 'admin') {
        navigate('/dashboard');
      } else {
        setProfileLoading(false);
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading || profileLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
