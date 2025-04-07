
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { User, UserRole, Provider, Customer, Admin, SubscriptionTier } from '@/types';

export const useAuthSync = () => {
  const { 
    setUser, 
    setUserProfile, 
    setSession, 
    setIsLoading,
    setIsAuthenticated
  } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (sessionData?.session) {
          setSession(sessionData.session);
          
          // Get user data
          const userData: User = {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email as string,
            firstName: '',
            lastName: '',
            role: 'customer' as UserRole,
            phoneNumber: sessionData.session.user.phone || '',
            createdAt: sessionData.session.user.created_at || '',
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
          setIsAuthenticated(true);

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
                verificationStatus: providerData.verification_status as any || 'unverified',
                bannerUrl: providerData.banner_url || '',
                website: providerData.website || '',
                taxId: providerData.tax_id || '',
                reviewCount: providerData.review_count || 0,
                subscriptionTier: providerData.subscription_tier as any || 'free',
                isVerified: providerData.verification_status === 'verified',
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
                adminLevel: 1,
                isVerified: true,
                accessLevel: 1,
              };
              setUserProfile(adminProfile);
            }
          }
        } else {
          // No active session
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error syncing auth state:', error);
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up auth subscription for real-time updates
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        // Update auth state with new user data
        setSession(session);
        const user = session.user;
        
        setUser({
          id: user?.id || '',
          email: user?.email || '',
          firstName: '',
          lastName: '',
          role: 'customer' as UserRole,
          phoneNumber: user?.phone || '',
          createdAt: user?.created_at || '',
          emailVerified: false,
        });
        
        setIsAuthenticated(true);
        
        // Fetch additional user data...
        // This would replicate the data fetching logic from initAuth
        
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    });

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, setUserProfile, setSession, setIsLoading, setIsAuthenticated]);
};
