
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/contexts/SupabaseContext';
import { enableSupabaseRealtime } from '@/services/enableRealtimeSupabase';

const Dashboard = () => {
  const { user, loading } = useAuth(); 
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSubscribed, enableRealtime } = useSupabase();

  useEffect(() => {
    // This component is now just a router to role-specific dashboards
    if (!loading) {
      if (user) {
        // Ensure realtime is enabled
        if (!isSubscribed) {
          enableRealtime();
          // This would normally need admin permissions to run these SQL commands
          enableSupabaseRealtime().then(success => {
            if (success) {
              console.log('Realtime features enabled for the database');
            }
          });
        }
        
        // Redirect to the appropriate dashboard based on user role
        const dashboardPath = `/dashboard/${user.role}`;
        console.log(`Redirecting to: ${dashboardPath}`);
        navigate(dashboardPath, { replace: true });
      } else {
        // No user, redirect to sign-in
        toast({
          title: "Authentication required",
          description: "Please sign in to access your dashboard",
          variant: "destructive"
        });
        navigate('/auth/sign-in');
      }
    }
  }, [navigate, user, loading, toast, isSubscribed, enableRealtime]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-800">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
