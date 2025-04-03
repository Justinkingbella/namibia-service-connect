import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { ServiceCategory, PricingModel } from '@/types';
import { Dispute } from '@/types/booking';
import { UserAddress, PaymentMethod } from '@/types/auth';

// Address functions
export const fetchUserAddresses = async (userId: string): Promise<UserAddress[]> => {
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
      
    if (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load your saved addresses');
      return [];
    }
    
    return data.map(addr => ({
      id: addr.id,
      userId: addr.user_id,
      name: addr.name,
      street: addr.street,
      city: addr.city,
      region: addr.region || undefined,
      postalCode: addr.postal_code || undefined,
      country: addr.country,
      isDefault: addr.is_default,
      createdAt: new Date(addr.created_at)
    }));
  } catch (error) {
    console.error('Unexpected error in fetchUserAddresses:', error);
    toast.error('Something went wrong while loading your addresses');
    return [];
  }
};

export const addUserAddress = async (address: Partial<UserAddress>): Promise<UserAddress | null> => {
  try {
    // If the new address is default, unset any other default addresses
    if (address.isDefault && address.userId) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', address.userId);
    }
    
    // Create the new address
    const { data, error } = await supabase
      .from('user_addresses')
      .insert([{
        user_id: address.userId,
        name: address.name,
        street: address.street,
        city: address.city,
        region: address.region,
        postal_code: address.postalCode,
        country: address.country,
        is_default: address.isDefault || false
      }])
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add new address');
      return null;
    }
    
    toast.success('Address added successfully');
    
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      street: data.street,
      city: data.city,
      region: data.region || undefined,
      postalCode: data.postal_code || undefined,
      country: data.country,
      isDefault: data.is_default,
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error('Unexpected error in addUserAddress:', error);
    toast.error('Something went wrong while adding your address');
    return null;
  }
};

export const updateUserAddress = async (addressId: string, data: Partial<UserAddress>): Promise<UserAddress | null> => {
  try {
    // If address is being set as default, unset any other default addresses
    if (data.isDefault && data.userId) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', data.userId);
    }
    
    // Update the address
    const { data: updatedData, error } = await supabase
      .from('user_addresses')
      .update({
        name: data.name,
        street: data.street,
        city: data.city,
        region: data.region,
        postal_code: data.postalCode,
        country: data.country,
        is_default: data.isDefault
      })
      .eq('id', addressId)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
      return null;
    }
    
    toast.success('Address updated successfully');
    
    return {
      id: updatedData.id,
      userId: updatedData.user_id,
      name: updatedData.name,
      street: updatedData.street,
      city: updatedData.city,
      region: updatedData.region || undefined,
      postalCode: updatedData.postal_code || undefined,
      country: updatedData.country,
      isDefault: updatedData.is_default,
      createdAt: new Date(updatedData.created_at)
    };
  } catch (error) {
    console.error('Unexpected error in updateUserAddress:', error);
    toast.error('Something went wrong while updating your address');
    return null;
  }
};

export const deleteUserAddress = async (addressId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId);
      
    if (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
      return false;
    }
    
    toast.success('Address deleted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteUserAddress:', error);
    toast.error('Something went wrong while deleting your address');
    return false;
  }
};

// Favorites functions
export const fetchUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('favorite_services')
      .select('service_id')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
    
    return data.map(fav => fav.service_id);
  } catch (error) {
    console.error('Unexpected error in fetchUserFavorites:', error);
    return [];
  }
};

export const addFavorite = async (userId: string, serviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('favorite_services')
      .insert([{ user_id: userId, service_id: serviceId }]);
      
    if (error) {
      // If it's a duplicate (service already favorited), don't show error
      if (error.code === '23505') { // Unique violation 
        return true;
      }
      console.error('Error adding favorite:', error);
      toast.error('Failed to save service to favorites');
      return false;
    }
    
    toast.success('Service added to favorites');
    return true;
  } catch (error) {
    console.error('Unexpected error in addFavorite:', error);
    toast.error('Something went wrong');
    return false;
  }
};

export const removeFavorite = async (userId: string, serviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('favorite_services')
      .delete()
      .eq('user_id', userId)
      .eq('service_id', serviceId);
      
    if (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove service from favorites');
      return false;
    }
    
    toast.success('Service removed from favorites');
    return true;
  } catch (error) {
    console.error('Unexpected error in removeFavorite:', error);
    toast.error('Something went wrong');
    return false;
  }
};

