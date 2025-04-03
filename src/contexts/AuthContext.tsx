
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
    let mounted = true;
    
    // Set up auth state change listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // Use setTimeout to defer database operations to prevent deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            // Fetch user profile when signed in
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Error fetching user profile on auth change:', profileError);
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            if (profileData) {
              await loadUserData(profileData, session.user.id);
            } else {
              // Create a basic profile if none exists
              const baseUser: User = {
                id: session.user.id,
                email: session.user.email || '',
                firstName: session.user.user_metadata?.first_name || '',
                lastName: session.user.user_metadata?.last_name || '',
                role: session.user.user_metadata?.role || 'customer',
                isActive: true,
                createdAt: new Date(),
                name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || 'User',
                avatar: session.user.user_metadata?.avatar_url
              };
              
              setUser(baseUser);
              setIsLoading(false);
              
              // Create profile in background
              supabase.from('profiles').upsert({
                id: session.user.id,
                email: session.user.email,
                first_name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0],
                last_name: session.user.user_metadata?.last_name || '',
                role: session.user.user_metadata?.role || 'customer',
                is_verified: true,
                created_at: new Date().toISOString()
              });
            }
          }, 0);
        } catch (error) {
          console.error('Error handling auth state change:', error);
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    });

    // Initial auth check
    const checkAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (sessionData?.session) {
          // If we have a session, get user profile from our database
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .maybeSingle();
          
          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 is "JSON object requested, multiple (or no) rows returned"
            // We ignore this specific error as it just means the profile doesn't exist yet
            console.error('Error fetching user profile:', profileError);
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          if (profileData) {
            await loadUserData(profileData, sessionData.session.user.id);
          } else {
            // Create a basic user object if no profile exists
            const baseUser: User = {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email || '',
              firstName: sessionData.session.user.user_metadata?.first_name || '',
              lastName: sessionData.session.user.user_metadata?.last_name || '',
              role: sessionData.session.user.user_metadata?.role || 'customer',
              isActive: true,
              createdAt: new Date(),
              name: sessionData.session.user.user_metadata?.first_name || 
                    sessionData.session.user.email?.split('@')[0] || 'User',
              avatar: sessionData.session.user.user_metadata?.avatar_url
            };
            
            setUser(baseUser);
            
            // Create profile in background
            supabase.from('profiles').upsert({
              id: sessionData.session.user.id,
              email: sessionData.session.user.email,
              first_name: sessionData.session.user.user_metadata?.first_name || 
                          sessionData.session.user.email?.split('@')[0],
              last_name: sessionData.session.user.user_metadata?.last_name || '',
              role: sessionData.session.user.user_metadata?.role || 'customer',
              is_verified: true,
              created_at: new Date().toISOString()
            });
          }
        } else {
          // No session found, user is not logged in
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
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
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        role: profileData.role as UserRole || 'customer',
        name: displayName,
        avatar: profileData.avatar_url,
        phoneNumber: profileData.phone_number,
        isActive: profileData.active || false,
        createdAt: new Date(profileData.created_at || '')
      };
      
      // Get role-specific data
      if (profileData.role === 'provider') {
        const { data: providerData, error: providerError } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (providerError && providerError.code !== 'PGRST116') {
          console.error('Error fetching provider data:', providerError);
          setUser(baseUser);
          setIsLoading(false);
          return;
        }
        
        if (providerData) {
          // Explicitly type the verification_status to resolve TS error
          const verificationStatus = providerData.verification_status as ProviderVerificationStatus || 'pending';
          
          // Create provider-specific user object
          const provider: Provider = {
            ...baseUser,
            role: 'provider',
            businessName: providerData.business_name || '',
            description: providerData.business_description || '',
            verificationStatus: verificationStatus,
            rating: providerData.rating || 0,
            reviewCount: providerData.rating_count || 0,
            subscriptionTier: providerData.subscription_tier || 'free'
          };
          
          // We now safely add these properties that may have been missing before
          provider.categories = providerData.categories || [];
          provider.locations = [providerData.city, providerData.country].filter(Boolean);
          
          // Safely handle bank details
          if (providerData.bank_details) {
            provider.bankDetails = providerData.bank_details;
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
          loyaltyPoints: profileData.loyalty_points || 0
        };
        
        setUser(customer);
      } else if (profileData.role === 'admin') {
        // Get admin permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('admin_permissions')
          .select('permissions')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (permissionsError && permissionsError.code !== 'PGRST116') {
          console.error('Error fetching admin permissions:', permissionsError);
        }
        
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
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
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
          firstName: data.user.user_metadata?.first_name || '',
          lastName: data.user.user_metadata?.last_name || '',
          role: userRole as UserRole,
          isActive: true,
          createdAt: new Date(),
          name: displayName,
          avatar: data.user.user_metadata?.avatar_url
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
      return true;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Authentication failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
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
            verification_status: 'pending',
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
        firstName,
        lastName,
        name,
        role,
        isActive: true,
        createdAt: new Date()
      };

      let userWithRole: User = baseUser;
      
      if (role === 'provider') {
        userWithRole = {
          ...baseUser,
          role: 'provider',
          businessName: `${name}'s Business`,
          description: '',
          verificationStatus: 'pending',
          categories: [],
          locations: [],
          subscriptionTier: 'free',
          rating: 0,
          reviewCount: 0
        } as Provider;
      } else if (role === 'customer') {
        userWithRole = {
          ...baseUser,
          role: 'customer',
          favorites: [],
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
      
      return true;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      return false;
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

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for password reset instructions.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: 'Password reset failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword
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
