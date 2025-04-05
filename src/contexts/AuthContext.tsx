
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User, Customer, Provider, Admin, Session, UserRole, DbUserProfile, ProviderVerificationStatus, SubscriptionTier } from '@/types/auth';
import { toast } from 'sonner';

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  userProfile: null,
  loading: true,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => false,
  isAuthenticated: false
});

// AuthProvider component that wraps the application
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<Customer | Provider | Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth event:', event);
        
        if (currentSession) {
          // Process and set session data
          const customSession: Session = {
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token,
            expires_at: currentSession.expires_at,
            user: {
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              role: currentSession.user.user_metadata?.role || 'customer'
            }
          };
          
          setSession(customSession);
          
          // Process and set user data
          const userData: User = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            firstName: currentSession.user.user_metadata?.first_name || '',
            lastName: currentSession.user.user_metadata?.last_name || '',
            role: currentSession.user.user_metadata?.role || 'customer',
            emailVerified: currentSession.user.email_confirmed_at ? true : false,
            isActive: true,
            createdAt: new Date(currentSession.user.created_at)
          };
          
          setUser(userData);
          setUserRole(userData.role);
          
          // Fetch complete profile data
          await fetchUserProfile(currentSession.user.id, userData.role);
        } else {
          // Clear all auth data on sign out or session expiry
          setUser(null);
          setSession(null);
          setUserRole(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Initial session check
    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (initialSession) {
          // Process and set session data
          const customSession: Session = {
            access_token: initialSession.access_token,
            refresh_token: initialSession.refresh_token,
            expires_at: initialSession.expires_at,
            user: {
              id: initialSession.user.id,
              email: initialSession.user.email || '',
              role: initialSession.user.user_metadata?.role || 'customer'
            }
          };
          
          setSession(customSession);
          
          // Process and set user data
          const userData: User = {
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            firstName: initialSession.user.user_metadata?.first_name || '',
            lastName: initialSession.user.user_metadata?.last_name || '',
            role: initialSession.user.user_metadata?.role || 'customer',
            emailVerified: initialSession.user.email_confirmed_at ? true : false,
            isActive: true,
            createdAt: new Date(initialSession.user.created_at)
          };
          
          setUser(userData);
          setUserRole(userData.role);
          
          // Fetch complete profile data
          await fetchUserProfile(initialSession.user.id, userData.role);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Clean up the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile information
  const fetchUserProfile = async (userId: string, role: UserRole) => {
    try {
      // First try to load the profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        setLoading(false);
        return;
      }

      // Update user with profile data
      setUser(prevUser => {
        if (!prevUser) return null;
        
        return {
          ...prevUser,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          phoneNumber: profileData.phone_number || '',
          avatarUrl: profileData.avatar_url || '',
          address: profileData.address || '',
          city: profileData.city || '',
          country: profileData.country || '',
          isActive: profileData.active || true,
          emailVerified: profileData.email_verified || false,
          loyaltyPoints: profileData.loyalty_points || 0
        };
      });

      // Based on role, fetch additional data and create specialized profile
      switch (role) {
        case 'customer': {
          try {
            const { data: customerData, error: customerError } = await supabase
              .from('customers')
              .select('*')
              .eq('id', userId)
              .maybeSingle();
            
            if (customerError && customerError.code !== 'PGRST116') {
              console.error('Error fetching customer data:', customerError);
            }
            
            // Default notification preferences structure
            const notificationPreferences = customerData?.notification_preferences || { 
              email: true, 
              sms: false, 
              push: true 
            };
            
            const customerProfile: Customer = {
              id: userId,
              email: profileData.email || '',
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              phoneNumber: profileData.phone_number || '',
              avatarUrl: profileData.avatar_url || '',
              emailVerified: profileData.email_verified || false,
              address: profileData.address || '',
              city: profileData.city || '',
              country: profileData.country || '',
              role: 'customer',
              isActive: profileData.active || true,
              createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
              updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : new Date(),
              loyaltyPoints: profileData.loyalty_points || 0,
              preferredCategories: customerData?.preferred_categories || [],
              savedServices: customerData?.saved_services || [],
              notificationPreferences
            };
            
            setUserProfile(customerProfile);
          } catch (error) {
            console.error('Error processing customer data:', error);
          }
          break;
        }

        case 'provider': {
          try {
            const { data: providerData, error: providerError } = await supabase
              .from('service_providers')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (providerError) {
              console.error('Error fetching provider data:', providerError);
            }
            
            const providerVerificationStatus: ProviderVerificationStatus = 
              (providerData?.verification_status as ProviderVerificationStatus) || 'pending';
            
            const providerSubscriptionTier: SubscriptionTier = 
              (providerData?.subscription_tier as SubscriptionTier) || 'free';
            
            const providerProfile: Provider = {
              id: userId,
              email: profileData.email || '',
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              phoneNumber: profileData.phone_number || '',
              avatarUrl: profileData.avatar_url || '',
              emailVerified: profileData.email_verified || false,
              address: profileData.address || '',
              city: profileData.city || '',
              country: profileData.country || '',
              role: 'provider',
              isActive: providerData?.is_active ?? true,
              createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
              updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : new Date(),
              businessName: providerData?.business_name || '',
              businessDescription: providerData?.business_description || '',
              website: providerData?.website || '',
              verificationStatus: providerVerificationStatus,
              subscriptionTier: providerSubscriptionTier,
              commissionRate: providerData?.commission_rate || 10,
              completedBookings: providerData?.completed_bookings || 0,
              rating: providerData?.rating || 0,
              ratingCount: providerData?.rating_count || 0,
              servicesCount: providerData?.services_count || 0,
              bannerUrl: providerData?.banner_url || ''
            };
            
            setUserProfile(providerProfile);
          } catch (error) {
            console.error('Error processing provider data:', error);
          }
          break;
        }

        case 'admin': {
          try {
            const { data: adminData, error: adminError } = await supabase
              .from('admin_permissions')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
            
            if (adminError && adminError.code !== 'PGRST116') {
              console.error('Error fetching admin data:', adminError);
            }
            
            const adminProfile: Admin = {
              id: userId,
              email: profileData.email || '',
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              phoneNumber: profileData.phone_number || '',
              avatarUrl: profileData.avatar_url || '',
              emailVerified: true,
              address: profileData.address || '',
              city: profileData.city || '',
              country: profileData.country || '',
              role: 'admin',
              isActive: true,
              createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
              updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : new Date(),
              permissions: adminData?.permissions || [],
              accessLevel: 'standard',
              isSuperAdmin: false,
              isVerified: true
            };
            
            setUserProfile(adminProfile);
          } catch (error) {
            console.error('Error processing admin data:', error);
          }
          break;
        }

        default:
          console.warn(`Unknown user role: ${role}`);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error('Sign in failed', {
          description: error.message
        });
        return { error };
      }
      
      toast.success('Signed in successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      toast.error('Sign in failed', {
        description: error.message || 'An unexpected error occurred'
      });
      return { error };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'customer'
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast.error('Sign up failed', {
          description: error.message
        });
        return { error };
      }
      
      // If successful, create profile entry
      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone_number: userData.phoneNumber,
            role: userData.role || 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('Profile creation failed', {
            description: 'Account was created but profile setup failed.'
          });
        }
        
        // Create role-specific entry
        if (userData.role === 'customer') {
          const { error: customerError } = await supabase
            .from('customers')
            .insert({
              id: data.user.id,
              notification_preferences: {
                email: true,
                sms: false,
                push: true
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (customerError) {
            console.error('Customer data creation error:', customerError);
          }
        } else if (userData.role === 'provider') {
          const { error: providerError } = await supabase
            .from('service_providers')
            .insert({
              id: data.user.id,
              email: email,
              business_name: userData.businessName || '',
              business_description: userData.businessDescription || '',
              verification_status: 'pending',
              subscription_tier: 'free',
              commission_rate: 10,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_active: true
            });
          
          if (providerError) {
            console.error('Provider data creation error:', providerError);
          }
        }
      }
      
      toast.success('Account created successfully!', {
        description: 'Check your email to confirm your account.'
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected sign up error:', error);
      toast.error('Sign up failed', {
        description: error.message || 'An unexpected error occurred'
      });
      return { error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Sign out failed', {
          description: error.message
        });
        return;
      }
      
      // Clear auth state
      setUser(null);
      setSession(null);
      setUserRole(null);
      setUserProfile(null);
      
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Unexpected sign out error:', error);
      toast.error('Sign out failed', {
        description: error.message || 'An unexpected error occurred'
      });
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<Customer | Provider | Admin>): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Prepare data for profiles table (snake_case)
      const profileData: Record<string, any> = {};
      
      if ('firstName' in data && data.firstName !== undefined) profileData.first_name = data.firstName;
      if ('lastName' in data && data.lastName !== undefined) profileData.last_name = data.lastName;
      if ('phoneNumber' in data && data.phoneNumber !== undefined) profileData.phone_number = data.phoneNumber;
      if ('avatarUrl' in data && data.avatarUrl !== undefined) profileData.avatar_url = data.avatarUrl;
      if ('address' in data && data.address !== undefined) profileData.address = data.address;
      if ('city' in data && data.city !== undefined) profileData.city = data.city;
      if ('country' in data && data.country !== undefined) profileData.country = data.country;
      if ('isActive' in data && data.isActive !== undefined) profileData.active = data.isActive;
      if ('loyaltyPoints' in data && data.loyaltyPoints !== undefined) profileData.loyalty_points = data.loyaltyPoints;
      if ('preferredLanguage' in data && data.preferredLanguage !== undefined) profileData.preferred_language = data.preferredLanguage;
      if ('email' in data && data.email !== undefined) profileData.email = data.email;
      if ('emailVerified' in data && data.emailVerified !== undefined) profileData.email_verified = data.emailVerified;
      if ('role' in data && data.role !== undefined) profileData.role = data.role;
      
      profileData.updated_at = new Date().toISOString();
      
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Profile update error:', profileError);
        toast.error('Profile update failed');
        return false;
      }
      
      // Role-specific updates
      if (userRole === 'customer' && ('preferredCategories' in data || 'savedServices' in data || 'notificationPreferences' in data)) {
        const customerData: Record<string, any> = {};
        
        if ('preferredCategories' in data && data.preferredCategories !== undefined) 
          customerData.preferred_categories = data.preferredCategories;
          
        if ('savedServices' in data && data.savedServices !== undefined) 
          customerData.saved_services = data.savedServices;
          
        if ('notificationPreferences' in data && data.notificationPreferences !== undefined) 
          customerData.notification_preferences = data.notificationPreferences;
          
        customerData.updated_at = new Date().toISOString();
        
        const { error: customerError } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', user.id);
        
        if (customerError) {
          console.error('Customer update error:', customerError);
          toast.error('Customer preference update failed');
          return false;
        }
      } else if (userRole === 'provider') {
        const providerData: Record<string, any> = {};
        
        if ('businessName' in data && data.businessName !== undefined) 
          providerData.business_name = data.businessName;
          
        if ('businessDescription' in data && data.businessDescription !== undefined) 
          providerData.business_description = data.businessDescription;
          
        if ('website' in data && data.website !== undefined) 
          providerData.website = data.website;
          
        if ('bannerUrl' in data && data.bannerUrl !== undefined) 
          providerData.banner_url = data.bannerUrl;
          
        if (Object.keys(providerData).length > 0) {
          providerData.updated_at = new Date().toISOString();
          
          const { error: providerError } = await supabase
            .from('service_providers')
            .update(providerData)
            .eq('id', user.id);
          
          if (providerError) {
            console.error('Provider update error:', providerError);
            toast.error('Provider profile update failed');
            return false;
          }
        }
      }
      
      // Update local state
      setUser(prev => {
        if (!prev) return null;
        
        const updatedUser = { ...prev };
        
        if ('firstName' in data && data.firstName !== undefined) updatedUser.firstName = data.firstName;
        if ('lastName' in data && data.lastName !== undefined) updatedUser.lastName = data.lastName;
        if ('phoneNumber' in data && data.phoneNumber !== undefined) updatedUser.phoneNumber = data.phoneNumber;
        if ('avatarUrl' in data && data.avatarUrl !== undefined) updatedUser.avatarUrl = data.avatarUrl;
        if ('address' in data && data.address !== undefined) updatedUser.address = data.address;
        if ('city' in data && data.city !== undefined) updatedUser.city = data.city;
        if ('country' in data && data.country !== undefined) updatedUser.country = data.country;
        if ('isActive' in data && data.isActive !== undefined) updatedUser.isActive = data.isActive;
        if ('email' in data && data.email !== undefined) updatedUser.email = data.email;
        if ('emailVerified' in data && data.emailVerified !== undefined) updatedUser.emailVerified = data.emailVerified;
        if ('loyaltyPoints' in data && data.loyaltyPoints !== undefined) updatedUser.loyaltyPoints = data.loyaltyPoints;
        
        return updatedUser;
      });
      
      setUserProfile(prev => {
        if (!prev) return null;
        
        const updatedProfile = { ...prev };
        
        // Update base User properties
        Object.keys(data).forEach(key => {
          if (key in updatedProfile && data[key as keyof typeof data] !== undefined) {
            (updatedProfile as any)[key] = data[key as keyof typeof data];
          }
        });
        
        if (userRole === 'customer' && updatedProfile.role === 'customer') {
          if ('preferredCategories' in data && data.preferredCategories !== undefined)
            (updatedProfile as Customer).preferredCategories = data.preferredCategories;
            
          if ('savedServices' in data && data.savedServices !== undefined)
            (updatedProfile as Customer).savedServices = data.savedServices;
            
          if ('notificationPreferences' in data && data.notificationPreferences !== undefined)
            (updatedProfile as Customer).notificationPreferences = data.notificationPreferences;
        }
        else if (userRole === 'provider' && updatedProfile.role === 'provider') {
          if ('businessName' in data && data.businessName !== undefined)
            (updatedProfile as Provider).businessName = data.businessName;
            
          if ('businessDescription' in data && data.businessDescription !== undefined)
            (updatedProfile as Provider).businessDescription = data.businessDescription;
            
          if ('website' in data && data.website !== undefined)
            (updatedProfile as Provider).website = data.website;
            
          if ('bannerUrl' in data && data.bannerUrl !== undefined)
            (updatedProfile as Provider).bannerUrl = data.bannerUrl;
        }
        
        return updatedProfile;
      });
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Profile update failed', {
        description: error.message || 'An unexpected error occurred'
      });
      return false;
    }
  };

  // Create auth context value
  const authContextValue: AuthContextType = {
    user,
    session,
    userRole,
    userProfile,
    loading,
    isLoading: loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated
  };

  // Return provider with value
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
