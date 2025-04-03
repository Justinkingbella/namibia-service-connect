
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import ProtectedRoute from './ProtectedRoute';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Convert allowedRoles to array for easier checking
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  useEffect(() => {
    console.log('RoleBasedRoute - Current state:', {
      user,
      loading,
      allowedRoles: rolesToCheck,
      currentPath: location.pathname
    });
  }, [user, loading, rolesToCheck, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  // Enhanced role checking and redirection logic
  if (!rolesToCheck.includes(user.role)) {
    let redirectPath;
    
    // Explicit role-based routing
    switch (user.role) {
      case 'admin':
        redirectPath = '/admin/dashboard';
        console.log('Admin user detected, redirecting to admin dashboard');
        break;
      case 'provider':
        redirectPath = '/provider/dashboard';
        console.log('Provider user detected, redirecting to provider dashboard');
        break;
      case 'customer':
        redirectPath = '/customer/dashboard';
        console.log('Customer user detected, redirecting to customer dashboard');
        break;
      default:
        console.log('Unknown role, redirecting to sign-in');
        redirectPath = '/auth/sign-in';
    }
    
    console.log(`Unauthorized access, redirecting to: ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
