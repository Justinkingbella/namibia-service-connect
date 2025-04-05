
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Customer, Provider, Admin, UserRole, Session } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  userProfile: Customer | Provider | Admin | null;
  session: Session | null;
  userRole: UserRole | null;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setUserProfile: (profile: Customer | Provider | Admin | null) => void;
  setSession: (session: Session | null) => void;
  setUserRole: (role: UserRole | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuthState: () => void;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userProfile: null,
      session: null,
      userRole: null,
      isLoading: true,
      
      setUser: (user) => set({ user }),
      setUserProfile: (userProfile) => set({ userProfile }),
      setSession: (session) => set({ session }),
      setUserRole: (role) => set({ userRole: role }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuthState: () => set({ 
        user: null, 
        userProfile: null, 
        session: null, 
        userRole: null
      }),
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      // Selective persistence to avoid storing sensitive information
      partialize: (state) => ({
        userRole: state.userRole,
      }),
    }
  )
);
