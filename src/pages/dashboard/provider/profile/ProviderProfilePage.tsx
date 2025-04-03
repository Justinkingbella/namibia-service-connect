
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useProviderProfile } from '@/hooks/useProviderProfile';
import ProviderProfile from '@/components/provider/ProviderProfile';
import { toast } from 'sonner';

const ProviderProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use the correct hook for provider profiles
  const { providerData, loading: providerLoading, error } = useProviderProfile();

  useEffect(() => {
    // Check if user is loaded and is provider
    if (!isLoading) {
      if (user && user.role === 'provider') {
        // Small delay to ensure profile data is loaded
        const timer = setTimeout(() => {
          setProfileLoading(false);
        }, 500);
        return () => clearTimeout(timer);
      } else if (user && user.role !== 'provider') {
        // Redirect to appropriate profile page based on role
        toast.error("Access Restricted", {
          description: "You don't have permission to access this page."
        });
        
        if (user.role === 'admin') {
          navigate('/dashboard/admin/profile');
        } else if (user.role === 'customer') {
          navigate('/dashboard/customer/profile');
        }
      } else if (!user) {
        // Redirect to login if no user
        toast.error("Authentication Required", {
          description: "Please sign in to access this page."
        });
        navigate('/auth/sign-in');
      }
    }
  }, [user, isLoading, navigate]);

  // Handle provider data loading error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load profile", {
        description: "There was an error loading your provider profile."
      });
    }
  }, [error]);

  if (isLoading || profileLoading || providerLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Provider Profile</h1>
        {providerData ? (
          <ProviderProfile providerData={providerData} />
        ) : (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
            <p>Provider profile data is not available. Please complete your profile setup.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfilePage;
