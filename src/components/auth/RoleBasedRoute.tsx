
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import ProtectedRoute from './ProtectedRoute';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { user, userRole } = useAuth();
  
  // Convert role prop to array for easier checking
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // First ensure the user is authenticated with ProtectedRoute
  return (
    <ProtectedRoute>
      {user && userRole && rolesToCheck.includes(userRole) ? (
        // User has the required role, show the component
        <>{children}</>
      ) : user && userRole === 'provider' ? (
        // Provider trying to access non-provider route
        <Navigate to="/dashboard/provider" replace />
      ) : user && userRole === 'customer' ? (
        // Customer trying to access non-customer route
        <Navigate to="/dashboard/customer" replace />
      ) : user && userRole === 'admin' ? (
        // Admin trying to access non-admin route
        <Navigate to="/dashboard/admin" replace />
      ) : (
        // Default fallback - redirect to appropriate dashboard based on role
        <Navigate to={user?.role ? `/dashboard/${user.role}` : "/dashboard"} replace />
      )}
    </ProtectedRoute>
  );
};

export default RoleBasedRoute;
