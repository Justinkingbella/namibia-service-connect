
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthContextType, Provider, Customer, Admin, DbUserProfile, DbProviderProfile, ProviderVerificationStatus } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // First, check Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          // If we have a session, get user profile from our database
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            setUser(null);
          } else if (profileData) {
            await loadUserData(profileData, sessionData.session.user.id);
          } else {
            setUser(null);
          }
        } else {
          // No session found, user is not logged in
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // Fetch user profile when signed in
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user profile on auth change:', profileError);
            setUser(null);
          } else if (profileData) {
            await loadUserData(profileData, session.user.id);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Initial auth check
    checkAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Helper function to load user data based on role
  const loadUserData = async (profileData: DbUserProfile, userId: string) => {
    try {
      // Construct a name from first_name and last_name or use email
      const displayName = profileData.first_name && profileData.last_name 
        ? `${profileData.first_name} ${profileData.last_name}`
        : profileData.first_name || profileData.email?.split('@')[0] || 'Unknown User';
      
      // Create base user object
      const baseUser: User = {
        id: userId,
        email: profileData.email || '',
        name: displayName,
        role: profileData.role || 'customer',
        avatar: profileData.avatar_url,
        phoneNumber: profileData.phone_number,
        createdAt: new Date(profileData.created_at || ''),
        isVerified: !!profileData.is_verified
      };
      
      // Get role-specific data
      if (profileData.role === 'provider') {
        const { data: providerData, error: providerError } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (providerError) {
          console.error('Error fetching provider data:', providerError);
          setUser(baseUser);
          return;
        }
        
        if (providerData) {
          // Explicitly type the verification_status to resolve TS error
          const verificationStatus = (providerData.verification_status as ProviderVerificationStatus) || 'unverified';
          
          // Create provider-specific user object
          const provider: Provider = {
            ...baseUser,
            role: 'provider',
            businessName: providerData.business_name || '',
            description: providerData.business_description || '',
            verificationStatus: verificationStatus,
            // Default to empty arrays if categories and locations don't exist
            categories: [], // We'll set this properly below
            locations: [], // We'll set this properly below
            subscriptionTier: providerData.subscription_tier as any || 'free',
            rating: providerData.rating || 0,
            reviewCount: providerData.rating_count || 0,
            earnings: 0,
            balance: 0,
            bankDetails: undefined // We'll set this properly below
          };
          
          // Safely handle categories and locations which might not exist in the DB response
          if ('categories' in providerData && Array.isArray(providerData.categories)) {
            provider.categories = providerData.categories;
          }
          
          if ('locations' in providerData && Array.isArray(providerData.locations)) {
            provider.locations = providerData.locations;
          }
          
          // Safely handle bank details
          const hasBankDetails = 
            ('bank_name' in providerData && providerData.bank_name) || 
            ('account_name' in providerData && providerData.account_name) || 
            ('account_number' in providerData && providerData.account_number);
            
          if (hasBankDetails) {
            provider.bankDetails = {
              accountName: ('account_name' in providerData ? String(providerData.account_name || '') : '') || '',
              accountNumber: ('account_number' in providerData ? String(providerData.account_number || '') : '') || '',
              bankName: ('bank_name' in providerData ? String(providerData.bank_name || '') : '') || ''
            };
          }
          
          setUser(provider);
        } else {
          setUser(baseUser);
        }
      } else if (profileData.role === 'customer') {
        const customer: Customer = {
          ...baseUser,
          role: 'customer',
          favorites: profileData.favorites || [],
          bookingCount: 0,
          totalSpent: 0,
          loyaltyPoints: profileData.loyalty_points || 0
        };
        
        setUser(customer);
      } else if (profileData.role === 'admin') {
        // Get admin permissions
        const { data: permissionsData } = await supabase
          .from('admin_permissions')
          .select('permissions')
          .eq('user_id', userId)
          .single();
        
        const admin: Admin = {
          ...baseUser,
          role: 'admin',
          permissions: permissionsData?.permissions || []
        };
        
        setUser(admin);
      } else {
        setUser(baseUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from authentication');
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile after login:', profileError);
        // Continue anyway, as the auth is successful
      }
      
      if (profileData) {
        await loadUserData(profileData, data.user.id);
      } else {
        // If no profile exists, create a basic one
        const displayName = data.user.user_metadata?.name || email.split('@')[0];
        const userRole = data.user.user_metadata?.role || 'customer';
        
        const baseUser: User = {
          id: data.user.id,
          email: email,
          name: displayName,
          role: userRole,
          createdAt: new Date(),
          isVerified: true
        };
        
        setUser(baseUser);
        
        // Create profile if it doesn't exist
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email,
          first_name: displayName,
          role: userRole,
          is_verified: true,
          created_at: new Date().toISOString()
        });
      }
      
      toast({
        title: 'Signed in successfully',
        description: 'Welcome back!',
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Authentication failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Extract first and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
          }
        }
      });
      
      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Failed to create user');
      }
      
      // Create a profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          role: role,
          is_verified: false,
          created_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      // If the user is a provider, create an entry in service_providers
      if (role === 'provider') {
        const { error: providerError } = await supabase
          .from('service_providers')
          .upsert({
            id: data.user.id,
            email: email,
            business_name: `${name}'s Business`,
            business_description: '',
            verification_status: 'unverified',
            subscription_tier: 'free',
            rating: 0,
            rating_count: 0,
            created_at: new Date().toISOString()
          });
          
        if (providerError) {
          console.error('Error creating provider profile:', providerError);
        }
      }

      // Create a user object
      const baseUser: User = {
        id: data.user.id,
        email,
        name,
        role,
        createdAt: new Date(),
        isVerified: false
      };

      let userWithRole: User = baseUser;
      
      if (role === 'provider') {
        userWithRole = {
          ...baseUser,
          role: 'provider',
          businessName: `${name}'s Business`,
          description: '',
          verificationStatus: 'unverified',
          categories: [],
          locations: [],
          subscriptionTier: 'free',
          rating: 0,
          reviewCount: 0,
          earnings: 0,
          balance: 0
        } as Provider;
      } else if (role === 'customer') {
        userWithRole = {
          ...baseUser,
          role: 'customer',
          favorites: [],
          bookingCount: 0,
          totalSpent: 0,
          loyaltyPoints: 0
        } as Customer;
      } else if (role === 'admin') {
        userWithRole = {
          ...baseUser,
          role: 'admin',
          permissions: []
        } as Admin;
      }

      setUser(userWithRole);
      
      toast({
        title: 'Registration successful',
        description: `Welcome to Namibia Service Hub, ${name}!`,
      });
      
      return userWithRole;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Remove user from state
      setUser(null);
      
      toast({
        title: 'Signed out successfully',
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
