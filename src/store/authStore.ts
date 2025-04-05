
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session, UserRole, Customer, Provider, Admin } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userProfile: Customer | Provider | Admin | null;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserRole: (role: UserRole | null) => void;
  setUserProfile: (profile: Customer | Provider | Admin | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, role: UserRole, userData: Partial<Customer | Provider>) => 
    Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any | null }>;
  resetPassword: (password: string) => Promise<{ error: any | null }>;
  updateProfile: (data: Partial<Customer | Provider | Admin>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      userRole: null,
      userProfile: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setUserRole: (role) => set({ userRole: role }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setLoading: (loading) => set({ isLoading: loading }),

      signIn: async (email, password) => {
        try {
          console.info('Attempting login with credentials:', email);
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          
          if (!error) {
            console.info('Sign in successful');
            const customSession: Session = {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_at: data.session.expires_at,
              user: {
                id: data.user.id,
                email: data.user.email || '',
                role: data.user.user_metadata?.role as UserRole || 'customer'
              }
            };
            
            set({ session: customSession });
            
            // User data will be fetched by the session listener
          }
          
          return { error };
        } catch (error) {
          console.error('Error in signIn:', error);
          return { error };
        }
      },

      signUp: async (email, password, role, userData) => {
        try {
          console.log('Signing up user with role:', role, 'and data:', userData);

          // 1. Create auth user with role in metadata
          const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              data: {
                role,
                first_name: userData.firstName || '',
                last_name: userData.lastName || '',
                business_name: role === 'provider' && 'businessName' in userData ? userData.businessName : ''
              }
            }
          });

          if (error) {
            console.error('Error creating user:', error);
            return { error, data: null };
          }

          if (!data.user) {
            console.error('No user returned from signup');
            return { error: new Error('No user returned from signup'), data: null };
          }

          console.log('User created successfully:', data.user.id);

          // 2. Create profile record
          const profileData = {
            id: data.user.id,
            email,
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
            phone_number: 'phoneNumber' in userData ? userData.phoneNumber : '',
            role, // Make sure role is saved in profiles table
            created_at: new Date().toISOString()
          };

          console.log('Creating profile with data:', profileData);

          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData);

          if (profileError) {
            console.error('Error creating profile:', profileError);
            return { error: profileError, data: null };
          }

          console.log('Profile created successfully');

          // 3. Create role-specific records based on the specified role
          if (role === 'provider') {
            await createProviderProfile(data.user.id, userData, email);
          } else if (role === 'customer') {
            await createCustomerProfile(data.user.id);
          }

          return { error: null, data };
        } catch (error) {
          console.error('Error in signUp:', error);
          return { error, data: null };
        }
      },

      signOut: async () => {
        console.log('Signing out user');
        try {
          await supabase.auth.signOut();
          console.log('User signed out successfully');

          // Clear all state explicitly
          set({ 
            user: null,
            session: null,
            userRole: null,
            userProfile: null 
          });

        } catch (error) {
          console.error('Error signing out:', error);
          throw error;
        }
      },

      forgotPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });
          return { error };
        } catch (error) {
          console.error('Error in forgotPassword:', error);
          return { error };
        }
      },

      resetPassword: async (password) => {
        try {
          const { error } = await supabase.auth.updateUser({ password });
          return { error };
        } catch (error) {
          console.error('Error in resetPassword:', error);
          return { error };
        }
      },

      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return false;
    
        try {
          const baseProfileData: any = {
            first_name: data.firstName,
            last_name: data.lastName,
            phone_number: data.phoneNumber,
            updated_at: new Date().toISOString()
          };
    
          if ('avatarUrl' in data && data.avatarUrl) {
            baseProfileData.avatar_url = data.avatarUrl;
          }
    
          const { error: profileError } = await supabase
            .from('profiles')
            .update(baseProfileData)
            .eq('id', user.id);
    
          if (profileError) {
            console.error('Error updating profile:', profileError);
            return false;
          }
    
          const { userRole, userProfile } = get();
          
          if (userRole === 'provider' && 'businessName' in data) {
            const providerData: any = {
              business_name: data.businessName,
              business_description: data.businessDescription,
              updated_at: new Date().toISOString()
            };
    
            if ('avatarUrl' in data && data.avatarUrl) {
              providerData.avatar_url = data.avatarUrl;
            }
    
            const { error: providerError } = await supabase
              .from('service_providers')
              .update(providerData)
              .eq('id', user.id);
    
            if (providerError) {
              console.error('Error updating provider record:', providerError);
              return false;
            }
          }
    
          if (userProfile) {
            if (userRole === 'provider' && userProfile.role === 'provider') {
              const providerProfile = userProfile as Provider;
              const updatedProfile: Provider = {
                ...providerProfile,
                firstName: data.firstName || providerProfile.firstName,
                lastName: data.lastName || providerProfile.lastName,
                phoneNumber: data.phoneNumber || providerProfile.phoneNumber,
                avatarUrl: ('avatarUrl' in data && data.avatarUrl) ? data.avatarUrl : providerProfile.avatarUrl,
                businessName: ('businessName' in data) ? (data.businessName || '') : providerProfile.businessName,
                businessDescription: ('businessDescription' in data) ? (data.businessDescription || '') : providerProfile.businessDescription,
              };
              set({ userProfile: updatedProfile });
            } else if (userRole === 'customer' && userProfile.role === 'customer') {
              const customerProfile = userProfile as Customer;
              const updatedProfile: Customer = {
                ...customerProfile,
                firstName: data.firstName || customerProfile.firstName,
                lastName: data.lastName || customerProfile.lastName,
                phoneNumber: data.phoneNumber || customerProfile.phoneNumber,
                avatarUrl: ('avatarUrl' in data && data.avatarUrl) ? data.avatarUrl : customerProfile.avatarUrl,
              };
              set({ userProfile: updatedProfile });
            } else if (userRole === 'admin' && userProfile.role === 'admin') {
              const adminProfile = userProfile as Admin;
              const updatedProfile: Admin = {
                ...adminProfile,
                firstName: data.firstName || adminProfile.firstName,
                lastName: data.lastName || adminProfile.lastName,
                phoneNumber: data.phoneNumber || adminProfile.phoneNumber,
                avatarUrl: ('avatarUrl' in data && data.avatarUrl) ? data.avatarUrl : adminProfile.avatarUrl,
              };
              set({ userProfile: updatedProfile });
            }
          }
    
          set(state => ({
            user: state.user ? {
              ...state.user,
              firstName: data.firstName || state.user.firstName,
              lastName: data.lastName || state.user.lastName,
              phoneNumber: data.phoneNumber || state.user.phoneNumber,
              avatarUrl: ('avatarUrl' in data && data.avatarUrl) ? data.avatarUrl : state.user.avatarUrl,
              name: `${data.firstName || state.user.firstName} ${data.lastName || state.user.lastName}`,
            } : null
          }));
    
          return true;
        } catch (error) {
          console.error('Error in updateProfile:', error);
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session
      })
    }
  )
);

// Helper functions for user onboarding
async function createProviderProfile(userId: string, userData: any, email: string) {
  // Create provider record
  const providerData = {
    id: userId,
    email: email,
    business_name: 'businessName' in userData ? userData.businessName || '' : `${userData.firstName}'s Business`,
    business_description: 'businessDescription' in userData ? userData.businessDescription || '' : '',
    verification_status: 'pending',
    subscription_tier: 'free',
    is_active: true,
    created_at: new Date().toISOString()
  };

  console.log('Creating provider record with data:', providerData);

  const { error: providerError } = await supabase
    .from('service_providers')
    .insert(providerData);

  if (providerError) {
    console.error('Error creating provider record:', providerError);
    throw providerError;
  }

  console.log('Provider record created successfully');
}

async function createCustomerProfile(userId: string) {
  // Create customer record
  const customerData = {
    id: userId,
    preferred_categories: [],
    notification_preferences: { email: true, sms: false, push: true },
    created_at: new Date().toISOString()
  };

  console.log('Creating customer record with data:', customerData);

  const { error: customerError } = await supabase
    .from('customers')
    .insert(customerData);

  if (customerError) {
    console.error('Error creating customer record:', customerError);
    throw customerError;
  }

  console.log('Customer record created successfully');
}
