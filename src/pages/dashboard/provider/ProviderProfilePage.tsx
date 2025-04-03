
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProviderProfile from '@/components/provider/ProviderProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

const ProviderProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user && user.role === 'provider') {
        const timer = setTimeout(() => {
          setProfileLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      } else if (user && user.role !== 'provider') {
        toast.error("Access Restricted", {
          description: "You don't have permission to access this page."
        });
        navigate(user.role === 'admin' ? '/admin/profile' : '/customer/profile');
      } else if (!user) {
        toast.error("Authentication Required", {
          description: "Please sign in to access this page."
        });
        navigate('/auth/sign-in');
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
          <h1 className="text-2xl font-bold">Provider Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your provider profile information and settings</p>
        </div>
        <ProviderProfile />
      </div>
    </DashboardLayout>
  );
};

export default ProviderProfilePage;
