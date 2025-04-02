
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserProfile from '@/components/customer/UserProfile';
import DisputeResolutionPanel from '@/components/dashboard/DisputeResolutionPanel';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is loaded and is customer
    if (!isLoading) {
      if (user && user.role === 'customer') {
        setProfileLoading(false);
      } else if (user && user.role !== 'customer') {
        // Redirect to appropriate profile page based on role
        if (user.role === 'admin') {
          navigate('/dashboard/admin/profile');
        } else if (user.role === 'provider') {
          navigate('/dashboard/provider/profile');
        }
      } else if (!user) {
        // Redirect to login if no user
        navigate('/login');
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
