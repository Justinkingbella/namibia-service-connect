
import { create } from 'zustand';
import { User, Customer, Provider, Admin } from '@/types';
import { Session } from '@supabase/supabase-js';

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
  signIn: (email: string, password: string) => Promise<{error: any | null}>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{error: any | null, data: any | null}>;
}

export const useAuthStore = create<AuthState>((set) => ({
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
    // This will be implemented in auth pages
    return { error: null };
  },
  signUp: async (email, password, userData) => {
    // This will be implemented in auth pages
    return { error: null, data: null };
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
