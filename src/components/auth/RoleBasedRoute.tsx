
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
  const { user } = useAuth();
  
  // Convert role prop to array for easier checking
  const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // First ensure the user is authenticated with ProtectedRoute
  return (
    <ProtectedRoute>
      {user && rolesToCheck.includes(user.role) ? (
        // User has the required role, show the component
        <>{children}</>
      ) : (
        // User is authenticated but doesn't have the required role, redirect to dashboard
        <Navigate to="/dashboard" replace />
      )}
    </ProtectedRoute>
  );
};

export default RoleBasedRoute;