// Dispute functions
export const fetchUserDisputes = async (userId: string): Promise<Dispute[]> => {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user disputes:', error);
      toast.error('Failed to load your disputes');
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      bookingId: item.booking_id,
      customerId: item.customer_id,
      providerId: item.provider_id,
      subject: item.subject,
      description: item.description,
      status: item.status,
      resolution: item.resolution,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      priority: item.priority,
      evidenceUrls: item.evidence_urls || [],
      refundAmount: item.refund_amount,
      reason: item.reason
    }));
  } catch (error) {
    console.error('Unexpected error in fetchUserDisputes:', error);
    toast.error('Something went wrong while loading your disputes');
    return [];
  }
};

export const fetchProviderDisputes = async (providerId: string): Promise<Dispute[]> => {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching provider disputes:', error);
      toast.error('Failed to load disputes');
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      bookingId: item.booking_id,
      customerId: item.customer_id,
      providerId: item.provider_id,
      subject: item.subject,
      description: item.description,
      status: item.status,
      resolution: item.resolution,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      priority: item.priority,
      evidenceUrls: item.evidence_urls || [],
      refundAmount: item.refund_amount,
      reason: item.reason
    }));
  } catch (error) {
    console.error('Unexpected error in fetchProviderDisputes:', error);
    toast.error('Something went wrong while loading disputes');
    return [];
  }
};

export const fetchAllDisputes = async (): Promise<Dispute[]> => {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching all disputes:', error);
      toast.error('Failed to load disputes');
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      bookingId: item.booking_id,
      customerId: item.customer_id,
      providerId: item.provider_id,
      subject: item.subject,
      description: item.description,
      status: item.status,
      resolution: item.resolution,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      priority: item.priority,
      evidenceUrls: item.evidence_urls || [],
      refundAmount: item.refund_amount,
      reason: item.reason
    }));
  } catch (error) {
    console.error('Unexpected error in fetchAllDisputes:', error);
    toast.error('Something went wrong while loading disputes');
    return [];
  }
};

export const createDispute = async (disputeData: Partial<Dispute>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('disputes')
      .insert([{
        booking_id: disputeData.bookingId,
        customer_id: disputeData.customerId,
        provider_id: disputeData.providerId,
        subject: disputeData.subject,
        description: disputeData.description,
        status: 'pending',
        priority: disputeData.priority || 'medium',
        evidence_urls: disputeData.evidenceUrls || [],
        refund_amount: disputeData.refundAmount || 0,
        reason: disputeData.reason
      }]);
      
    if (error) {
      console.error('Error creating dispute:', error);
      toast.error('Failed to submit dispute');
      return false;
    }
    
    toast.success('Dispute submitted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in createDispute:', error);
    toast.error('Something went wrong while submitting your dispute');
    return false;
  }
};

export const updateDisputeStatus = async (
  disputeId: string, 
  status: string, 
  resolution?: string
): Promise<boolean> => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (resolution) {
      updateData.resolution = resolution;
    }
    
    // If status is resolved, add resolution date
    if (status === 'resolved') {
      updateData.resolution_date = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('disputes')
      .update(updateData)
      .eq('id', disputeId);
      
    if (error) {
      console.error('Error updating dispute:', error);
      toast.error('Failed to update dispute status');
      return false;
    }
    
    toast.success('Dispute status updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in updateDisputeStatus:', error);
    toast.error('Something went wrong while updating the dispute');
    return false;
  }
};

export const fetchDisputeById = async (disputeId: string): Promise<Dispute | null> => {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('id', disputeId)
      .single();
      
    if (error) {
      console.error('Error fetching dispute:', error);
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
      resolution: data.resolution,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      priority: data.priority,
      evidenceUrls: data.evidence_urls || [],
      refundAmount: data.refund_amount,
      reason: data.reason
    };
  } catch (error) {
    console.error('Unexpected error in fetchDisputeById:', error);
    return null;
  }
};

// Profile types
export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile extends Profile {
  preferredCategories?: string[];
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  savedServices?: string[];
  recentSearches?: string[];
}

export interface ProviderProfile extends Profile {
  businessName: string;
  businessDescription?: string;
  businessLogo?: string;
  businessAddress?: string;
  businessHours?: Record<string, { open: string; close: string }>;
  categories?: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
  rating?: number;
  reviewCount?: number;
  subscriptionTier?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchCode?: string;
  };
}

// Service types
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  price: number;
  pricing_model: PricingModel;
  category: ServiceCategory;
  provider_id: string;
  provider_name?: string;
  image?: string;
  features?: string[];
  is_active: boolean;
  location?: string;
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

