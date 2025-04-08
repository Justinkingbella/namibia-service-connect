import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  UserRole, 
  Customer, 
  Provider, 
  Admin, 
  Session, 
  DbUserProfile,
  DbCustomerProfile,
  DbProviderProfile,
  AuthContextType,
  ProviderVerificationStatus
} from '@/types';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Customer | Provider | Admin | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setSession(session);
          setIsAuthenticated(true);

          const userDetails: User = {
            id: session.user.id,
            email: session.user.email as string,
            firstName: '',
            lastName: '',
            role: 'customer' as UserRole,
            phoneNumber: session.user.phone || '',
            createdAt: session.user.created_at || '',
            emailVerified: false,
          };

          if (session.user.user_metadata) {
            userDetails.role = session.user.user_metadata.role || 'customer';
            setUserRole(userDetails.role);
          }

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userDetails.id)
            .single();

          if (profileError) {
            console.info('Profile not found, user may need to complete registration');
          } else if (profileData) {
            userDetails.firstName = profileData.first_name || '';
            userDetails.lastName = profileData.last_name || '';
            userDetails.role = profileData.role as UserRole || 'customer';
            userDetails.phoneNumber = profileData.phone_number || '';
            userDetails.avatarUrl = profileData.avatar_url || '';
            userDetails.emailVerified = profileData.email_verified || false;
          }

          setUser(userDetails);

          switch (userDetails.role) {
            case 'customer':
              await loadCustomerProfile(userDetails.id);
              navigate('/customer/dashboard', { replace: true });
              break;
            case 'provider':
              await loadProviderProfile(userDetails.id);
              navigate('/provider/dashboard', { replace: true });
              break;
            case 'admin':
              await loadAdminProfile(userDetails.id);
              navigate('/admin/dashboard', { replace: true });
              break;
            default:
              console.warn('Unknown role:', userDetails.role);
              setUserProfile(null);
              break;
          }
        } else {
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
        setIsAuthenticated(false);
        navigate('/auth/sign-in', { replace: true });
      } else if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setIsAuthenticated(true);
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
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session);
      setIsAuthenticated(true);
      return { error: null };
    } catch (error: any) {
      console.error('Sign In Error:', error.message);
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
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
        console.error('Sign Up Error:', error.message);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
        return { error, data: null };
      }

      // Create a user profile in the "profiles" table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user?.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'customer',
            email_verified: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        console.error('Profile Creation Error:', profileError.message);
        toast({
          title: "Profile Creation Failed",
          description: profileError.message,
          variant: "destructive"
        });
        return { error: profileError, data: null };
      }

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });

      return { error: null, data };
    } catch (error: any) {
      console.error('Sign Up Error:', error.message);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
      setIsAuthenticated(false);
      navigate('/auth/sign-in', { replace: true });
    } catch (error: any) {
      console.error('Sign Out Error:', error.message);
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          avatar_url: data.avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...data });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      return true;
    } catch (error: any) {
      console.error('Update Profile Error:', error.message);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      if (!user) throw new Error('No user logged in');

      const filePath = `avatars/${user.id}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.Key}`;
      await updateProfile({ avatarUrl: publicUrl });
      return publicUrl;
    } catch (error: any) {
      console.error('Upload Avatar Error:', error.message);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast({
        title: "Reset Email Sent",
        description: "Please check your email to reset your password.",
      });
    } catch (error: any) {
      console.error('Reset Password Error:', error.message);
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Update Password Error:', error.message);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        type: 'email',
        token,
        email: user?.email || '',
      });
      if (error) throw error;
      setUser({ ...user, emailVerified: true } as User);
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully.",
      });
    } catch (error: any) {
      console.error('Verify Email Error:', error.message);
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'email',
        email: user?.email || '',
      });
      if (error) throw error;
      toast({
        title: "Verification Email Sent",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error('Resend Verification Email Error:', error.message);
      toast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadCustomerProfile = async (userId: string) => {
    try {
      const { data: customerData, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching customer profile:', error);
        return;
      }

      if (!customerData) return;

      const customerProfile: Customer = {
        id: userId,
        email: customerData.email || '',
        firstName: customerData.first_name || '',
        lastName: customerData.last_name || '',
        role: 'customer',
        phoneNumber: customerData.phone_number || '',
        avatarUrl: customerData.avatar_url || '',
        emailVerified: customerData.email_verified || false,
        preferredCategories: customerData.preferred_categories || [],
        savedServices: customerData.saved_services || [],
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
        },
      };
      setUserProfile(customerProfile);
    } catch (error) {
      console.error('Error in loadCustomerProfile:', error);
    }
  };

  const loadProviderProfile = async (userId: string) => {
    try {
      const { data: providerData, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching provider profile:', error);
        return null;
      }

      if (!providerData) return null;

      // Cast to ProviderVerificationStatus to ensure type safety
      const verificationStatus = (providerData.verification_status as ProviderVerificationStatus) || 'unverified';

      // Create provider profile with safe defaults for missing fields
      const providerProfile: Provider = {
        id: userId,
        email: providerData.email || '',
        firstName: providerData.first_name || '',
        lastName: providerData.last_name || '',
        role: 'provider',
        phoneNumber: providerData.phone_number || '',
        avatarUrl: providerData.avatar_url || '',
        emailVerified: providerData.email_verified || false,
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
        isVerified: verificationStatus === 'verified',
      };

      return providerProfile;
    } catch (error) {
      console.error('Error in loadProviderProfile:', error);
      return null;
    }
  };

  const loadAdminProfile = async (userId: string) => {
    try {
      const { data: adminData, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching admin profile:', error);
        return;
      }

      if (!adminData) return;

      const adminProfile: Admin = {
        id: userId,
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        role: 'admin',
        phoneNumber: user?.phoneNumber || '',
        avatarUrl: user?.avatarUrl || '',
        emailVerified: user?.emailVerified || false,
        permissions: adminData.permissions || [],
        adminLevel: 1,
        isVerified: true,
        accessLevel: 1,
      };
      setUserProfile(adminProfile);
    } catch (error) {
      console.error('Error in loadAdminProfile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    userRole,
    isLoading,
    isAuthenticated,
    session,
    signIn,
    signUp,
    signOut,
    updateProfile,
    setUserProfile,
    uploadAvatar,
    resetPassword,
    updatePassword,
    verifyEmail,
    sendVerificationEmail,
    checkAuth: useCallback(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userDetails: User = {
          id: session.user.id,
          email: session.user.email as string,
          firstName: '',
          lastName: '',
          role: 'customer' as UserRole,
          phoneNumber: session.user.phone || '',
          createdAt: session.user.created_at || '',
          emailVerified: false,
        };
        return userDetails;
      }
      return null;
    }, []),
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
