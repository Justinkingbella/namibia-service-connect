
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/contexts/SupabaseContext';
import { enableSupabaseRealtime } from '@/services/enableRealtimeSupabase';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSubscribed, enableRealtime } = useSupabase();

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!loading) {
        if (user) {
          // Enable realtime features if needed
          if (!isSubscribed) {
            await enableRealtime();
            await enableSupabaseRealtime();
          }

          // Determine the correct dashboard path based on user role
          const dashboardPath = `/${user.role}/dashboard`;
          console.log(`Redirecting to role-specific dashboard: ${dashboardPath}`);
          navigate(dashboardPath, { replace: true });
        } else {
          console.log('No authenticated user found, redirecting to sign-in');
          toast({
            title: "Authentication Required",
            description: "Please sign in to access your dashboard",
            variant: "destructive"
          });
          navigate('/auth/sign-in', { replace: true });
        }
      }
    };

    initializeDashboard();
  }, [user, loading, navigate, toast, isSubscribed, enableRealtime]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