// Fetch user profile
export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
      return null;
    }

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phoneNumber: data.phone_number,
      avatar: data.avatar_url,
      bio: data.bio,
      location: data.location,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Unexpected error in fetchUserProfile:', error);
    toast.error('Something went wrong while loading your profile');
    return null;
  }
}

// Fetch customer profile
export async function fetchCustomerProfile(userId: string): Promise<CustomerProfile | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching customer profile:', error);
      toast.error('Failed to load customer profile');
      return null;
    }

    if (!data.profile) {
      toast.error('Profile information not found');
      return null;
    }

    return {
      id: data.id,
      firstName: data.profile.first_name,
      lastName: data.profile.last_name,
      email: data.profile.email,
      phoneNumber: data.profile.phone_number,
      avatar: data.profile.avatar_url,
      bio: data.profile.bio,
      location: data.profile.location,
      createdAt: data.profile.created_at,
      updatedAt: data.profile.updated_at,
      preferredCategories: data.preferred_categories,
      notificationPreferences: data.notification_preferences,
      savedServices: data.saved_services,
      recentSearches: data.recent_searches
    };
  } catch (error) {
    console.error('Unexpected error in fetchCustomerProfile:', error);
    toast.error('Something went wrong while loading your profile');
    return null;
  }
}

// Fetch provider profile
export async function fetchProviderProfile(userId: string): Promise<ProviderProfile | null> {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching provider profile:', error);
      toast.error('Failed to load provider profile');
      return null;
    }

    if (!data.profile) {
      toast.error('Profile information not found');
      return null;
    }

    return {
      id: data.id,
      firstName: data.profile.first_name,
      lastName: data.profile.last_name,
      email: data.profile.email,
      phoneNumber: data.profile.phone_number,
      avatar: data.profile.avatar_url,
      bio: data.profile.bio,
      location: data.profile.location,
      createdAt: data.profile.created_at,
      updatedAt: data.profile.updated_at,
      businessName: data.business_name,
      businessDescription: data.business_description,
      businessLogo: data.business_logo,
      businessAddress: data.business_address,
      businessHours: data.business_hours,
      categories: data.categories,
      verificationStatus: data.verification_status,
      verificationDocuments: data.verification_documents,
      rating: data.rating,
      reviewCount: data.review_count,
      subscriptionTier: data.subscription_tier,
      bankDetails: data.bank_details
    };
  } catch (error) {
    console.error('Unexpected error in fetchProviderProfile:', error);
    toast.error('Something went wrong while loading your profile');
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profileData: Partial<Profile>,
  avatarFile?: File
): Promise<boolean> {
  try {
    let avatarUrl = profileData.avatar;

    // Upload avatar if provided
    if (avatarFile) {
      const uploadResult = await uploadImage(avatarFile, `avatars/${userId}`);
      if (uploadResult.success) {
        avatarUrl = uploadResult.url;
      } else {
        toast.error('Failed to upload avatar');
        return false;
      }
    }

    // Prepare data for update
    const updateData = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone_number: profileData.phoneNumber,
      avatar_url: avatarUrl,
      bio: profileData.bio,
      location: profileData.location,
      updated_at: new Date().toISOString()
    };

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }

    toast.success('Profile updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in updateUserProfile:', error);
    toast.error('Something went wrong while updating your profile');
    return false;
  }
}

// Update customer profile
export async function updateCustomerProfile(
  userId: string,
  profileData: Partial<CustomerProfile>,
  avatarFile?: File
): Promise<boolean> {
  try {
    // First update the base profile
    const baseProfileUpdated = await updateUserProfile(userId, profileData, avatarFile);
    
    if (!baseProfileUpdated) {
      return false;
    }

    // Prepare customer-specific data
    const customerData = {
      preferred_categories: profileData.preferredCategories,
      notification_preferences: profileData.notificationPreferences,
      updated_at: new Date().toISOString()
    };

    // Update customer data
    const { error } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating customer profile:', error);
      toast.error('Failed to update customer preferences');
      return false;
    }

    toast.success('Profile updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in updateCustomerProfile:', error);
    toast.error('Something went wrong while updating your profile');
    return false;
  }
}

