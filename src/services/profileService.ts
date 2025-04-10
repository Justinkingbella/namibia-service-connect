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
    
    return data;
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
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching admin data:', error);
      throw error;
    }
    
    return data;
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
    const { data, error } = await supabase
      .from('customers')
      .insert({
        ...profile,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
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
    const { data, error } = await supabase
      .from('service_providers')
      .insert({
        ...profile,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
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
    const { error } = await supabase
      .from('customers')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) throw error;
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
    const { error } = await supabase
      .from('service_providers')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
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
