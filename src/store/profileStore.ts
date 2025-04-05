
import { create } from 'zustand';
import { DbUserProfile, DbProviderProfile, DbCustomerProfile, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transformKeysToCamel, transformKeysToSnake } from '@/lib/utils';

interface ProfileState {
  userProfile: DbUserProfile | null;
  providerProfile: DbProviderProfile | null;
  customerProfile: DbCustomerProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserProfile: (userId: string) => Promise<void>;
  fetchProviderProfile: (userId: string) => Promise<void>;
  fetchCustomerProfile: (userId: string) => Promise<void>;
  updateUserProfile: (userId: string, data: Partial<DbUserProfile>) => Promise<boolean>;
  updateProviderProfile: (userId: string, data: Partial<DbProviderProfile>) => Promise<boolean>;
  updateCustomerProfile: (userId: string, data: Partial<DbCustomerProfile>) => Promise<boolean>;
  createUserProfiles: (userId: string, userRole: UserRole, profileData: any) => Promise<boolean>;
  clearProfileState: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  userProfile: null,
  providerProfile: null,
  customerProfile: null,
  isLoading: false,
  error: null,
  
  fetchUserProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      // Transform snake_case to camelCase
      const transformedProfile = transformKeysToCamel(data) as DbUserProfile;
      
      set({ userProfile: transformedProfile, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchProviderProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      // Transform snake_case to camelCase
      const transformedProfile = transformKeysToCamel(data) as DbProviderProfile;
      
      set({ providerProfile: transformedProfile, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching provider profile:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchCustomerProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      // Transform snake_case to camelCase
      const transformedProfile = transformKeysToCamel(data) as DbCustomerProfile;
      
      set({ customerProfile: transformedProfile, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching customer profile:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  updateUserProfile: async (userId: string, profileData: Partial<DbUserProfile>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert camelCase to snake_case for database
      const dataToUpdate = transformKeysToSnake(profileData);
      
      // Add updated_at timestamp
      dataToUpdate.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      set(state => ({
        userProfile: state.userProfile ? { ...state.userProfile, ...profileData } : null,
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  updateProviderProfile: async (userId: string, profileData: Partial<DbProviderProfile>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert camelCase to snake_case for database
      const dataToUpdate = transformKeysToSnake(profileData);
      
      // Add updated_at timestamp
      dataToUpdate.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('service_providers')
        .update(dataToUpdate)
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      set(state => ({
        providerProfile: state.providerProfile ? { ...state.providerProfile, ...profileData } : null,
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error updating provider profile:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  updateCustomerProfile: async (userId: string, profileData: Partial<DbCustomerProfile>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert camelCase to snake_case for database
      const dataToUpdate = transformKeysToSnake(profileData);
      
      // Add updated_at timestamp
      dataToUpdate.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('customers')
        .update(dataToUpdate)
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      set(state => ({
        customerProfile: state.customerProfile ? { ...state.customerProfile, ...profileData } : null,
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error updating customer profile:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  createUserProfiles: async (userId: string, userRole: UserRole, profileData: any) => {
    try {
      set({ isLoading: true, error: null });
      
      // First create the basic user profile
      const userProfileData = {
        id: userId,
        first_name: profileData.firstName || '',
        last_name: profileData.lastName || '',
        email: profileData.email,
        phone_number: profileData.phoneNumber || '',
        role: userRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(userProfileData);
      
      if (profileError) throw profileError;
      
      // Create role-specific records
      if (userRole === 'provider') {
        const providerData = {
          id: userId,
          business_name: profileData.businessName || `${profileData.firstName}'s Business`,
          business_description: profileData.businessDescription || '',
          verification_status: 'pending',
          subscription_tier: 'free',
          email: profileData.email,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: providerError } = await supabase
          .from('service_providers')
          .insert(providerData);
        
        if (providerError) throw providerError;
        
        // Update local state with provider profile
        set({
          providerProfile: transformKeysToCamel(providerData) as DbProviderProfile
        });
      } else if (userRole === 'customer') {
        const customerData = {
          id: userId,
          saved_services: [],
          preferred_categories: [],
          notification_preferences: { email: true, sms: false, push: true },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: customerError } = await supabase
          .from('customers')
          .insert(customerData);
        
        if (customerError) throw customerError;
        
        // Update local state with customer profile
        set({
          customerProfile: transformKeysToCamel(customerData) as DbCustomerProfile
        });
      }
      
      // Update local state with user profile
      set({
        userProfile: transformKeysToCamel(userProfileData) as DbUserProfile,
        isLoading: false
      });
      
      return true;
    } catch (error: any) {
      console.error('Error creating user profiles:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  clearProfileState: () => {
    set({ 
      userProfile: null,
      providerProfile: null,
      customerProfile: null,
      isLoading: false,
      error: null
    });
  },
  
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error })
}));
