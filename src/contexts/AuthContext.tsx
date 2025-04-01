
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthContextType, Provider, Customer, Admin, DbUserProfile, DbProviderProfile } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // First, check Supabase session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session) {
        try {
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
            const userProfile = profileData as DbUserProfile;
            
            // Construct a name from first_name and last_name or use email
            const displayName = userProfile.first_name && userProfile.last_name 
              ? `${userProfile.first_name} ${userProfile.last_name}`
              : userProfile.first_name || userProfile.email?.split('@')[0] || 'Unknown User';
            
            // Create user object based on role
            const baseUser: User = {
              id: userProfile.id,
              email: userProfile.email || '',
              name: displayName,
              role: userProfile.role || 'customer',
              avatar: userProfile.avatar_url,
              phoneNumber: userProfile.phone_number,
              createdAt: new Date(userProfile.created_at || ''),
              isVerified: !!userProfile.is_verified
            };
            
            // Get additional role-specific data
            if (userProfile.role === 'provider') {
              const { data: providerData } = await supabase
                .from('service_providers')
                .select('*')
                .eq('id', userProfile.id)
                .single();
              
              if (providerData) {
                const providerProfile = providerData as DbProviderProfile;
                
                const provider: Provider = {
                  ...baseUser,
                  role: 'provider',
                  businessName: providerProfile.business_name || '',
                  description: providerProfile.business_description || '',
                  verificationStatus: providerProfile.verification_status || 'unverified',
                  categories: providerProfile.categories || [],
                  locations: providerProfile.locations || [],
                  subscriptionTier: (providerProfile.subscription_tier as any) || 'free',
                  rating: providerProfile.rating || 0,
                  reviewCount: providerProfile.rating_count || 0,
                  earnings: 0, // These fields might not exist in the current schema
                  balance: 0,
                  bankDetails: providerProfile.bank_name ? {
                    accountName: providerProfile.account_name || '',
                    accountNumber: providerProfile.account_number || '',
                    bankName: providerProfile.bank_name
                  } : undefined
                };
                setUser(provider);
              } else {
                setUser(baseUser);
              }
            } else if (userProfile.role === 'customer') {
              // For customers, use a mock implementation since there might not be a customer_profiles table
              const customer: Customer = {
                ...baseUser,
                role: 'customer',
                favorites: [],
                bookingCount: 0,
                totalSpent: 0,
                loyaltyPoints: 0
              };
              setUser(customer);
            } else if (userProfile.role === 'admin') {
              // For admins, use a mock implementation 
              const admin: Admin = {
                ...baseUser,
                role: 'admin',
                permissions: []
              };
              setUser(admin);
            } else {
              setUser(baseUser);
            }
          }
        } catch (error) {
          console.error('Error during profile fetch:', error);
          setUser(null);
        }
      } else {
        // No session found, check local storage as fallback
        const savedUser = localStorage.getItem('namibiaServiceUser');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error('Failed to parse saved user:', error);
            localStorage.removeItem('namibiaServiceUser');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('namibiaServiceUser');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }

      if (data.user) {
        // Get user profile from database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }

        const userProfile = profileData as DbUserProfile;
        
        // Construct a name from first_name and last_name or use email
        const displayName = userProfile.first_name && userProfile.last_name 
          ? `${userProfile.first_name} ${userProfile.last_name}`
          : userProfile.first_name || userProfile.email?.split('@')[0] || 'Unknown User';
        
        // Create base user object
        const baseUser: User = {
          id: userProfile.id,
          email: userProfile.email || '',
          name: displayName,
          role: userProfile.role || 'customer',
          avatar: userProfile.avatar_url,
          phoneNumber: userProfile.phone_number,
          createdAt: new Date(userProfile.created_at || ''),
          isVerified: !!userProfile.is_verified
        };

        // Get role-specific data
        let userWithRole: User = baseUser;
        
        if (userProfile.role === 'provider') {
          const { data: providerData } = await supabase
            .from('service_providers')
            .select('*')
            .eq('id', userProfile.id)
            .single();
          
          if (providerData) {
            const providerProfile = providerData as DbProviderProfile;
            
            userWithRole = {
              ...baseUser,
              role: 'provider',
              businessName: providerProfile.business_name || '',
              description: providerProfile.business_description || '',
              verificationStatus: providerProfile.verification_status as any || 'unverified',
              categories: providerProfile.categories || [],
              locations: providerProfile.locations || [],
              subscriptionTier: providerProfile.subscription_tier as any || 'free',
              rating: providerProfile.rating || 0,
              reviewCount: providerProfile.rating_count || 0,
              earnings: 0, // These fields might not exist in the current schema
              balance: 0,
              bankDetails: providerProfile.bank_name ? {
                accountName: providerProfile.account_name || '',
                accountNumber: providerProfile.account_number || '',
                bankName: providerProfile.bank_name
              } : undefined
            } as Provider;
          }
        } else if (userProfile.role === 'customer') {
          userWithRole = {
            ...baseUser,
            role: 'customer',
            favorites: [],
            bookingCount: 0,
            totalSpent: 0,
            referralCode: '',
            referredBy: '',
            loyaltyPoints: 0
          } as Customer;
        } else if (userProfile.role === 'admin') {
          userWithRole = {
            ...baseUser,
            role: 'admin',
            permissions: []
          } as Admin;
        }

        setUser(userWithRole);
        localStorage.setItem('namibiaServiceUser', JSON.stringify(userWithRole));
        
        toast({
          title: 'Signed in successfully',
          description: `Welcome back, ${userWithRole.name}!`,
        });
      } else {
        // Fallback to mock users logic if Supabase auth fails or returns no user
        console.log('No user found in Supabase response, falling back to mock data');
        
        // Find user by email in mock users (this is the original mock logic for fallback)
        const mockUsers = [
          {
            id: '1',
            email: 'admin@namibiaservice.com',
            name: 'Admin User',
            role: 'admin' as UserRole,
            createdAt: new Date(),
            isVerified: true,
          },
          {
            id: '2',
            email: 'provider@namibiaservice.com',
            name: 'Service Provider',
            role: 'provider' as UserRole,
            createdAt: new Date(),
            isVerified: true,
          },
          {
            id: '3',
            email: 'customer@namibiaservice.com',
            name: 'Customer User',
            role: 'customer' as UserRole,
            createdAt: new Date(),
            isVerified: true,
          },
        ];
        
        const foundUser = mockUsers.find(u => u.email === email);
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('namibiaServiceUser', JSON.stringify(foundUser));
          toast({
            title: 'Signed in successfully (mock)',
            description: `Welcome back, ${foundUser.name}!`,
          });
        } else {
          toast({
            title: 'Authentication failed',
            description: 'Invalid email or password',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Authentication failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name,
            role,
            businessName: role === 'provider' ? `${name}'s Business` : undefined
          }
        }
      });
      
      if (error) {
        throw error;
      }

      if (data.user) {
        // Extract first and last name
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        // Create a new profile for the user
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
        localStorage.setItem('namibiaServiceUser', JSON.stringify(userWithRole));
        
        toast({
          title: 'Registration successful',
          description: `Welcome to Namibia Service Hub, ${name}!`,
        });
      } else {
        // Fallback to mock signup logic
        console.log('No user created in Supabase, falling back to mock data');
        
        const mockUsers = [
          {
            id: '1',
            email: 'admin@namibiaservice.com',
            name: 'Admin User',
            role: 'admin' as UserRole,
            createdAt: new Date(),
            isVerified: true,
          },
          {
            id: '2',
            email: 'provider@namibiaservice.com',
            name: 'Service Provider',
            role: 'provider' as UserRole,
            createdAt: new Date(),
            isVerified: true,
          },
          {
            id: '3',
            email: 'customer@namibiaservice.com',
            name: 'Customer User',
            role: 'customer' as UserRole,
            createdAt: new Date(),
            isVerified: true,
          },
        ];
        
        // Check if email already exists
        if (mockUsers.some(u => u.email === email)) {
          toast({
            title: 'Registration failed',
            description: 'Email already in use',
            variant: 'destructive',
          });
          return;
        }
        
        // Create new user
        const newUser: User = {
          id: (mockUsers.length + 1).toString(),
          email,
          name,
          role,
          createdAt: new Date(),
          isVerified: false,
        };
        
        // Auto sign in after signup
        setUser(newUser);
        localStorage.setItem('namibiaServiceUser', JSON.stringify(newUser));
        
        toast({
          title: 'Registration successful (mock)',
          description: `Welcome to Namibia Service Hub, ${name}!`,
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
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
      
      // Remove user from state and local storage
      setUser(null);
      localStorage.removeItem('namibiaServiceUser');
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
