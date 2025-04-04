import { supabase } from '@/integrations/supabase/client';
import { DbCustomerProfile } from '@/types/auth';
import { ProviderData } from '@/hooks/useProviderProfile';
import { User, UserRole, ProviderVerificationStatus } from '@/types/auth';
import { ServiceData, PricingModel, ServiceCategory } from '@/types/service';
import { Dispute, DisputeStatus, DisputePriority } from '@/types/booking';
import { uploadImage, deleteImage } from './imageService';

// User profile functions
export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Customer functions
export async function fetchCustomerData(userId: string): Promise<DbCustomerProfile | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching customer data:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchCustomerData:', error);
    return null;
  }
}

export async function updateCustomerData(userId: string, data: Partial<DbCustomerProfile>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating customer data:', error);
    return false;
  }
}

// Provider functions
export async function fetchProviderData(userId: string): Promise<ProviderData | null> {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching provider data:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchProviderData:', error);
    return null;
  }
}

export async function updateProviderData(userId: string, data: Partial<ProviderData>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_providers')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating provider data:', error);
    return false;
  }
}

// Provider services
export async function fetchProviderServices(providerId: string): Promise<ServiceData[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map((service: any) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      pricing_model: service.pricing_model as PricingModel,
      category: service.category as ServiceCategory,
      provider_id: service.provider_id,
      provider_name: service.provider_name,
      image: service.image,
      features: service.features || [],
      is_active: service.is_active,
      location: service.location,
      rating: service.rating,
      review_count: service.review_count,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
  } catch (error) {
    console.error('Error fetching provider services:', error);
    return [];
  }
}

// Dispute functions
export async function fetchDisputes(userId: string, role: UserRole): Promise<Dispute[]> {
  try {
    let query;
    
    if (role === 'admin') {
      // Admins can see all disputes
      query = supabase
        .from('disputes')
        .select('*')
        .order('created_at', { ascending: false });
    } else if (role === 'provider') {
      // Providers can only see disputes related to their services
      query = supabase
        .from('disputes')
        .select('*')
        .eq('provider_id', userId)
        .order('created_at', { ascending: false });
    } else {
      // Customers can only see their own disputes
      query = supabase
        .from('disputes')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Convert data to match the Dispute interface
    return data.map((item: any) => ({
      id: item.id,
      bookingId: item.booking_id,
      customerId: item.customer_id,
      providerId: item.provider_id,
      subject: item.subject,
      description: item.description,
      status: item.status as DisputeStatus,
      resolution: item.resolution,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      priority: item.priority as DisputePriority,
      evidenceUrls: item.evidence_urls || [],
      refundAmount: item.refund_amount || 0,
      reason: item.admin_notes
    }));
  } catch (error) {
    console.error('Error fetching disputes:', error);
    return [];
  }
}

export async function createDispute(
  userId: string,
  bookingId: string,
  subject: string,
  description: string,
  priority: DisputePriority = 'medium',
  evidenceUrls: string[] = [],
  reason: string = ''
): Promise<boolean> {
  try {
    // Get booking details to get provider ID
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('provider_id, customer_id')
      .eq('id', bookingId)
      .single();
    
    if (bookingError) throw bookingError;
    
    const { error } = await supabase
      .from('disputes')
      .insert({
        booking_id: bookingId,
        customer_id: bookingData.customer_id,
        provider_id: bookingData.provider_id,
        subject,
        description,
        status: 'pending',
        priority,
        evidence_urls: evidenceUrls,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        admin_notes: reason
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating dispute:', error);
    return false;
  }
}

export async function updateDisputeStatus(
  disputeId: string,
  status: DisputeStatus,
  resolution?: string
): Promise<boolean> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (resolution) {
      updateData.resolution = resolution;
    }
    
    if (status === 'resolved') {
      updateData.resolution_date = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('disputes')
      .update(updateData)
      .eq('id', disputeId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating dispute status:', error);
    return false;
  }
}

// Service functions
export async function fetchServices(): Promise<ServiceData[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map((service: any) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      pricing_model: service.pricing_model as PricingModel,
      category: service.category as ServiceCategory,
      provider_id: service.provider_id,
      provider_name: service.provider_name,
      image: service.image,
      features: service.features || [],
      is_active: service.is_active,
      location: service.location,
      rating: service.rating,
      review_count: service.review_count,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function fetchFavoriteServices(userId: string): Promise<ServiceData[]> {
  try {
    // Get the user's favorites first
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('saved_services')
      .eq('id', userId)
      .single();
    
    if (customerError) throw customerError;
    
    const savedServiceIds = customerData.saved_services || [];
    
    if (savedServiceIds.length === 0) {
      return [];
    }
    
    // Now fetch the actual services
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .in('id', savedServiceIds)
      .eq('is_active', true);
    
    if (servicesError) throw servicesError;
    
    return servicesData.map((service: any) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      pricing_model: service.pricing_model as PricingModel,
      category: service.category as ServiceCategory,
      provider_id: service.provider_id,
      provider_name: service.provider_name,
      image: service.image,
      features: service.features || [],
      is_active: service.is_active,
      location: service.location,
      rating: service.rating,
      review_count: service.review_count,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
  } catch (error) {
    console.error('Error fetching favorite services:', error);
    return [];
  }
}

export async function addToFavorites(userId: string, serviceId: string): Promise<boolean> {
  try {
    // First get the current favorites
    const { data, error } = await supabase
      .from('customers')
      .select('saved_services')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    const savedServices = data.saved_services || [];
    
    // Add the service if it's not already in favorites
    if (!savedServices.includes(serviceId)) {
      const updatedServices = [...savedServices, serviceId];
      
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          saved_services: updatedServices,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
}

export async function removeFromFavorites(userId: string, serviceId: string): Promise<boolean> {
  try {
    // First get the current favorites
    const { data, error } = await supabase
      .from('customers')
      .select('saved_services')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    const savedServices = data.saved_services || [];
    
    // Remove the service if it's in favorites
    const updatedServices = savedServices.filter((id: string) => id !== serviceId);
    
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        saved_services: updatedServices,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
}

// Image upload/update helper functions for profile pictures and service images
export async function uploadProfileImage(userId: string, file: File): Promise<string | null> {
  try {
    const imageUrl = await uploadImage(file, 'avatars', userId);
    
    if (!imageUrl) {
      throw new Error('Failed to upload image');
    }
    
    // Update the profile with the new image URL
    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    return imageUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return null;
  }
}

export async function uploadServiceImage(serviceId: string, file: File): Promise<string | null> {
  try {
    const imageUrl = await uploadImage(file, 'services', serviceId);
    
    if (!imageUrl) {
      throw new Error('Failed to upload image');
    }
    
    // Update the service with the new image URL
    const { error } = await supabase
      .from('services')
      .update({
        image: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId);
    
    if (error) throw error;
    
    return imageUrl;
  } catch (error) {
    console.error('Error uploading service image:', error);
    return null;
  }
}
