
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Session as CustomSession, User, UserRole, Provider, Customer, Admin } from '@/types/auth';

export function useAuthSync() {
  const { setUser, setSession, setUserRole, setUserProfile, setLoading } = useAuthStore();

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');

      if (session) {
        const customSession: CustomSession = {
          id: session.id,
          user_id: session.user.id,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at.toString(),
          user: {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role as UserRole || 'customer'
          },
          created_at: new Date().toISOString()
        };

        setSession(customSession);
        // Get role from user metadata or default to customer
        const userRole = session.user.user_metadata?.role as UserRole || 'customer';
        console.log('Setting user role from metadata:', userRole);

        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: userRole,
          firstName: session.user.user_metadata?.first_name || '',
          lastName: session.user.user_metadata?.last_name || '',
          isActive: true,
          createdAt: new Date(session.user.created_at),
        };
        setUser(user);
        setUserRole(userRole);

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
      }
    });

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Session exists' : 'No session');

      if (session) {
        const customSession: CustomSession = {
          id: session.id,
          user_id: session.user.id,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at.toString(),
          user: {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role as UserRole || 'customer'
          },
          created_at: new Date().toISOString()
        };

        setSession(customSession);
        // Get role from user metadata or default to customer
        const userRole = session.user.user_metadata?.role as UserRole || 'customer';
        console.log('Setting user role from metadata:', userRole);

        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: userRole,
          firstName: session.user.user_metadata?.first_name || '',
          lastName: session.user.user_metadata?.last_name || '',
          isActive: true,
          createdAt: new Date(session.user.created_at),
        };
        setUser(user);
        setUserRole(userRole);

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

  async function fetchUserProfile(supabaseUser: any) {
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

      setUser((prev) => {
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

          // Default notification preferences if DB returns JSON null or undefined
          const notificationPreferences = customerData?.notification_preferences || { email: true, sms: false, push: true };

          const customer: Customer = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatarUrl: profileData.avatar_url || '',
            role: 'customer',
            isActive: true,
            createdAt: new Date(profileData.created_at),
            loyaltyPoints: profileData.loyalty_points || 0,
            preferredCategories: customerData?.preferred_categories || [],
            notificationPreferences: notificationPreferences,
            savedServices: customerData?.saved_services || []
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

          // Use safe defaults for both cases: either we have data or we don't
          const provider: Provider = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            phoneNumber: profileData.phone_number || '',
            avatarUrl: profileData.avatar_url || '',
            role: 'provider',
            isActive: providerData?.is_active ?? true,
            businessName: providerData?.business_name || '',
            businessDescription: providerData?.business_description || '',
            verificationStatus: providerData?.verification_status as any || 'pending',
            rating: providerData?.rating || 0,
            reviewCount: providerData?.rating_count || 0,
            categories: [],
            services: [],
            commission: providerData?.commission_rate || 0,
            createdAt: new Date(profileData.created_at),
            isVerified: profileData.email_verified || false,
            subscriptionTier: providerData?.subscription_tier || 'free'
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
            avatarUrl: profileData.avatar_url || '',
            role: 'admin',
            isActive: true,
            permissions: adminData?.permissions || [],
            createdAt: new Date(profileData.created_at),
            isVerified: true,
            adminLevel: 1
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
}
