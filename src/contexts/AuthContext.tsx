import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole, Customer, Provider, Admin, User, Session as CustomSession } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextProps {
  user: User | null;
  session: CustomSession | null;
  userRole: UserRole | null;
  userProfile: Customer | Provider | Admin | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, role: UserRole, userData: Partial<Customer | Provider>) => Promise<{ error: any | null, data: any | null }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any | null }>;
  resetPassword: (password: string) => Promise<{ error: any | null }>;
  updateProfile: (data: Partial<Customer | Provider | Admin>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<CustomSession | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<Customer | Provider | Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (session) {
        const customSession: CustomSession = {
          access_token: session.access_token,
          token_type: session.token_type,
          expires_in: session.expires_in,
          refresh_token: session.refresh_token,
          user: session.user as unknown as User
        };
        
        setSession(customSession);
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: 'customer', // Default role, will be updated when profile is fetched
          firstName: '',
          lastName: '',
          isActive: true,
          createdAt: new Date(session.user.created_at),
        };
        /* setUser(user);
        
        // Use setTimeout to prevent recursive deadlocks with Supabase auth
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      } else {
        setSession(null);
        setUser(null);
        setUserRole(null);
        setUserProfile(null);
        setLoading(false);
      } */
    });

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Session exists' : 'No session');
      
      if (session) {
        const customSession: CustomSession = {
          access_token: session.access_token,
          token_type: session.token_type,
          expires_in: session.expires_in,
          refresh_token: session.refresh_token,
          user: session.user as unknown as User
        };
        
        setSession(customSession);
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: 'customer', // Default role, will be updated when profile is fetched
          firstName: '',
          lastName: '',
          isActive: true,
          createdAt: new Date(session.user.created_at),
        };
        setUser(user);
        
        // Use setTimeout to prevent recursive deadlocks with Supabase auth
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(supabaseUser: SupabaseUser) {
    try {
      // First, try to get the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        // Don't throw an error if the profile doesn't exist yet
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, user may need to complete registration');
          setLoading(false);
          return;
        }
        
        console.error('Error fetching user profile:', profileError);
        setLoading(false);
        return;
      }

      const role = profileData.role as UserRole;
      setUserRole(role);

      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`,
          avatarUrl: profileData.avatar_url || '',
          avatar: profileData.avatar_url || '',
          phoneNumber: profileData.phone_number || '',
          role,
          loyaltyPoints: profileData.loyalty_points || 0,
        };
      });

      switch (role) {
        case 'customer': {
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('id', supabaseUser.id)
            .maybeSingle();

          if (customerError && customerError.code !== 'PGRST116') {
            console.error('Error fetching customer data:', customerError);
          }

          const customer: Customer = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatar: profileData.avatar_url || '',
            role: 'customer',
            loyaltyPoints: profileData.loyalty_points || 0,
            isActive: true,
            preferredCategories: customerData?.preferred_categories || [],
            notificationPreferences: customerData?.notification_preferences || { email: true, sms: false, push: true },
            createdAt: new Date(profileData.created_at),
            isVerified: profileData.email_verified || false
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

          if (providerError && providerError.code !== 'PGRST116') {
            console.error('Error fetching provider data:', providerError);
          }

          const provider: Provider = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatar: profileData.avatar_url || '',
            role: 'provider',
            isActive: providerData?.is_active ?? true,
            businessName: providerData?.business_name || '',
            businessDescription: providerData?.business_description || '',
            verificationStatus: (providerData?.verification_status as any) || 'pending',
            rating: providerData?.rating || 0,
            reviewCount: providerData?.rating_count || 0,
            categories: providerData?.categories || [],
            createdAt: new Date(profileData.created_at),
            isVerified: profileData.email_verified || false,
            subscriptionTier: providerData?.subscription_tier || 'free',
            bankDetails: providerData?.bank_details || {}
          };
          
          setUserProfile(provider);
          break;
        }

        case 'admin': {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_permissions')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .maybeSingle();

          if (adminError && adminError.code !== 'PGRST116') {
            console.error('Error fetching admin data:', adminError);
          }

          const admin: Admin = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatar: profileData.avatar_url || '',
            role: 'admin',
            isActive: true,
            permissions: adminData?.permissions || [],
            createdAt: new Date(profileData.created_at),
            isVerified: true
          };
          
          setUserProfile(admin);
          break;
        }

        default:
          console.error('Unknown user role:', role);
      }
    } catch (error) {
      console.error('Unexpected error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
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
      
      // 2. Create profile record
      const profileData = {
        id: data.user.id,
        email,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        phone_number: 'phoneNumber' in userData ? userData.phoneNumber : '',
        role, // Make sure role is saved in profiles table
        created_at: new Date().toISOString()
      };
      
      console.log('Creating profile with data:', profileData);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { error: profileError, data: null };
      }
      
      console.log('Profile created successfully');
      
      // 3. Create role-specific records based on the specified role
      if (role === 'provider') {
        // Create provider record
        const providerData = {
          id: data.user.id,
          business_name: 'businessName' in userData ? userData.businessName || '' : `${userData.firstName}'s Business`,
          business_description: 'businessDescription' in userData ? userData.businessDescription || '' : '',
          verification_status: 'pending',
          subscription_tier: 'free',
          is_active: true,
          created_at: new Date().toISOString()
        };
        
        console.log('Creating provider record with data:', providerData);
        
        const { error: providerError } = await supabase
          .from('service_providers')
          .insert(providerData);
          
        if (providerError) {
          console.error('Error creating provider record:', providerError);
          return { error: providerError, data: null };
        }
        
        console.log('Provider record created successfully');
      } else if (role === 'customer') {
        // Create customer record
        const customerData = {
          id: data.user.id,
          preferred_categories: [],
          notification_preferences: { email: true, sms: false, push: true },
          created_at: new Date().toISOString()
        };
        
        console.log('Creating customer record with data:', customerData);
        
        const { error: customerError } = await supabase
          .from('customers')
          .insert(customerData);
          
        if (customerError) {
          console.error('Error creating customer record:', customerError);
          return { error: customerError, data: null };
        }
        
        console.log('Customer record created successfully');
      }
      
      return { error: null, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    try {
      await supabase.auth.signOut();
      console.log('User signed out successfully');
      
      // Clear all state explicitly
      setUser(null);
      setSession(null);
      setUserRole(null);
      setUserProfile(null);
      
      // Force some browser storage cleanup
      localStorage.removeItem('supabase.auth.token');
      
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
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
      const baseProfileData: any = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        updated_at: new Date().toISOString()
      };
      
      if ('avatar' in data && data.avatar) {
        baseProfileData['avatar_url'] = data.avatar;
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(baseProfileData)
        .eq('id', user.id);
        
      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error('Failed to update profile');
        return false;
      }
      
      if (userRole === 'provider' && 'businessName' in data) {
        const providerData: any = {
          business_name: data.businessName,
          business_description: data.businessDescription,
          updated_at: new Date().toISOString()
        };
        
        if ('avatar' in data && data.avatar) {
          providerData['avatar_url'] = data.avatar;
        }
        
        const { error: providerError } = await supabase
          .from('service_providers')
          .update(providerData)
          .eq('id', user.id);
          
        if (providerError) {
          console.error('Error updating provider record:', providerError);
          toast.error('Failed to update business information');
          return false;
        }
      }
      
      if (userProfile) {
        if (userRole === 'provider' && userProfile.role === 'provider') {
          const updatedProfile: Provider = {
            ...userProfile,
            firstName: data.firstName || userProfile.firstName,
            lastName: data.lastName || userProfile.lastName,
            phoneNumber: data.phoneNumber || userProfile.phoneNumber,
            avatar: ('avatar' in data && data.avatar) ? data.avatar : userProfile.avatar,
            businessName: ('businessName' in data) ? (data.businessName || '') : userProfile.businessName,
            businessDescription: ('businessDescription' in data) ? (data.businessDescription || '') : userProfile.businessDescription,
          };
          setUserProfile(updatedProfile);
        } else if (userRole === 'customer' && userProfile.role === 'customer') {
          const updatedProfile: Customer = {
            ...userProfile,
            firstName: data.firstName || userProfile.firstName,
            lastName: data.lastName || userProfile.lastName,
            phoneNumber: data.phoneNumber || userProfile.phoneNumber,
            avatar: ('avatar' in data && data.avatar) ? data.avatar : userProfile.avatar,
          };
          setUserProfile(updatedProfile);
        } else if (userRole === 'admin' && userProfile.role === 'admin') {
          const updatedProfile: Admin = {
            ...userProfile,
            firstName: data.firstName || userProfile.firstName,
            lastName: data.lastName || userProfile.lastName,
            phoneNumber: data.phoneNumber || userProfile.phoneNumber,
            avatar: ('avatar' in data && data.avatar) ? data.avatar : userProfile.avatar,
          };
          setUserProfile(updatedProfile);
        }
      }
      
      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          phoneNumber: data.phoneNumber || prev.phoneNumber,
          avatar: ('avatar' in data && data.avatar) ? data.avatar : prev.avatar,
          name: `${data.firstName || prev.firstName} ${data.lastName || prev.lastName}`,
        };
      });
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast.error('Something went wrong while updating your profile');
      return false;
    }
  };

  const value = {
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
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
