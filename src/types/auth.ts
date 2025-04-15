
import { User, UserRole, Customer, Provider, Admin } from './index';
import { Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  userProfile: Customer | Provider | Admin | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  
  signIn: (email: string, password: string) => Promise<{error: any | null, data?: any}>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{error: any | null, data?: any | null}>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  setUserProfile: (profile: Customer | Provider | Admin | null) => void;
  uploadAvatar: (file: File) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  
  // Add navigation function
  navigate: (path: string, options?: { replace?: boolean }) => void;
}
