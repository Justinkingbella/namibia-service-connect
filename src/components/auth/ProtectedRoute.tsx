
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'provider', 'customer'] 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log authentication state for debugging
    console.log('ProtectedRoute - Auth State:', { 
      user, 
      isLoading, 
      currentPath: location.pathname,
      allowedRoles
    });
  }, [user, isLoading, location.pathname, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Authenticating...</p>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to sign-in');
    // Redirect to sign-in page but save the location they tried to access
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(`User role ${user.role} not in allowed roles:`, allowedRoles);
    // User doesn't have permission to access this route
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
