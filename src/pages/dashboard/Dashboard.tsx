
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/contexts/SupabaseContext';
import { enableSupabaseRealtime } from '@/services/enableRealtimeSupabase';
import { useAuthStore } from '@/store/authStore';

const Dashboard = () => {
  const { user, isLoading } = useAuthStore(); // Updated to use authStore instead of AuthContext
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSubscribed, enableRealtime } = useSupabase();

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isLoading) {
        if (user) {
          // Enable realtime features if needed
          if (!isSubscribed) {
            try {
              await enableRealtime();
              await enableSupabaseRealtime();
            } catch (error) {
              console.error("Failed to initialize realtime features:", error);
            }
          }

          // Determine the correct dashboard path based on user role
          let dashboardPath;
          switch (user.role) {
            case 'admin':
              dashboardPath = '/admin/dashboard';
              break;
            case 'provider':
              dashboardPath = '/provider/dashboard';
              break;
            case 'customer':
              dashboardPath = '/customer/dashboard';
              break;
            default:
              dashboardPath = '/auth/sign-in';
          }
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
  }, [user, isLoading, navigate, toast, isSubscribed, enableRealtime]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
