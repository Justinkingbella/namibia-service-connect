
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
  const { user, userRole, loading } = useAuth();
  
  // Convert role prop to array for easier checking
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // First ensure the user is authenticated with ProtectedRoute
  return (
    <ProtectedRoute>
      {/* Only show if loading is complete and user has required role */}
      {!loading && user && userRole && rolesToCheck.includes(userRole) ? (
        // User has the required role, show the component
        <>{children}</>
      ) : !loading && user && userRole === 'provider' ? (
        // Provider trying to access non-provider route
        <Navigate to="/provider/dashboard" replace />
      ) : !loading && user && userRole === 'customer' ? (
        // Customer trying to access non-customer route
        <Navigate to="/customer/dashboard" replace />
      ) : !loading && user && userRole === 'admin' ? (
        // Admin trying to access non-admin route
        <Navigate to="/admin/dashboard" replace />
      ) : (
        // Default fallback - redirect to sign-in
        <Navigate to="/auth/sign-in" replace />
      )}
    </ProtectedRoute>
  );
};

export default RoleBasedRoute;
