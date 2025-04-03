
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Transform Supabase Session to our custom Session
        const customSession: CustomSession = {
          access_token: session.access_token,
          token_type: session.token_type,
          expires_in: session.expires_in,
          refresh_token: session.refresh_token,
          user: session.user as unknown as User
        };
        
        setSession(customSession);
        // Convert Supabase User to our User type
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: 'customer', // Default, will be updated by fetchUserProfile
          firstName: '',
          lastName: '',
          isActive: true,
          createdAt: new Date(session.user.created_at),
        };
        setUser(user);
        fetchUserProfile(session.user);
      } else {
        setSession(null);
        setUser(null);
        setUserRole(null);
        setUserProfile(null);
      }
    });

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Transform Supabase Session to our custom Session
        const customSession: CustomSession = {
          access_token: session.access_token,
          token_type: session.token_type,
          expires_in: session.expires_in,
          refresh_token: session.refresh_token,
          user: session.user as unknown as User
        };
        
        setSession(customSession);
        // Convert Supabase User to our User type
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: 'customer', // Default, will be updated by fetchUserProfile
          firstName: '',
          lastName: '',
          isActive: true,
          createdAt: new Date(session.user.created_at),
        };
        setUser(user);
        fetchUserProfile(session.user);
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
      // First, get the basic user data from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setLoading(false);
        return;
      }

      const role = profileData.role as UserRole;
      setUserRole(role);

      // Update user with profile data
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

      // Depending on the role, fetch additional data from the appropriate table
      switch (role) {
        case 'customer': {
          // Get customer-specific data
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('id', supabaseUser.id)
            .maybeSingle();

          // It's okay if customer data doesn't exist yet or has an error
          // We'll use profile data instead
          
          // Create a customer profile
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
            preferredCategories: (customerData && 'preferred_categories' in customerData) 
              ? customerData.preferred_categories 
              : [],
            notificationPreferences: (customerData && 'notification_preferences' in customerData) 
              ? customerData.notification_preferences 
              : { email: true, sms: false, push: true },
            createdAt: new Date(profileData.created_at),
            isVerified: profileData.email_verified || false
          };
          
          setUserProfile(customer);
          break;
        }

        case 'provider': {
          // Get provider-specific data
          const { data: providerData, error: providerError } = await supabase
            .from('service_providers')
            .select('*')
            .eq('id', supabaseUser.id)
            .maybeSingle();

          if (providerError && providerError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error('Error fetching provider data:', providerError);
          }

          // Combine base profile with provider-specific data
          const provider: Provider = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatar: profileData.avatar_url || '',
            role: 'provider',
            isActive: true,
            businessName: providerData?.business_name || '',
            businessDescription: providerData?.business_description || '',
            verificationStatus: (providerData?.verification_status as ProviderVerificationStatus) || 'pending',
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
          // Get admin permissions
          const { data: adminData, error: adminError } = await supabase
            .from('admin_permissions')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .maybeSingle();

          if (adminError && adminError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error('Error fetching admin data:', adminError);
          }

          // Create admin profile
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
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
      // First, create the auth user
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role,
            first_name: 'firstName' in userData ? userData.firstName : '',
            last_name: 'lastName' in userData ? userData.lastName : '',
            business_name: role === 'provider' && 'businessName' in userData ? userData.businessName : ''
          }
        }
      });
      
      if (error) {
        return { error, data: null };
      }
      
      if (!data.user) {
        return { error: new Error('No user returned from signup'), data: null };
      }
      
      // Then create the basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          first_name: 'firstName' in userData ? userData.firstName : '',
          last_name: 'lastName' in userData ? userData.lastName : '',
          phone_number: 'phoneNumber' in userData ? userData.phoneNumber : '',
          role,
          created_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { error: profileError, data: null };
      }
      
      // If this is a provider, create the provider record too
      if (role === 'provider' && 'businessName' in userData) {
        const { error: providerError } = await supabase
          .from('service_providers')
          .insert({
            id: data.user.id,
            email: email,
            business_name: userData.businessName || '',
            business_description: userData.businessDescription || '',
            verification_status: 'pending',
            subscription_tier: 'free',
            created_at: new Date().toISOString()
          });
          
        if (providerError) {
          console.error('Error creating provider record:', providerError);
          return { error: providerError, data: null };
        }
      } else if (role === 'customer') {
        // Create customer record
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: data.user.id,
            created_at: new Date().toISOString()
          });
          
        if (customerError) {
          console.error('Error creating customer record:', customerError);
          return { error: customerError, data: null };
        }
      }
      
      return { error: null, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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
      // First update the base profile
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
      
      // If this is a provider, update the provider record too
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
      
      // Update the local state
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
      
      // Update the user object as well
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
    isLoading: loading, // Alias for backward compatibility
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
