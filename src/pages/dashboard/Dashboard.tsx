
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
    // Simple auth check without relying on Supabase in iframe environment
    const checkAuth = async () => {
      setIsLoading(true);
      
      if (!user) {
        console.log('No user found, redirecting to sign-in');
        navigate('/auth/sign-in');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, toast, user]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    ); 
  }

  switch (user.role) {
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
