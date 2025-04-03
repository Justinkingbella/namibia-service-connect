
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
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log authentication state for debugging
    console.log('ProtectedRoute - Auth State:', { 
      user, 
      loading, 
      currentPath: location.pathname,
      allowedRoles
    });
  }, [user, loading, location.pathname, allowedRoles]);

  // While auth is loading, show loading indicator and don't redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="ml-3 text-gray-600 mt-3">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If no user after loading completes, redirect to sign-in
  if (!user) {
    console.log('No user found, redirecting to sign-in');
    // Redirect to sign-in page but save the location they tried to access
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  // If user doesn't have permission, redirect to their role-specific dashboard
  if (!allowedRoles.includes(user.role)) {
    console.log(`User role ${user.role} not in allowed roles:`, allowedRoles);
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