// Update provider profile
export async function updateProviderProfile(
  userId: string,
  profileData: Partial<ProviderProfile>,
  avatarFile?: File,
  businessLogoFile?: File
): Promise<boolean> {
  try {
    // First update the base profile
    const baseProfileUpdated = await updateUserProfile(userId, profileData, avatarFile);
    
    if (!baseProfileUpdated) {
      return false;
    }

    let businessLogoUrl = profileData.businessLogo;

    // Upload business logo if provided
    if (businessLogoFile) {
      const uploadResult = await uploadImage(businessLogoFile, `business_logos/${userId}`);
      if (uploadResult.success) {
        businessLogoUrl = uploadResult.url;
      } else {
        toast.error('Failed to upload business logo');
        return false;
      }
    }

    // Prepare provider-specific data
    const providerData = {
      business_name: profileData.businessName,
      business_description: profileData.businessDescription,
      business_logo: businessLogoUrl,
      business_address: profileData.businessAddress,
      business_hours: profileData.businessHours,
      categories: profileData.categories,
      bank_details: profileData.bankDetails,
      updated_at: new Date().toISOString()
    };

    // Update provider data
    const { error } = await supabase
      .from('service_providers')
      .update(providerData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating provider profile:', error);
      toast.error('Failed to update business information');
      return false;
    }

    toast.success('Business profile updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in updateProviderProfile:', error);
    toast.error('Something went wrong while updating your business profile');
    return false;
  }
}

// Submit verification documents
export async function submitVerificationDocuments(
  userId: string,
  documents: File[]
): Promise<boolean> {
  try {
    const documentUrls: string[] = [];

    // Upload each document
    for (const document of documents) {
      const uploadResult = await uploadImage(document, `verification/${userId}`);
      if (uploadResult.success) {
        documentUrls.push(uploadResult.url);
      } else {
        toast.error(`Failed to upload document: ${document.name}`);
        return false;
      }
    }

    // Update provider verification status and documents
    const { error } = await supabase
      .from('service_providers')
      .update({
        verification_status: 'pending',
        verification_documents: documentUrls,
        verification_submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error submitting verification documents:', error);
      toast.error('Failed to submit verification documents');
      return false;
    }

    toast.success('Verification documents submitted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in submitVerificationDocuments:', error);
    toast.error('Something went wrong while submitting your documents');
    return false;
  }
}

// Create a new service
export async function createService(
  providerId: string,
  serviceData: Partial<ServiceData>,
  imageFile?: File
): Promise<string | null> {
  try {
    let imageUrl = serviceData.image;

    // Upload service image if provided
    if (imageFile) {
      const uploadResult = await uploadImage(imageFile, `services/${providerId}`);
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
      } else {
        toast.error('Failed to upload service image');
        return null;
      }
    }

    // Get provider name
    const { data: providerData, error: providerError } = await supabase
      .from('service_providers')
      .select('business_name')
      .eq('id', providerId)
      .single();

    if (providerError) {
      console.error('Error fetching provider name:', providerError);
      toast.error('Failed to fetch provider information');
      return null;
    }

    // Prepare service data
    const newServiceData = {
      title: serviceData.title,
      description: serviceData.description,
      price: serviceData.price,
      pricing_model: serviceData.pricing_model || 'fixed',
      category: serviceData.category,
      provider_id: providerId,
      provider_name: providerData.business_name,
      image: imageUrl,
      features: serviceData.features || [],
      is_active: serviceData.is_active !== undefined ? serviceData.is_active : true,
      location: serviceData.location || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert new service
    const { data, error } = await supabase
      .from('services')
      .insert([newServiceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
      return null;
    }

    toast.success('Service created successfully');
    return data.id;
  } catch (error) {
    console.error('Unexpected error in createService:', error);
    toast.error('Something went wrong while creating your service');
    return null;
  }
}

// Update an existing service
export async function updateService(
  serviceId: string,
  providerId: string,
  serviceData: Partial<ServiceData>,
  imageFile?: File
): Promise<boolean> {
  try {
    // Verify service belongs to provider
    const { data: existingService, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('provider_id', providerId)
      .single();

    if (fetchError) {
      console.error('Error fetching service:', fetchError);
      toast.error('Failed to verify service ownership');
      return false;
    }

    let imageUrl = serviceData.image || existingService.image;

    // Upload new service image if provided
    if (imageFile) {
      const uploadResult = await uploadImage(imageFile, `services/${providerId}`);
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
        
        // Delete old image if it exists and is different
        if (existingService.image && existingService.image !== imageUrl) {
          await deleteImage(existingService.image);
        }
      } else {
        toast.error('Failed to upload service image');
        return false;
      }
    }

    // Prepare update data
    const updateData = {
      title: serviceData.title !== undefined ? serviceData.title : existingService.title,
      description: serviceData.description !== undefined ? serviceData.description : existingService.description,
      price: serviceData.price !== undefined ? serviceData.price : existingService.price,
      pricing_model: serviceData.pricing_model || existingService.pricing_model,
      category: serviceData.category || existingService.category,
      image: imageUrl,
      features: serviceData.features || existingService.features,
      is_active: serviceData.is_active !== undefined ? serviceData.is_active : existingService.is_active,
      location: serviceData.location || existingService.location,
      updated_at: new Date().toISOString()
    };

    // Update service
    const { error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', serviceId)
      .eq('provider_id', providerId);

    if (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
      return false;
    }

    toast.success('Service updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in updateService:', error);
    toast.error('Something went wrong while updating your service');
    return false;
  }
}

// Delete a service
export async function deleteService(serviceId: string, providerId: string): Promise<boolean> {
  try {
    // Verify service belongs to provider and get image URL
    const { data: service, error: fetchError } = await supabase
      .from('services')
      .select('image')
      .eq('id', serviceId)
      .eq('provider_id', providerId)
      .single();

    if (fetchError) {
      console.error('Error fetching service:', fetchError);
      toast.error('Failed to verify service ownership');
      return false;
    }

    // Delete service
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)
      .eq('provider_id', providerId);

    if (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
      return false;
    }

    // Delete service image if it exists
    if (service.image) {
      await deleteImage(service.image);
    }

    toast.success('Service deleted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteService:', error);
    toast.error('Something went wrong while deleting your service');
    return false;
  }
}

// Fetch provider services
export async function fetchProviderServices(providerId: string): Promise<ServiceData[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching provider services:', error);
      toast.error('Failed to load services');
      return [];
    }

    return data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      pricing_model: service.pricing_model,
      category: service.category,
      provider_id: service.provider_id,
      provider_name: service.provider_name,
      image: service.image,
      features: service.features,
      is_active: service.is_active,
      location: service.location,
      rating: service.rating,
      review_count: service.review_count,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
  } catch (error) {
    console.error('Unexpected error in fetchProviderServices:', error);
    toast.error('Something went wrong while loading services');
    return [];
  }
}

