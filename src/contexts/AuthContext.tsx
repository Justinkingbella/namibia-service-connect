
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthChangeEvent, Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole, Customer, Provider, Admin, User, AuthContextType } from '@/types/auth';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  
  // Use Zustand stores
  const { 
    user, setUser, 
    userProfile, setUserProfile, 
    session, setSession, 
    userRole, setUserRole, 
    clearAuthState 
  } = useAuthStore();
  
  const { 
    fetchUserProfile,
    fetchProviderProfile,
    fetchCustomerProfile,
    updateUserProfile,
    updateProviderProfile,
    updateCustomerProfile,
    createUserProfiles,
    clearProfileState
  } = useProfileStore();

  // Set up auth state change handler
  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession ? 'Session exists' : 'No session');

      if (newSession && event !== 'INITIAL_SESSION') {
        // Create custom session object
        const customSession = {
          access_token: newSession.access_token,
          refresh_token: newSession.refresh_token,
          expires_at: newSession.expires_at,
          user: {
            id: newSession.user.id,
            email: newSession.user.email || '',
            role: newSession.user.user_metadata?.role as UserRole || 'customer'
          }
        };

        setSession(customSession);
        
        // Get role from user metadata or default to customer
        const userRole = newSession.user.user_metadata?.role as UserRole || 'customer';
        setUserRole(userRole);

        // Create user object
        const userObj: User = {
          id: newSession.user.id,
          email: newSession.user.email || '',
          role: userRole,
          firstName: newSession.user.user_metadata?.first_name || '',
          lastName: newSession.user.user_metadata?.last_name || '',
          isActive: true,
          createdAt: new Date(newSession.user.created_at),
        };
        
        setUser(userObj);

        // Use setTimeout to prevent recursive deadlocks with Supabase auth
        setTimeout(async () => {
          await fetchUserProfileData(newSession.user);
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        clearAuthState();
        clearProfileState();
        setLoading(false);
      }
    });

    // Then check for an existing session
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('Initial session check:', initialSession ? 'Session exists' : 'No session');

      if (initialSession) {
        // Create custom session object
        const customSession = {
          access_token: initialSession.access_token,
          refresh_token: initialSession.refresh_token,
          expires_at: initialSession.expires_at,
          user: {
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            role: initialSession.user.user_metadata?.role as UserRole || 'customer'
          }
        };

        setSession(customSession);
        
        // Get role from user metadata or default to customer
        const userRole = initialSession.user.user_metadata?.role as UserRole || 'customer';
        setUserRole(userRole);

        // Create user object
        const userObj: User = {
          id: initialSession.user.id,
          email: initialSession.user.email || '',
          role: userRole,
          firstName: initialSession.user.user_metadata?.first_name || '',
          lastName: initialSession.user.user_metadata?.last_name || '',
          isActive: true,
          createdAt: new Date(initialSession.user.created_at),
        };
        
        setUser(userObj);

        // Use setTimeout to prevent recursive deadlocks with Supabase auth
        setTimeout(async () => {
          await fetchUserProfileData(initialSession.user);
        }, 0);
      } else {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserProfileData(supabaseUser: SupabaseUser) {
    try {
      // Fetch the user profile
      await fetchUserProfile(supabaseUser.id);
      
      // Get user role from metadata or from profile
      const role = supabaseUser.user_metadata?.role as UserRole || 'customer';
      setUserRole(role);

      // Fetch role-specific profiles
      if (role === 'customer') {
        await fetchCustomerProfile(supabaseUser.id);
      } else if (role === 'provider') {
        await fetchProviderProfile(supabaseUser.id);
      }
      
      // Create a role-specific user profile object
      await buildUserProfile(supabaseUser, role);
      
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function buildUserProfile(supabaseUser: SupabaseUser, role: UserRole) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile data:', profileError);
        return;
      }

      switch (role) {
        case 'customer': {
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('id', supabaseUser.id)
            .maybeSingle();

          const customer: Customer = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData?.first_name || '',
            lastName: profileData?.last_name || '',
            phoneNumber: profileData?.phone_number || '',
            avatarUrl: profileData?.avatar_url || '',
            role: 'customer',
            isActive: profileData?.active || true,
            createdAt: profileData?.created_at ? new Date(profileData.created_at) : new Date(),
            loyaltyPoints: profileData?.loyalty_points || 0,
            preferredCategories: customerData?.preferred_categories || [],
            notificationPreferences: customerData?.notification_preferences || { email: true, sms: false, push: true },
            savedServices: customerData?.saved_services || []
          };

          setUserProfile(customer);
          break;
        }

        case 'provider': {
          const { data: providerData, error: providerError } = await supabase
            .from('service_providers')
            .select('*')
            .eq('id', supabaseUser.id)
            .maybeSingle();

          const provider: Provider = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData?.first_name || '',
            lastName: profileData?.last_name || '',
            phoneNumber: profileData?.phone_number || '',
            avatarUrl: profileData?.avatar_url || '',
            role: 'provider',
            isActive: providerData?.is_active ?? true,
            businessName: providerData?.business_name || '',
            businessDescription: providerData?.business_description || '',
            verificationStatus: providerData?.verification_status || 'pending',
            rating: providerData?.rating || 0,
            reviewCount: providerData?.rating_count || 0,
            categories: [],
            createdAt: profileData?.created_at ? new Date(profileData.created_at) : new Date(),
            isVerified: profileData?.email_verified || false,
            subscriptionTier: providerData?.subscription_tier || 'free',
            bankDetails: {}
          };

          setUserProfile(provider);
          break;
        }

        case 'admin': {
          const { data: adminData } = await supabase
            .from('admin_permissions')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .maybeSingle();

          const admin: Admin = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData?.first_name || '',
            lastName: profileData?.last_name || '',
            phoneNumber: profileData?.phone_number || '',
            avatarUrl: profileData?.avatar_url || '',
            role: 'admin',
            isActive: true,
            permissions: adminData?.permissions || [],
            createdAt: profileData?.created_at ? new Date(profileData.created_at) : new Date(),
            isVerified: true
          };

          setUserProfile(admin);
          break;
        }
      }
    } catch (error) {
      console.error('Error building user profile:', error);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.info('Attempting login with credentials:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        console.info('Sign in successful');
      } else {
        console.error('Sign in failed:', error);
      }
      return { error };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    role: UserRole,
    userData: Partial<Customer | Provider>
  ) => {
    try {
      console.log('Signing up user with role:', role, 'and data:', userData);

      // 1. Create auth user with role in metadata
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role,
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
            business_name: role === 'provider' && 'businessName' in userData ? userData.businessName : ''
          }
        }
      });

      if (error) {
        console.error('Error creating user:', error);
        return { error, data: null };
      }

      if (!data.user) {
        console.error('No user returned from signup');
        return { error: new Error('No user returned from signup'), data: null };
      }

      console.log('User created successfully:', data.user.id);

      // 2. Create profiles using our store function
      const success = await createUserProfiles(
        data.user.id, 
        role, 
        {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email,
          phoneNumber: 'phoneNumber' in userData ? userData.phoneNumber : '',
          businessName: role === 'provider' && 'businessName' in userData ? userData.businessName : '',
          businessDescription: role === 'provider' && 'businessDescription' in userData ? userData.businessDescription : '',
        }
      );

      if (!success) {
        console.error('Error creating user profiles');
        return { error: new Error('Failed to create user profiles'), data };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error, data: null };
    }
  };

  const signOut = async (): Promise<void> => {
    console.log('Signing out user');
    try {
      await supabase.auth.signOut();
      console.log('User signed out successfully');

      // Clear all state
      clearAuthState();
      clearProfileState();

    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      return { error };
    }
  };

  const resetPassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error };
    }
  };

  const updateProfile = async (data: Partial<Customer | Provider | Admin>): Promise<boolean> => {
    if (!user) return false;

    try {
      let success = true;
      
      // Update base profile data
      const baseProfileData: any = {};
      
      if (data.firstName !== undefined) baseProfileData.firstName = data.firstName;
      if (data.lastName !== undefined) baseProfileData.lastName = data.lastName;
      if (data.phoneNumber !== undefined) baseProfileData.phoneNumber = data.phoneNumber;
      if ('avatarUrl' in data && data.avatarUrl) baseProfileData.avatarUrl = data.avatarUrl;

      success = success && await updateUserProfile(user.id, baseProfileData);

      // Update role-specific profile data
      if (userRole === 'provider' && 'businessName' in data) {
        const providerData: any = {};
        
        if (data.businessName !== undefined) providerData.businessName = data.businessName;
        if (data.businessDescription !== undefined) providerData.businessDescription = data.businessDescription;
        if ('avatarUrl' in data && data.avatarUrl) providerData.avatarUrl = data.avatarUrl;

        success = success && await updateProviderProfile(user.id, providerData);
      } else if (userRole === 'customer') {
        // Add any customer-specific updates if needed
        const customerData: any = {};
        
        if ('savedServices' in data) customerData.savedServices = data.savedServices;
        if ('preferredCategories' in data) customerData.preferredCategories = data.preferredCategories;
        if ('notificationPreferences' in data) customerData.notificationPreferences = data.notificationPreferences;
        
        if (Object.keys(customerData).length > 0) {
          success = success && await updateCustomerProfile(user.id, customerData);
        }
      }

      // Update the local user profile state
      if (success && userProfile) {
        const updatedUserProfile = { ...userProfile };
        
        if (data.firstName !== undefined) updatedUserProfile.firstName = data.firstName;
        if (data.lastName !== undefined) updatedUserProfile.lastName = data.lastName;
        if (data.phoneNumber !== undefined) updatedUserProfile.phoneNumber = data.phoneNumber;
        if ('avatarUrl' in data && data.avatarUrl) updatedUserProfile.avatarUrl = data.avatarUrl;
        
        if (userRole === 'provider' && userProfile.role === 'provider') {
          if ('businessName' in data && data.businessName !== undefined) {
            (updatedUserProfile as Provider).businessName = data.businessName;
          }
          if ('businessDescription' in data && data.businessDescription !== undefined) {
            (updatedUserProfile as Provider).businessDescription = data.businessDescription;
          }
        }
        
        setUserProfile(updatedUserProfile);
      }

      // Update the local user state
      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          phoneNumber: data.phoneNumber || prev.phoneNumber,
          avatarUrl: ('avatarUrl' in data && data.avatarUrl) ? data.avatarUrl : prev.avatarUrl,
          name: `${data.firstName || prev.firstName} ${data.lastName || prev.lastName}`,
        };
      });

      if (success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('There was an error updating your profile');
      }
      
      return success;
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      toast.error('Something went wrong while updating your profile');
      return false;
    }
  };

  const value: AuthContextType = {
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
    isAuthenticated: !!user && !!session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
