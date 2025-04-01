
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        return;
      }
      
      setIsLoading(true);
      
      if (!user) {
        console.log('No user found, redirecting to sign-in');
        toast({
          title: "Authentication required",
          description: "Please sign in to access your dashboard",
          variant: "destructive"
        });
        navigate('/auth/sign-in');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, user, authLoading, toast]);

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Loading your dashboard...</p>
        </div>
      </div>
    ); 
  }

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'provider':
      return <ProviderDashboard />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
};

export default Dashboard;
