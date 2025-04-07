
import { create } from 'zustand';
import { User, Customer, Provider, Admin, UserRole } from '@/types';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  userProfile: Customer | Provider | Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;

  setUser: (user: User | null) => void;
  setUserProfile: (profile: Customer | Provider | Admin | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setSession: (session: Session | null) => void;
  signIn: (email: string, password: string) => Promise<{error: any | null, data?: any}>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{error: any | null, data?: any | null}>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  session: null,

  setUser: (user) => set({ user }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setSession: (session) => set({ session }),
  
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    }
  },
  
  signUp: async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'customer',
          },
        },
      });

      if (error) {
        return { error, data: null };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error, data: null };
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({
        user: null,
        userProfile: null,
        isAuthenticated: false,
        session: null
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}));

// Add hooks for selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useUserProfile = () => useAuthStore((state) => state.userProfile);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useSession = () => useAuthStore((state) => state.session);

// Get user role
export const useUserRole = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role;
};
