
import { supabase } from '@/integrations/supabase/client';
import { 
  DbCustomerProfile, 
  DbProviderProfile, 
  Customer, 
  Provider, 
  Admin, 
  DisputePriority, 
  Dispute 
} from '@/types';

/**
 * Fetch customer profile by ID
 */
export const fetchCustomerProfile = async (id: string): Promise<DbCustomerProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        id, 
        preferred_categories, 
        saved_services, 
        notification_preferences,
        created_at, 
        updated_at,
        profiles:id (
          id,
          email,
          first_name,
          last_name,
          phone_number,
          avatar_url,
          email_verified,
          role,
          is_active,
          created_at,
          updated_at,
          address,
          city,
          country
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching customer profile:', error);
      return null;
    }

    if (!data || !data.profiles) {
      return null;
    }

    // Create a properly merged DbCustomerProfile object
    const customerProfile: DbCustomerProfile = {
      ...data.profiles,
      preferred_categories: data.preferred_categories || [],
      saved_services: data.saved_services || []
    };

    return customerProfile;
  } catch (error) {
    console.error('Error in fetchCustomerProfile:', error);
    return null;
  }
};

/**
 * Fetch provider profile by ID
 */
export const fetchProviderProfile = async (id: string): Promise<DbProviderProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching provider data:', error);
      throw error;
    }
    
    return data as DbProviderProfile;
  } catch (error) {
    console.error('Error in fetchProviderProfile:', error);
    return null;
  }
};

/**
 * Fetch admin profile by ID
 */
export const fetchAdminProfile = async (id: string): Promise<Admin | null> => {
  try {
    // Use profiles table instead of admins
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching admin data:', error);
      throw error;
    }
    
    return data as unknown as Admin;
  } catch (error) {
    console.error('Error in fetchAdminProfile:', error);
    return null;
  }
};

/**
 * Create customer profile
 */
export const createCustomerProfile = async (profile: Partial<DbCustomerProfile>): Promise<DbCustomerProfile | null> => {
  try {
    // Extract customer-specific fields
    const { 
      preferred_categories,
      saved_services,
      notification_preferences,
      ...profileData
    } = profile;

    const customerData: any = {
      id: profileData.id,
      preferred_categories: preferred_categories || [],
      saved_services: saved_services || [],
      notification_preferences: notification_preferences || {},
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();
      
    if (error) throw error;
    return data as DbCustomerProfile;
  } catch (error) {
    console.error('Error creating customer profile:', error);
    return null;
  }
};

/**
 * Create provider profile
 */
export const createProviderProfile = async (profile: Partial<DbProviderProfile>): Promise<DbProviderProfile | null> => {
  try {
    const providerData: any = {
      id: profile.id,
      business_name: profile.business_name,
      business_description: profile.business_description,
      email: profile.email,
      phone_number: profile.phone_number,
      address: profile.address,
      city: profile.city,
      country: profile.country || 'Namibia',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('service_providers')
      .insert(providerData)
      .select()
      .single();
      
    if (error) throw error;
    return data as DbProviderProfile;
  } catch (error) {
    console.error('Error creating provider profile:', error);
    return null;
  }
};

/**
 * Update customer profile
 */
export const updateCustomerProfile = async (id: string, profile: Partial<DbCustomerProfile>): Promise<boolean> => {
  try {
    // Extract customer-specific fields
    const { 
      preferred_categories,
      saved_services,
      notification_preferences,
      ...profileData
    } = profile;

    // Update customer-specific data
    if (preferred_categories || saved_services || notification_preferences) {
      const customerData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (preferred_categories) customerData.preferred_categories = preferred_categories;
      if (saved_services) customerData.saved_services = saved_services;
      if (notification_preferences) customerData.notification_preferences = notification_preferences;
      
      const { error: customerError } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id);
        
      if (customerError) throw customerError;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return false;
  }
};

/**
 * Update provider profile
 */
export const updateProviderProfile = async (id: string, profile: Partial<DbProviderProfile>): Promise<boolean> => {
  try {
    const updateData: any = {
      ...profile,
      updated_at: new Date().toISOString()
    };
    
    delete updateData.id; // Remove id from update object
    
    const { error } = await supabase
      .from('service_providers')
      .update(updateData)
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating provider profile:', error);
    return false;
  }
};

/**
 * Create dispute
 */
export const createDispute = async (dispute: Partial<Dispute>): Promise<Dispute | null> => {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .insert({
        booking_id: dispute.bookingId,
        customer_id: dispute.customerId,
        provider_id: dispute.providerId,
        subject: dispute.subject,
        description: dispute.description,
        status: 'pending',
        priority: DisputePriority.MEDIUM,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dispute:', error);
      return null;
    }

    return {
      id: data.id,
      bookingId: data.booking_id,
      customerId: data.customer_id,
      providerId: data.provider_id,
      subject: data.subject,
      description: data.description,
      status: data.status,
      priority: data.priority,
      createdAt: data.created_at,
    } as Dispute;
  } catch (error) {
    console.error('Error in createDispute:', error);
    return null;
  }
};

// ... keep existing code (other profile-related functions)
