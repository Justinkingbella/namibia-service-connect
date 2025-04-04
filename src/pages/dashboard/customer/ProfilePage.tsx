
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserProfile from '@/components/customer/UserProfile';
import DisputeResolutionPanel from '@/components/dashboard/DisputeResolutionPanel';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, loading: isLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is loaded and is customer
    if (!isLoading) {
      if (user && user.role === 'customer') {
        // Small delay to ensure profile data is loaded
        const timer = setTimeout(() => {
          setProfileLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      } else if (user && user.role !== 'customer') {
        // Redirect to appropriate profile page based on role
        toast.error("Access Restricted", {
          description: "You don't have permission to access this page."
        });
        
        if (user.role === 'admin') {
          navigate('/admin/profile');
        } else if (user.role === 'provider') {
          navigate('/provider/profile');
        }
      } else if (!user) {
        // Redirect to login if no user
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
