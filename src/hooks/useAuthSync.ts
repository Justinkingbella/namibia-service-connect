
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { User, UserRole, Provider, Customer, Admin, ProviderVerificationStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

export const useAuthSync = () => {
  const { 
    setUser, 
    setUserProfile, 
    setSession, 
    setIsLoading,
    setIsAuthenticated
  } = useAuthStore();
  
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Initial session check");
        
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }

        if (sessionData?.session) {
          console.log("Session exists");
          // Create a custom session object that matches our Session type
          const customSession = {
            id: sessionData.session.user.id,
            user_id: sessionData.session.user.id,
            expires_in: sessionData.session.expires_in || 0,
            token_type: sessionData.session.token_type || 'bearer',
            created_at: new Date().toISOString(),
            expires_at: sessionData.session.expires_at?.toString() || '',
            access_token: sessionData.session.access_token,
            refresh_token: sessionData.session.refresh_token || '',
            user: {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email || '',
              role: (sessionData.session.user.user_metadata?.role as UserRole) || 'customer'
            }
          };
          setSession(customSession);
          
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

          // Get user role from metadata
          if (sessionData.session.user.user_metadata) {
            userData.role = sessionData.session.user.user_metadata.role || 'customer';
            console.log("Setting user role from metadata:", userData.role);
          }

          // Fetch user profile from 'profiles' table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.id)
            .single();

          if (profileError) {
            console.info('Profile not found, user may need to complete registration');
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
            // Join customers table with profiles
            const { data: customerData, error: customerError } = await supabase
              .from('customers')
              .select('*, profiles:id(*)')
              .eq('id', userData.id)
              .single();

            if (!customerError && customerData) {
              // Since we can't access profile data directly through the join due to TypeScript errors,
              // we'll use the userData which we already populated from profiles table
              
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
              navigate('/customer/dashboard', { replace: true });
            }
          } else if (userData.role === 'provider') {
            // Join service_providers with profiles
            const { data: providerData, error: providerError } = await supabase
              .from('service_providers')
              .select('*')
              .eq('id', userData.id)
              .single();

            if (!providerError && providerData) {
              // Cast to ProviderVerificationStatus to ensure type safety
              const verificationStatus = providerData.verification_status as ProviderVerificationStatus || 'unverified';
              
              const providerProfile: Provider = {
                ...userData,
                businessName: providerData.business_name || '',
                businessDescription: providerData.business_description || '',
                categories: providerData.categories || [],
                services: providerData.services || [],
                rating: providerData.rating || 0,
                commission: providerData.commission_rate || 0,
                verificationStatus: verificationStatus,
                bannerUrl: providerData.banner_url || '',
                website: providerData.website || '',
                taxId: providerData.tax_id || '',
                reviewCount: providerData.review_count || 0,
                subscriptionTier: providerData.subscription_tier || 'free',
                isVerified: verificationStatus === 'verified',
              };
              
              setUserProfile(providerProfile);
              console.log("Redirecting to provider dashboard");
              navigate('/provider/dashboard', { replace: true });
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
              navigate('/admin/dashboard', { replace: true });
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
        const customSession = {
          id: session.user?.id || '',
          user_id: session.user?.id || '',
          expires_in: session.expires_in || 0,
          token_type: session.token_type || 'bearer',
          created_at: new Date().toISOString(),
          expires_at: session.expires_at?.toString() || '',
          access_token: session.access_token,
          refresh_token: session.refresh_token || '',
          user: {
            id: session.user?.id || '',
            email: session.user?.email || '',
            role: ((session.user?.user_metadata?.role as UserRole) || 'customer')
          }
        };
        
        setSession(customSession);
        const userMeta = session.user?.user_metadata || {};
        const userRole = userMeta.role || 'customer';
        console.log("Setting user role from metadata:", userRole);
        
        const user: User = {
          id: session.user?.id || '',
          email: session.user?.email || '',
          firstName: userMeta.first_name || '',
          lastName: userMeta.last_name || '',
          role: userRole as UserRole,
          phoneNumber: session.user?.phone || '',
          createdAt: session.user?.created_at || '',
          emailVerified: false,
        };
        
        setUser(user);
        setIsAuthenticated(true);
        
        // Redirect will happen in initAuth which reruns on session change
        
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        navigate('/auth/sign-in', { replace: true });
      }
    });

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, setUserProfile, setSession, setIsLoading, setIsAuthenticated, navigate]);
};