// Fetch a single service by ID
export async function fetchServiceById(serviceId: string): Promise<ServiceData | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to load service details');
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      pricing_model: data.pricing_model,
      category: data.category,
      provider_id: data.provider_id,
      provider_name: data.provider_name,
      image: data.image,
      features: data.features,
      is_active: data.is_active,
      location: data.location,
      rating: data.rating,
      review_count: data.review_count,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Unexpected error in fetchServiceById:', error);
    toast.error('Something went wrong while loading service details');
    return null;
  }
}

// Search services
export async function searchServices(
  query: string,
  category?: string,
  location?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'newest' = 'newest',
  limit: number = 20
): Promise<ServiceData[]> {
  try {
    let supabaseQuery = supabase
      .from('services')
      .select('*')
      .eq('is_active', true);

    // Apply text search if query is provided
    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Apply category filter
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    // Apply location filter
    if (location) {
      supabaseQuery = supabaseQuery.ilike('location', `%${location}%`);
    }

    // Apply price range filters
    if (minPrice !== undefined) {
      supabaseQuery = supabaseQuery.gte('price', minPrice);
    }
    if (maxPrice !== undefined) {
      supabaseQuery = supabaseQuery.lte('price', maxPrice);
    }

    // Apply sorting
    if (sortBy === 'price_asc') {
      supabaseQuery = supabaseQuery.order('price', { ascending: true });
    } else if (sortBy === 'price_desc') {
      supabaseQuery = supabaseQuery.order('price', { ascending: false });
    } else if (sortBy === 'rating') {
      supabaseQuery = supabaseQuery.order('rating', { ascending: false });
    } else {
      // Default to newest
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    }

    // Apply limit
    supabaseQuery = supabaseQuery.limit(limit);

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching services:', error);
      toast.error('Failed to search services');
      return [];
    }

    return data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      pricing_model: service.pricing_model,
      category: service.category,
      provider_id: service.provider_id,
      provider_name: service.provider_name,
      image: service.image,
      features: service.features,
      is_active: service.is_active,
      location: service.location,
      rating: service.rating,
      review_count: service.review_count,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
  } catch (error) {
    console.error('Unexpected error in searchServices:', error);
    toast.error('Something went wrong while searching services');
    return [];
  }
}

