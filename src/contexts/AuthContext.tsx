
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, UserRole, Provider, Customer, Admin, SubscriptionTier } from '@/types';

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
          const userData = {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email as string,
            firstName: '',
            lastName: '',
            role: 'customer' as UserRole,
            phoneNumber: sessionData.session.user.phone as string,
            // Convert to string to fix type errors
            createdAt: sessionData.session.user.created_at ? new Date(sessionData.session.user.created_at).toISOString() : undefined,
            emailVerified: false,
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
                loyaltyPoints: 0, // Converting to string to match the type
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
                categories: providerData.categories || [],
                services: providerData.services || [],
                rating: providerData.rating || 0,
                commission: providerData.commission_rate || 0,
                verificationStatus: providerData.verification_status || 'unverified',
                bannerUrl: providerData.banner_url || '',
                website: providerData.website || '',
                taxId: providerData.tax_id || '',
                reviewCount: providerData.review_count || 0,
                // Handle subscription tier, ensure it's a valid enum value
                subscriptionTier: (providerData.subscription_tier || 'free') as SubscriptionTier,
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

    // Set up auth subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN') {
        setSession(session);
        // Fetch user data as above
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setSession(null);
      }
    });

    initAuth();

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Session will be set by the auth subscription
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  // Sign up method
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

      if (error) {
        throw error;
      }

      // Session will be set by the auth subscription
      return { error: null, data };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error, data: null };
    }
  };

  // Sign out method
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // State will be cleared by the auth subscription
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Update profile method
  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false;

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName || user.firstName,
          last_name: data.lastName || user.lastName,
          phone_number: data.phoneNumber || user.phoneNumber,
          avatar_url: data.avatarUrl || user.avatarUrl,
          bio: data.bio || (userProfile as any)?.bio,
          address: data.address || (userProfile as any)?.address,
          city: data.city || (userProfile as any)?.city,
          country: data.country || (userProfile as any)?.country,
          active: data.isActive !== undefined ? data.isActive : (userProfile as any)?.active,
          preferred_language: 'English',
          // Handle date conversion
          birth_date: data.birthDate ? new Date(data.birthDate).toISOString() : (userProfile as any)?.birth_date,
          updated_at: new Date().toISOString(),
          email_verified: data.emailVerified !== undefined ? data.emailVerified : user.emailVerified,
          // Convert loyalty points to number if necessary
          loyalty_points: data.loyaltyPoints !== undefined ? Number(data.loyaltyPoints) : (userProfile as any)?.loyalty_points,
          notification_preferences: data.notificationPreferences || (userProfile as any)?.notification_preferences,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setUser({
        ...user,
        ...data,
      });

      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...data,
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  // Upload avatar method
  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user_avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('user_avatars').getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setUser({
        ...user,
        avatarUrl,
      });

      if (userProfile) {
        setUserProfile({
          ...userProfile,
          avatarUrl,
        });
      }

      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  // Reset password method
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  // Update password method
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  // Verify email method
  const verifyEmail = async (token: string) => {
    try {
      // This would depend on how your email verification is set up in Supabase
      // Placeholder implementation
      console.log('Verifying email with token:', token);
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  };

  // Send verification email method
  const sendVerificationEmail = async () => {
    try {
      // This would depend on how your email verification is set up in Supabase
      // Placeholder implementation
      console.log('Sending verification email');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

  // Check auth method
  const checkAuth = async (): Promise<User | null> => {
    try {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error || !sessionData.session) {
        throw error;
      }
      return user;
    } catch (error) {
      console.error('Error checking auth:', error);
      return null;
    }
  };

  const value = {
    user,
    userProfile,
    userRole,
    isLoading,
    loading: isLoading,
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
