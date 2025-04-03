
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { UserRole, Customer, Provider, Admin } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userProfile: Customer | Provider | Admin | null;
  loading: boolean;
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
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<Customer | Provider | Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUserRole(null);
        setUserProfile(null);
      }
    });

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(user: User) {
    try {
      // First, get the basic user data from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setLoading(false);
        return;
      }

      const role = profileData.role as UserRole;
      setUserRole(role);

      // Depending on the role, fetch additional data from the appropriate table
      switch (role) {
        case 'customer':
          setUserProfile({
            id: user.id,
            email: user.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatar: profileData.avatar_url || '',
            role: 'customer',
            preferredCategories: profileData.preferred_categories || [],
            notificationPreferences: profileData.notification_preferences || { email: true, sms: false, push: true },
            createdAt: new Date(profileData.created_at),
            isVerified: profileData.email_verified || false
          });
          break;

        case 'provider':
          // Get provider-specific data
          const { data: providerData, error: providerError } = await supabase
            .from('service_providers')
            .select('*')
            .eq('id', user.id)
            .single();

          if (providerError) {
            console.error('Error fetching provider data:', providerError);
            setLoading(false);
            return;
          }

          // Combine base profile with provider-specific data
          setUserProfile({
            id: user.id,
            email: user.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatar: profileData.avatar_url || '',
            role: 'provider',
            businessName: providerData.business_name || '',
            businessDescription: providerData.business_description || '',
            businessLogo: providerData.avatar_url || '',
            verificationStatus: providerData.verification_status || 'pending',
            rating: providerData.rating || 0,
            reviewCount: providerData.rating_count || 0,
            completedBookings: providerData.completed_bookings || 0,
            categories: providerData.categories || [],
            createdAt: new Date(profileData.created_at),
            isVerified: profileData.email_verified || false,
            subscription: providerData.subscription_tier || 'free',
            bankDetails: providerData.bank_details || {}
          });
          break;

        case 'admin':
          // Get admin permissions
          const { data: adminData, error: adminError } = await supabase
            .from('admin_permissions')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (adminError && adminError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error('Error fetching admin data:', adminError);
          }

          setUserProfile({
            id: user.id,
            email: user.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatar: profileData.avatar_url || '',
            role: 'admin',
            permissions: adminData?.permissions || [],
            createdAt: new Date(profileData.created_at),
            isVerified: true
          });
          break;

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
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        return { error, data: null };
      }
      
      if (!data.user) {
        return { error: new Error('No user returned from signup'), data: null };
      }
      
      // Then create the basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          email,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          phone_number: userData.phoneNumber || '',
          role,
          created_at: new Date().toISOString()
        }]);
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { error: profileError, data: null };
      }
      
      // If this is a provider, create the provider record too
      if (role === 'provider' && 'businessName' in userData) {
        const { error: providerError } = await supabase
          .from('service_providers')
          .insert([{
            id: data.user.id,
            business_name: userData.businessName || '',
            business_description: userData.businessDescription || '',
            verification_status: 'pending',
            subscription_tier: 'free',
            created_at: new Date().toISOString()
          }]);
          
        if (providerError) {
          console.error('Error creating provider record:', providerError);
          return { error: providerError, data: null };
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
      const baseProfileData = {
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
        const providerData = {
          business_name: data.businessName,
          business_description: data.businessDescription,
          updated_at: new Date().toISOString()
        };
        
        if ('businessLogo' in data && data.businessLogo) {
          providerData['business_logo'] = data.businessLogo;
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
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      
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
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
