
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, Session, UserRole, Customer, Provider, Admin,
  ProviderVerificationStatus, SubscriptionTier, AuthContextType
} from '@/types/auth';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with initial values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  userProfile: null,
  loading: true,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  forgotPassword: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updateProfile: async () => false,
  isAuthenticated: false,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Customer | Provider | Admin | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const authStore = useAuthStore();

  // Initial session and auth state
  useEffect(() => {
    console.info('Auth state changed:', authStore.session ? 'AUTHENTICATED' : 'INITIAL_SESSION No session');
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.info('Initial session check:', session ? 'Session exists' : 'No session');
      
      if (session) {
        // Map the Supabase session to our application's Session type
        const mappedSession: Session = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: new Date(session.expires_at || 0).getTime(),
          token_type: session.token_type,
          user: {
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as UserRole) || 'customer'
          }
        };
        
        setSession(mappedSession);
        setIsAuthenticated(true);
        
        // Fetch user data and profile
        await fetchUserData(session.user.id, (session.user.user_metadata?.role as UserRole) || 'customer');
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        // Map the Supabase session to our application's Session type
        const mappedSession: Session = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: new Date(session.expires_at || 0).getTime(),
          token_type: session.token_type,
          user: {
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as UserRole) || 'customer'
          }
        };
        
        setSession(mappedSession);
        setIsAuthenticated(true);
        
        // Fetch user data and profile
        await fetchUserData(session.user.id, (session.user.user_metadata?.role as UserRole) || 'customer');
      } else if (event === 'SIGNED_OUT') {
        // Clear auth state
        setUser(null);
        setUserProfile(null);
        setSession(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user data and role-specific profile
  const fetchUserData = async (userId: string, role: UserRole) => {
    try {
      setLoading(true);
      
      // Fetch base profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Set user role from profile
      const userRoleFromProfile = profileData.role as UserRole || role;
      setUserRole(userRoleFromProfile);
      
      // Create base user object
      const baseUser: User = {
        id: userId,
        email: profileData.email || '',
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        role: userRoleFromProfile,
        phoneNumber: profileData.phone_number,
        avatarUrl: profileData.avatar_url,
        emailVerified: profileData.email_verified,
        address: profileData.address,
        city: profileData.city,
        country: profileData.country,
        isActive: profileData.active,
        createdAt: profileData.created_at ? new Date(profileData.created_at) : undefined,
        updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : undefined,
        notificationPreferences: typeof profileData.notification_preferences === 'object' ? 
          profileData.notification_preferences as { email: boolean; sms: boolean; push: boolean; } :
          { email: true, sms: false, push: true }
      };
      
      setUser(baseUser);
      
      // Fetch role-specific profile data
      let roleSpecificProfile = null;
      
      if (userRoleFromProfile === 'customer') {
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (!customerError) {
          const customerProfile: Customer = {
            ...baseUser,
            loyaltyPoints: profileData.loyalty_points,
            preferredCategories: customerData?.preferred_categories || [],
            savedServices: customerData?.saved_services || []
          };
          
          setUserProfile(customerProfile);
          roleSpecificProfile = customerProfile;
        } else {
          console.error('Error fetching customer profile:', customerError);
        }
      } else if (userRoleFromProfile === 'provider') {
        const { data: providerData, error: providerError } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (!providerError && providerData) {
          const providerProfile: Provider = {
            ...baseUser,
            businessName: providerData.business_name || '',
            businessDescription: providerData.business_description || '',
            website: providerData.website || '',
            verificationStatus: providerData.verification_status as ProviderVerificationStatus || 'pending',
            subscriptionTier: providerData.subscription_tier as SubscriptionTier || 'free',
            commissionRate: providerData.commission_rate || 10,
            completedBookings: providerData.completed_bookings || 0,
            rating: providerData.rating || 0,
            ratingCount: providerData.rating_count || 0,
            servicesCount: providerData.services_count || 0,
            bannerUrl: providerData.banner_url || '',
            isActive: providerData.is_active || false
          };
          
          setUserProfile(providerProfile);
          roleSpecificProfile = providerProfile;
        } else {
          console.error('Error fetching provider profile:', providerError);
        }
      } else if (userRoleFromProfile === 'admin') {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (!adminError) {
          const adminProfile: Admin = {
            ...baseUser,
            permissions: adminData?.permissions || [],
            isVerified: true,
            isActive: true
          };
          
          setUserProfile(adminProfile);
          roleSpecificProfile = adminProfile;
        } else {
          console.error('Error fetching admin profile:', adminError);
        }
      }
      
      // Set states in both local state and in store
      if (roleSpecificProfile) {
        authStore.setUser(baseUser);
        authStore.setUserProfile(roleSpecificProfile);
        authStore.setUserRole(userRoleFromProfile);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
      authStore.setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
      return { error };
    }
  };

  // Sign up with email, password, and role
  const signUp = async (email: string, password: string, role: UserRole, userData: Partial<Customer | Provider>) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            firstName: userData.firstName,
            lastName: userData.lastName
          }
        }
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('User creation failed');
      }
      
      // Create user profile
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone_number: userData.phoneNumber || null,
          avatar_url: userData.avatarUrl || null,
          role: role,
          active: true
        }
      ]);
      
      // Create role-specific profile
      if (role === 'provider') {
        const provider = userData as Provider;
        await supabase.from('service_providers').insert([
          {
            id: data.user.id,
            email: email,
            business_name: provider.businessName || null,
            business_description: provider.businessDescription || null,
            verification_status: 'pending',
            subscription_tier: 'free',
            is_active: true
          }
        ]);
      } else if (role === 'customer') {
        await supabase.from('customers').insert([
          {
            id: data.user.id,
            notification_preferences: { 
              email: true, 
              sms: false, 
              push: true 
            }
          }
        ]);
      }
      
      toast.success('Account created successfully!');
      
      return { error: null, data };
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to create account');
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear auth state
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setUserRole(null);
      setIsAuthenticated(false);
      
      // Clear auth store
      authStore.clearAuthState();
      
      toast.info('Signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  // Reset password
  const resetPassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to reset password');
      return { error };
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password'
      });
      
      if (error) throw error;
      
      toast.success('Password reset email sent');
      return { error: null };
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      toast.error(error.message || 'Failed to send password reset email');
      return { error };
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<Customer | Provider | Admin>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setLoading(true);
      
      // Map field names to snake_case for DB
      const profileData: Record<string, any> = {};
      
      if (data.firstName !== undefined) profileData.first_name = data.firstName;
      if (data.lastName !== undefined) profileData.last_name = data.lastName;
      if (data.email !== undefined) profileData.email = data.email;
      if (data.phoneNumber !== undefined) profileData.phone_number = data.phoneNumber;
      if (data.avatarUrl !== undefined) profileData.avatar_url = data.avatarUrl;
      if (data.address !== undefined) profileData.address = data.address;
      if (data.city !== undefined) profileData.city = data.city;
      if (data.country !== undefined) profileData.country = data.country;
      if (data.isActive !== undefined) profileData.active = data.isActive;
      
      if (Object.keys(profileData).length > 0) {
        profileData.updated_at = new Date().toISOString();
        
        // Update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);
          
        if (profileError) throw profileError;
      }
      
      // Update role-specific tables
      if (userRole === 'provider' && userProfile) {
        const providerData: Record<string, any> = {};
        const providerProfile = data as Provider;
        
        if (providerProfile.businessName !== undefined) providerData.business_name = providerProfile.businessName;
        if (providerProfile.businessDescription !== undefined) providerData.business_description = providerProfile.businessDescription;
        if (providerProfile.website !== undefined) providerData.website = providerProfile.website;
        if (providerProfile.bannerUrl !== undefined) providerData.banner_url = providerProfile.bannerUrl;
        
        if (Object.keys(providerData).length > 0) {
          providerData.updated_at = new Date().toISOString();
          
          // Update service_providers table
          const { error: providerError } = await supabase
            .from('service_providers')
            .update(providerData)
            .eq('id', user.id);
            
          if (providerError) throw providerError;
        }
      }
      
      // Update local state
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, ...data } as User;
      });
      
      setUserProfile(prev => {
        if (!prev) return null;
        return { ...prev, ...data };
      });
      
      // Update store state
      authStore.setUser({ ...user, ...data });
      if (userProfile) {
        authStore.setUserProfile({ ...userProfile, ...data });
      }
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        userProfile,
        loading,
        isLoading: loading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        resetPassword,
        updateProfile,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
