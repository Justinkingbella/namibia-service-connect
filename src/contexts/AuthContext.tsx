
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Customer, Provider, Admin, UserRole, AuthContextType, ProviderVerificationStatus } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => false,
  signOut: async () => {},
  signUp: async () => false,
  resetPassword: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const setUpUser = async () => {
      setIsLoading(true);
      
      // Check active auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setIsLoading(false);
        return;
      }
      
      if (!session) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      // Fetch profile data
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        if (!profile) {
          console.error("No profile found for user:", session.user.id);
          setIsLoading(false);
          return;
        }
        
        // Create the base user object
        const baseUser: User = {
          id: profile.id,
          email: profile.email || session.user.email || '',
          role: profile.role as UserRole,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          avatarUrl: profile.avatar_url || '',
          avatar: profile.avatar_url || '',
          isActive: profile.active || false,
          createdAt: new Date(profile.created_at),
          phoneNumber: profile.phone_number || '',
        };
        
        // Extend with role-specific data
        let userData: User | Customer | Provider | Admin;
        
        // Handle specific role data
        if (profile.role === 'provider') {
          // Fetch provider-specific data
          const { data: providerData, error: providerError } = await supabase
            .from('service_providers')
            .select('*')
            .eq('id', profile.id)
            .single();
          
          if (providerError) {
            console.warn("Error fetching provider data:", providerError);
            userData = baseUser; // Fallback to base user
          } else {
            userData = {
              ...baseUser,
              role: 'provider' as const,
              businessName: providerData.business_name || '',
              description: providerData.business_description || '',
              verificationStatus: (providerData.verification_status || 'unverified') as ProviderVerificationStatus,
              categories: [], // Default empty array for categories
              locations: [], // Default empty array for locations
              rating: providerData.rating || 0,
              reviewCount: providerData.rating_count || 0,
              subscriptionTier: providerData.subscription_tier || 'free',
              completedBookings: providerData.completed_bookings || 0,
              bankDetails: providerData.bank_details || {}, // Default empty object
              commissionRate: providerData.commission_rate || 10,
            } as Provider;
          }
        } else if (profile.role === 'admin') {
          // Fetch admin-specific data
          const { data: adminData, error: adminError } = await supabase
            .from('admin_permissions')
            .select('*')
            .eq('user_id', profile.id)
            .single();
          
          if (adminError) {
            console.warn("Error fetching admin data:", adminError);
            userData = baseUser; // Fallback to base user
          } else {
            userData = {
              ...baseUser,
              role: 'admin' as const,
              permissions: adminData?.permissions || [],
            } as Admin;
          }
        } else {
          // Default to customer
          userData = {
            ...baseUser,
            role: 'customer' as const,
            loyaltyPoints: profile.loyalty_points || 0,
            preferences: profile.user_preferences || {},
            favorites: profile.favorites || [],
          } as Customer;
        }
        
        setUser(userData);
      } catch (error) {
        console.error("Error setting up user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          await setUpUser();
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Initial setup
    setUpUser();

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
        return false;
      }

      if (!data.user) {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: "No user returned from authentication",
        });
        return false;
      }

      // Profile will be set by auth state change listener
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "An unknown error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // User will be cleared by auth state change listener
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setIsLoading(true);
      
      // Extract first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: name,
            role,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error("No user returned from sign up");
      }
      
      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          active: true,
        });
      
      if (profileError) {
        throw profileError;
      }
      
      // Create role-specific record
      if (role === 'provider') {
        const { error: providerError } = await supabase
          .from('service_providers')
          .upsert({
            id: data.user.id,
            business_name: `${firstName}'s Business`,
            email,
            verification_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        
        if (providerError) {
          throw providerError;
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An unknown error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message || "An unknown error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, signUp, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
