
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, UserRole, Provider, Customer, Admin, SubscriptionTier, ProviderVerificationStatus } from '@/types';

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  userProfile: Customer | Provider | Admin | null;
  userRole: UserRole | null;
  isLoading: boolean;
  loading?: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{error: any | null}>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{error: any | null, data: any | null}>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  setUserProfile: (profile: Customer | Provider | Admin | null) => void;
  uploadAvatar: (file: File) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Customer | Provider | Admin | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (sessionData?.session) {
          setSession(sessionData.session);
          
          // Get user data
          const userData: User = {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email as string,
            firstName: '',
            lastName: '',
            role: 'customer' as UserRole,
            phoneNumber: sessionData.session.user.phone as string,
            // Convert to string to fix type errors
            createdAt: sessionData.session.user.created_at ? sessionData.session.user.created_at : undefined,
            emailVerified: false,
            avatarUrl: '',
          };

          // Fetch user profile from 'profiles' table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else if (profileData) {
            // Update user data with profile data
            userData.firstName = profileData.first_name || '';
            userData.lastName = profileData.last_name || '';
            userData.role = profileData.role as UserRole || 'customer';
            userData.phoneNumber = profileData.phone_number || '';
            userData.avatarUrl = profileData.avatar_url || '';
            userData.emailVerified = profileData.email_verified || false;
          }

          setUser(userData);
          setUserRole(userData.role);

          // Fetch role-specific data
          if (userData.role === 'customer') {
            const { data: customerData, error: customerError } = await supabase
              .from('customers')
              .select('*')
              .eq('id', userData.id)
              .single();

            if (!customerError && customerData) {
              const customerProfile: Customer = {
                ...userData,
                preferredCategories: customerData.preferred_categories || [],
                savedServices: customerData.saved_services || [],
                loyaltyPoints: 0,
                notificationPreferences: {
                  email: true,
                  sms: false,
                  push: true,
                },
              };
              setUserProfile(customerProfile);
            }
          } else if (userData.role === 'provider') {
            const { data: providerData, error: providerError } = await supabase
              .from('service_providers')
              .select('*')
              .eq('id', userData.id)
              .single();

            if (!providerError && providerData) {
              const providerProfile: Provider = {
                ...userData,
                businessName: providerData.business_name || '',
                businessDescription: providerData.business_description || '',
                // Use empty arrays as fallbacks for missing properties
                categories: providerData.categories || [],
                services: providerData.services || [], 
                rating: providerData.rating || 0,
                commission: providerData.commission_rate || 0,
                verificationStatus: (providerData.verification_status as ProviderVerificationStatus) || 'unverified',
                bannerUrl: providerData.banner_url || '',
                website: providerData.website || '',
                taxId: providerData.tax_id || '',
                reviewCount: providerData.review_count || 0,
                // Handle subscription tier, ensure it's a valid enum value
                subscriptionTier: (providerData.subscription_tier || 'free') as any,
              };
              setUserProfile(providerProfile);
            }
          } else if (userData.role === 'admin') {
            const { data: adminData, error: adminError } = await supabase
              .from('admin_permissions')
              .select('*')
              .eq('user_id', userData.id)
              .single();

            if (!adminError && adminData) {
              const adminProfile: Admin = {
                ...userData,
                permissions: adminData.permissions || [],
                adminLevel: 1, // Default admin level
                isVerified: true,
                accessLevel: 1,
              };
              setUserProfile(adminProfile);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // auth methods would be defined here
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'customer',
          },
        },
      });
      
      return { data, error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      // Implementation details would go here
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    // Implementation details would go here
    return '';
  };

  const resetPassword = async (email: string) => {
    // Implementation details would go here
  };

  const updatePassword = async (newPassword: string) => {
    // Implementation details would go here
  };

  const verifyEmail = async (token: string) => {
    // Implementation details would go here
  };

  const sendVerificationEmail = async () => {
    // Implementation details would go here
  };

  const checkAuth = async () => {
    // Implementation details would go here
    return null;
  };

  const contextValue: AuthContextType = {
    user,
    userProfile,
    userRole,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    isAuthenticated: !!user,
    session,
    signIn,
    signUp,
    signOut,
    updateProfile,
    setUserProfile,
    uploadAvatar,
    resetPassword,
    updatePassword,
    verifyEmail,
    sendVerificationEmail,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
