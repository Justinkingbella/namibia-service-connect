
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthContextType, Provider, Customer, Admin, RawUserProfile, ProviderProfile, CustomerProfile } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch the basic user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      if (!profileData) return null;

      const userProfile = {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name || profileData.email,
        role: profileData.role as UserRole,
        avatar_url: profileData.avatar_url,
        phone_number: profileData.phone_number,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
        is_verified: profileData.is_verified
      } as RawUserProfile;

      // If user is a provider, fetch provider profile details
      if (userProfile.role === 'provider') {
        const { data: providerData, error: providerError } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!providerError && providerData) {
          const providerProfile: ProviderProfile = {
            id: providerData.id,
            business_name: providerData.business_name,
            description: providerData.description,
            verification_status: providerData.verification_status,
            categories: providerData.categories,
            locations: providerData.locations,
            subscription_tier: providerData.subscription_tier,
            rating: providerData.rating,
            review_count: providerData.review_count,
            earnings: providerData.earnings,
            balance: providerData.balance,
            bank_name: providerData.bank_name,
            account_name: providerData.account_name,
            account_number: providerData.account_number,
            bank_name: providerData.bank_name
          };
          return { ...userProfile, providerDetails: providerProfile };
        }
      }
      
      // If user is a customer, fetch customer profile details
      if (userProfile.role === 'customer') {
        const { data: customerData, error: customerError } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!customerError && customerData) {
          const customerProfile: CustomerProfile = {
            id: customerData.id,
            favorites: customerData.favorites,
            booking_count: customerData.booking_count,
            total_spent: customerData.total_spent,
            referral_code: customerData.referral_code,
            referred_by: customerData.referred_by,
            loyalty_points: customerData.loyalty_points
          };
          return { ...userProfile, customerDetails: customerProfile };
        }
      }

      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const updateUserProfile = async (userId: string, userData: Partial<User>) => {
    try {
      // Extract user profile data
      const { name, email, avatar_url, phone_number, isVerified } = userData;
      
      // Update user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .update({
          name,
          email,
          avatar_url,
          phone_number,
          is_verified: isVerified
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (profileError) throw profileError;
      
      // Update role-specific data
      const role = profileData.role as UserRole;
      
      if (role === 'provider' && userData.providerDetails) {
        const { data: providerData, error: providerError } = await supabase
          .from('provider_profiles')
          .update(userData.providerDetails)
          .eq('id', userId)
          .select()
          .single();
        
        if (providerError) throw providerError;
        
        return {
          ...profileData,
          providerDetails: providerData
        };
      }
      
      if (role === 'customer' && userData.customerDetails) {
        const { data: customerData, error: customerError } = await supabase
          .from('customer_profiles')
          .update(userData.customerDetails)
          .eq('id', userId)
          .select()
          .single();
        
        if (customerError) throw customerError;
        
        return {
          ...profileData,
          customerDetails: customerData
        };
      }
      
      return profileData;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // First, check Supabase session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session) {
        try {
          // If we have a session, get user profile from our database
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            setUser(null);
          } else if (profileData) {
            // Create user object based on role
            const baseUser: User = {
              id: profileData.id,
              email: profileData.email,
              name: profileData.name || profileData.email.split('@')[0],
              role: profileData.role,
              avatar: profileData.avatar_url,
              phoneNumber: profileData.phone_number,
              createdAt: new Date(profileData.created_at),
              isVerified: profileData.is_verified
            };
            
            // Get additional role-specific data
            if (profileData.role === 'provider') {
              const { data: providerData, error: providerError } = await supabase
                .from('provider_profiles')
                .select('*')
                .eq('id', profileData.id)
                .single();
              
              if (providerError) {
                console.error('Error fetching provider details:', providerError);
              } else if (providerData) {
                const provider: Provider = {
                  ...baseUser,
                  role: 'provider',
                  businessName: providerData.business_name,
                  description: providerData.description || '',
                  verificationStatus: providerData.verification_status as any,
                  categories: providerData.categories || [],
                  locations: providerData.locations || [],
                  subscriptionTier: providerData.subscription_tier as any,
                  rating: providerData.rating || 0,
                  reviewCount: providerData.review_count || 0,
                  earnings: providerData.earnings || 0,
                  balance: providerData.balance || 0,
                  bankDetails: providerData.bank_name ? {
                    accountName: providerData.account_name || '',
                    accountNumber: providerData.account_number || '',
                    bankName: providerData.bank_name
                  } : undefined
                };
                setUser(provider);
              }
            } else if (profileData.role === 'customer') {
              const { data: customerData, error: customerError } = await supabase
                .from('customer_profiles')
                .select('*')
                .eq('id', profileData.id)
                .single();
              
              if (customerError) {
                console.error('Error fetching customer details:', customerError);
              } else if (customerData) {
                const customer: Customer = {
                  ...baseUser,
                  role: 'customer',
                  favorites: customerData.favorites || [],
                  bookingCount: customerData.booking_count || 0,
                  totalSpent: customerData.total_spent || 0,
                  referralCode: customerData.referral_code,
                  referredBy: customerData.referred_by,
                  loyaltyPoints: customerData.loyalty_points || 0
                };
                setUser(customer);
              }
            } else if (profileData.role === 'admin') {
              const { data: adminData, error: adminError } = await supabase
                .from('admin_permissions')
                .select('*')
                .eq('id', profileData.id)
                .single();
              
              if (adminError) {
                console.error('Error fetching admin details:', adminError);
              } else if (adminData) {
                const admin: Admin = {
                  ...baseUser,
                  role: 'admin',
                  permissions: adminData.permissions || []
                };
                setUser(admin);
              }
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
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }

        // Create base user object
        const baseUser: User = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name || profileData.email.split('@')[0],
          role: profileData.role,
          avatar: profileData.avatar_url,
          phoneNumber: profileData.phone_number,
          createdAt: new Date(profileData.created_at),
          isVerified: profileData.is_verified
        };

        // Get role-specific data
        let userWithRole: User = baseUser;
        
        if (profileData.role === 'provider') {
          const { data: providerData, error: providerError } = await supabase
            .from('provider_profiles')
            .select('*')
            .eq('id', profileData.id)
            .single();
          
          if (!providerError && providerData) {
            userWithRole = {
              ...baseUser,
              role: 'provider',
              businessName: providerData.business_name,
              description: providerData.description || '',
              verificationStatus: providerData.verification_status as any,
              categories: providerData.categories || [],
              locations: providerData.locations || [],
              subscriptionTier: providerData.subscription_tier as any,
              rating: providerData.rating || 0,
              reviewCount: providerData.review_count || 0,
              earnings: providerData.earnings || 0,
              balance: providerData.balance || 0,
              bankDetails: providerData.bank_name ? {
                accountName: providerData.account_name || '',
                accountNumber: providerData.account_number || '',
                bankName: providerData.bank_name
              } : undefined
            } as Provider;
          }
        } else if (profileData.role === 'customer') {
          const { data: customerData, error: customerError } = await supabase
            .from('customer_profiles')
            .select('*')
            .eq('id', profileData.id)
            .single();
          
          if (!customerError && customerData) {
            userWithRole = {
              ...baseUser,
              role: 'customer',
              favorites: customerData.favorites || [],
              bookingCount: customerData.booking_count || 0,
              totalSpent: customerData.total_spent || 0,
              referralCode: customerData.referral_code,
              referredBy: customerData.referred_by,
              loyaltyPoints: customerData.loyalty_points || 0
            } as Customer;
          }
        } else if (profileData.role === 'admin') {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_permissions')
            .select('*')
            .eq('id', profileData.id)
            .single();
          
          if (!adminError && adminData) {
            userWithRole = {
              ...baseUser,
              role: 'admin',
              permissions: adminData.permissions || []
            } as Admin;
          }
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
            name,
            role,
            businessName: role === 'provider' ? `${name}'s Business` : undefined
          }
        }
      });
      
      if (error) {
        throw error;
      }

      if (data.user) {
        // Our database trigger should automatically create the profile
        // But we'll manually create a user object for the UI
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
