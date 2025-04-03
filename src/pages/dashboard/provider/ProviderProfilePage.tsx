
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProviderProfile from '@/components/provider/ProviderProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ProviderProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is loaded and is provider
    if (!isLoading) {
      if (user && user.role === 'provider') {
        // Small delay to ensure profile data is loaded
        const timer = setTimeout(() => {
          setProfileLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      } else if (user && user.role !== 'provider') {
        // Redirect to appropriate profile page based on role
        toast({
          title: "Access Restricted",
          description: "You don't have permission to access this page.",
          variant: "destructive"
        });
        
        if (user.role === 'admin') {
          navigate('/admin/profile');
        } else if (user.role === 'customer') {
          navigate('/customer/profile');
        }
      } else if (!user) {
        // Redirect to login if no user
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page.",
          variant: "destructive"
        });
        navigate('/auth/sign-in');
      }
    }
  }, [user, isLoading, navigate, toast]);

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
          <p className="text-muted-foreground mt-1">Manage your provider account and business information</p>
        </div>
        
        <ProviderProfile />
      </div>
    </DashboardLayout>
  );
};

export default ProviderProfilePage;
