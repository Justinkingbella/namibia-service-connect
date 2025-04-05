
import { Navigate } from 'react-router-dom';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/store/authStore';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

function RoleBasedRoute({ allowedRoles, children }: RoleBasedRouteProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'provider':
        return <Navigate to="/provider/dashboard" replace />;
      case 'customer':
        return <Navigate to="/customer/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

export default RoleBasedRoute;
