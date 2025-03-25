
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // This should be handled by ProtectedRoute
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