// Save a service to customer's favorites
export async function saveService(customerId: string, serviceId: string): Promise<boolean> {
  try {
    // Get current saved services
    const { data, error } = await supabase
      .from('customers')
      .select('saved_services')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error fetching saved services:', error);
      toast.error('Failed to access your saved services');
      return false;
    }

    // Add service to saved services if not already saved
    const savedServices = data.saved_services || [];
    if (!savedServices.includes(serviceId)) {
      savedServices.push(serviceId);

      // Update saved services
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          saved_services: savedServices,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (updateError) {
        console.error('Error saving service:', updateError);
        toast.error('Failed to save service');
        return false;
      }

      toast.success('Service saved to favorites');
      return true;
    }

    // Service already saved
    toast.info('Service already in favorites');
    return true;
  } catch (error) {
    console.error('Unexpected error in saveService:', error);
    toast.error('Something went wrong while saving the service');
    return false;
  }
}

// Remove a service from customer's favorites
export async function unsaveService(customerId: string, serviceId: string): Promise<boolean> {
  try {
    // Get current saved services
    const { data, error } = await supabase
      .from('customers')
      .select('saved_services')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error fetching saved services:', error);
      toast.error('Failed to access your saved services');
      return false;
    }

    // Remove service from saved services
    const savedServices = data.saved_services || [];
    const updatedSavedServices = savedServices.filter(id => id !== serviceId);

    // Update saved services
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        saved_services: updatedSavedServices,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId);

    if (updateError) {
      console.error('Error removing saved service:', updateError);
      toast.error('Failed to remove service from favorites');
      return false;
    }

    toast.success('Service removed from favorites');
    return true;
  } catch (error) {
    console.error('Unexpected error in unsaveService:', error);
    toast.error('Something went wrong while removing the service');
    return false;
  }
}

// Fetch customer's saved services
export async function fetchSavedServices(customerId: string): Promise<ServiceData[]> {
  try {
    // Get saved service IDs
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('saved_services')
      .eq('id', customerId)
      .single();

    if (customerError) {
      console.error('Error fetching saved service IDs:', customerError);
      toast.error('Failed to access your saved services');
      return [];
    }

    const savedServiceIds = customerData.saved_services || [];
    
    if (savedServiceIds.length === 0) {
      return [];
    }

    // Fetch the actual services
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .in('id', savedServiceIds)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching saved services:', error);
      toast.error('Failed to load your saved services');
      return [];
    }

    return data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      pricing_model: service.pricing_model,
      category: service.category,
      provider_id: service.provider_id,
      provider_name: service.provider_name,
      image: service.image,
      features: service.features,
      is_active: service.is_active,
      location: service.location,
      rating: service.rating,
      review_count: service.review_count,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
  } catch (error) {
    console.error('Unexpected error in fetchSavedServices:', error);
    toast.error('Something went wrong while loading your saved services');
    return [];
  }
}

// Check if a service is saved by a customer
export async function isServiceSaved(customerId: string, serviceId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('saved_services')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error checking saved service:', error);
      return false;
    }

    const savedServices = data.saved_services || [];
    return savedServices.includes(serviceId);
  } catch (error) {
    console.error('Unexpected error in isServiceSaved:', error);
    return false;
  }
}

// Fetch featured services
export async function fetchFeaturedServices(limit: number = 6): Promise<ServiceData[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured services:', error);
      toast.error('Failed to load featured services');
      return [];
    }

    return data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      pricing_model: service.pricing_model,
      category: service.category,
      provider_id: service.provider_id,
      provider_name: service.provider_name,
      image: service.image,
      features: service.features,
      is_active: service.is_active,
      location: service.location,
      rating: service.rating,
      review_count: service.review_count,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
  } catch (error) {
    console.error('Unexpected error in fetchFeaturedServices:', error);
    toast.error('Something went wrong while loading featured services');
    return [];
  }
}

// Fetch services by category
export async function fetchServicesByCategory(
  category: string,
  limit: number = 10
): Promise<ServiceData[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`Error fetching services for category ${category}:`, error);
      toast.error('Failed to load services for this category');
      return [];
    }

    return data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      pricing_model: service.pricing_model,
      category: service.category,
      provider_id: service.provider_id,
      provider_name: service.provider_name,
      image: service.image,
      features: service.features,
      is_active: service.is_active,
      location: service.location,
      rating: service.rating,
      review_count: service.review_count,
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
  } catch (error) {
    console.error('Unexpected error in fetchServicesByCategory:', error);
    toast.error('Something went wrong while loading services');
    return [];
  }
}
