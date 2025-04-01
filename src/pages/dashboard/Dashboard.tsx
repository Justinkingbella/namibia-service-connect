
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      if (!user) {
        console.log('No user found, redirecting to sign-in');
        navigate('/auth/sign-in');
        return;
      }
      
      setIsLoading(false);
    };

    // Small delay to ensure auth state is properly loaded
    const timeoutId = setTimeout(() => {
      checkAuth();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [navigate, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
