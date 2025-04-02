import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentHistory, Dispute } from '@/types/payments';
import { DbUserProfile, UserAddress, PaymentMethod, User2FA } from '@/types/auth';
import { FavoriteService } from '@/types/favorites';
import { Message } from '@/types/message';

// Fetch payment history for a user
export async function fetchPaymentHistory(userId: string): Promise<PaymentHistory[]> {
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment history:', error);
      toast.error('Failed to load payment history');
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      transactionType: item.booking_id ? 'booking' : 'subscription',
      amount: item.amount,
      status: item.status as 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
      date: item.created_at,
      paymentMethod: item.payment_method,
      description: item.description
    }));
  } catch (error) {
    console.error('Error in fetchPaymentHistory:', error);
    toast.error('Failed to load payment history');
    return [];
  }
}

// Fetch disputes for a user
export async function fetchUserDisputes(userId: string): Promise<Dispute[]> {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .or(`customer_id.eq.${userId},provider_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching disputes:', error);
      toast.error('Failed to load disputes');
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      bookingId: item.booking_id,
      customerId: item.customer_id,
      providerId: item.provider_id,
      status: item.status as 'open' | 'under_review' | 'resolved' | 'declined',
      reason: item.subject,
      description: item.description,
      evidenceUrls: [],
      resolution: item.resolution,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Error in fetchUserDisputes:', error);
    toast.error('Failed to load disputes');
    return [];
  }
}

// Create a new dispute
export async function createDispute(dispute: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dispute | null> {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .insert([{
        booking_id: dispute.bookingId,
        customer_id: dispute.customerId,
        provider_id: dispute.providerId,
        subject: dispute.reason,
        description: dispute.description,
        status: dispute.status || 'open'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating dispute:', error);
      toast.error('Failed to create dispute');
      return null;
    }

    toast.success('Dispute submitted successfully');
    
    return {
      id: data.id,
      bookingId: data.booking_id,
      customerId: data.customer_id,
      providerId: data.provider_id,
      status: data.status as 'open' | 'under_review' | 'resolved' | 'declined',
      reason: data.subject,
      description: data.description,
      evidenceUrls: [],
      resolution: data.resolution,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Error in createDispute:', error);
    toast.error('Failed to create dispute');
    return null;
  }
}

// User Profile Functions
export async function fetchUserProfile(userId: string): Promise<DbUserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    toast.error('Failed to load profile');
    return null;
  }
}

export async function updateUserProfile(userId: string, profileData: Partial<DbUserProfile>): Promise<DbUserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      return null;
    }

    toast.success('Profile updated successfully');
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    toast.error('Failed to update profile');
    return null;
  }
}

export async function updateUserPassword(newPassword: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
      return false;
    }

    toast.success('Password updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateUserPassword:', error);
    toast.error('Failed to update password');
    return false;
  }
}

// User Address Functions
export async function fetchUserAddresses(userId: string): Promise<UserAddress[]> {
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching user addresses:', error);
      toast.error('Failed to load addresses');
      return [];
    }

    return data.map(address => ({
      id: address.id,
      userId: address.user_id,
      name: address.name,
      street: address.street,
      city: address.city,
      region: address.region,
      postalCode: address.postal_code,
      country: address.country,
      isDefault: address.is_default,
      createdAt: address.created_at
    }));
  } catch (error) {
    console.error('Error in fetchUserAddresses:', error);
    toast.error('Failed to load addresses');
    return [];
  }
}

export async function addUserAddress(userId: string, address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>): Promise<UserAddress | null> {
  try {
    // If this is the default address, update other addresses
    if (address.isDefault) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert([{
        user_id: userId,
        name: address.name,
        street: address.street,
        city: address.city,
        region: address.region,
        postal_code: address.postalCode,
        country: address.country,
        is_default: address.isDefault
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding user address:', error);
      toast.error('Failed to add address');
      return null;
    }

    toast.success('Address added successfully');
    
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      street: data.street,
      city: data.city,
      region: data.region,
      postalCode: data.postal_code,
      country: data.country,
      isDefault: data.is_default,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error in addUserAddress:', error);
    toast.error('Failed to add address');
    return null;
  }
}

export async function updateUserAddress(addressId: string, addressData: Partial<Omit<UserAddress, 'id' | 'userId' | 'createdAt'>>): Promise<boolean> {
  try {
    // Convert from camelCase to snake_case for database
    const dbAddressData: any = {};
    if (addressData.name) dbAddressData.name = addressData.name;
    if (addressData.street) dbAddressData.street = addressData.street;
    if (addressData.city) dbAddressData.city = addressData.city;
    if (addressData.region) dbAddressData.region = addressData.region;
    if (addressData.postalCode) dbAddressData.postal_code = addressData.postalCode;
    if (addressData.country) dbAddressData.country = addressData.country;
    if (addressData.isDefault !== undefined) dbAddressData.is_default = addressData.isDefault;

    // If setting as default, update other addresses
    if (addressData.isDefault) {
      // Get the user ID first
      const { data: addressData, error: fetchError } = await supabase
        .from('user_addresses')
        .select('user_id')
        .eq('id', addressId)
        .single();

      if (fetchError) {
        console.error('Error fetching address:', fetchError);
        toast.error('Failed to update address');
        return false;
      }

      // Update other addresses to not be default
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', addressData.user_id)
        .neq('id', addressId);
    }

    const { error } = await supabase
      .from('user_addresses')
      .update(dbAddressData)
      .eq('id', addressId);

    if (error) {
      console.error('Error updating user address:', error);
      toast.error('Failed to update address');
      return false;
    }

    toast.success('Address updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateUserAddress:', error);
    toast.error('Failed to update address');
    return false;
  }
}

export async function deleteUserAddress(addressId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      console.error('Error deleting user address:', error);
      toast.error('Failed to delete address');
      return false;
    }

    toast.success('Address deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteUserAddress:', error);
    toast.error('Failed to delete address');
    return false;
  }
}

// Payment Methods Functions
export async function fetchUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
      return [];
    }

    return data.map(method => ({
      id: method.id,
      userId: method.user_id,
      type: method.type,
      name: method.name,
      details: method.details as Record<string, any>,
      isDefault: method.is_default,
      createdAt: method.created_at
    }));
  } catch (error) {
    console.error('Error in fetchUserPaymentMethods:', error);
    toast.error('Failed to load payment methods');
    return [];
  }
}

export async function addPaymentMethod(userId: string, method: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>): Promise<PaymentMethod | null> {
  try {
    // If this is the default method, update other methods
    if (method.isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert([{
        user_id: userId,
        type: method.type,
        name: method.name,
        details: method.details as Record<string, any>,
        is_default: method.isDefault
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method');
      return null;
    }

    toast.success('Payment method added successfully');
    
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      name: data.name,
      details: data.details as Record<string, any>,
      isDefault: data.is_default,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error in addPaymentMethod:', error);
    toast.error('Failed to add payment method');
    return null;
  }
}

export async function deletePaymentMethod(methodId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);

    if (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
      return false;
    }

    toast.success('Payment method deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deletePaymentMethod:', error);
    toast.error('Failed to delete payment method');
    return false;
  }
}

export async function setDefaultPaymentMethod(methodId: string, userId: string): Promise<boolean> {
  try {
    // First, set all user's payment methods to non-default
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    // Then set the selected one as default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId);

    if (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method');
      return false;
    }

    toast.success('Default payment method updated successfully');
    return true;
  } catch (error) {
    console.error('Error in setDefaultPaymentMethod:', error);
    toast.error('Failed to update default payment method');
    return false;
  }
}

// 2FA Functions
export async function fetchUser2FAStatus(userId: string): Promise<User2FA | null> {
  try {
    const { data, error } = await supabase
      .from('user_2fa')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No 2FA record found, return default state
        return {
          id: '',
          userId,
          isEnabled: false,
          createdAt: new Date().toISOString()
        };
      }
      console.error('Error fetching 2FA status:', error);
      toast.error('Failed to load 2FA status');
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      isEnabled: data.is_enabled,
      secret: data.secret,
      backupCodes: data.backup_codes,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error in fetchUser2FAStatus:', error);
    toast.error('Failed to load 2FA status');
    return null;
  }
}

export async function enable2FA(userId: string, secret: string, backupCodes: string[]): Promise<boolean> {
  try {
    // Check if user already has 2FA record
    const { data: existingData, error: fetchError } = await supabase
      .from('user_2fa')
      .select('id')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error checking existing 2FA:', fetchError);
      toast.error('Failed to enable 2FA');
      return false;
    }

    let error;
    if (existingData && existingData.length > 0) {
      // Update existing record
      const result = await supabase
        .from('user_2fa')
        .update({
          is_enabled: true,
          secret,
          backup_codes: backupCodes
        })
        .eq('user_id', userId);
      
      error = result.error;
    } else {
      // Create new record
      const result = await supabase
        .from('user_2fa')
        .insert([{
          user_id: userId,
          is_enabled: true,
          secret,
          backup_codes: backupCodes
        }]);
      
      error = result.error;
    }

    if (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable 2FA');
      return false;
    }

    toast.success('Two-factor authentication enabled successfully');
    return true;
  } catch (error) {
    console.error('Error in enable2FA:', error);
    toast.error('Failed to enable 2FA');
    return false;
  }
}

export async function disable2FA(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_2fa')
      .update({
        is_enabled: false,
        secret: null,
        backup_codes: null
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable 2FA');
      return false;
    }

    toast.success('Two-factor authentication disabled successfully');
    return true;
  } catch (error) {
    console.error('Error in disable2FA:', error);
    toast.error('Failed to disable 2FA');
    return false;
  }
}

// Messages Functions
export async function fetchUserMessages(userId: string): Promise<Message[]> {
  try {
    // First get all conversations the user is part of
    const { data: conversationData, error: convError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);

    if (convError) {
      console.error('Error fetching conversations:', convError);
      toast.error('Failed to load messages');
      return [];
    }

    if (!conversationData.length) {
      return []; // No conversations
    }

    const conversationIds = conversationData.map(cp => cp.conversation_id);

    // Now fetch the messages from these conversations
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      return [];
    }

    return data.map(message => ({
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_id,
      text: message.content,
      content: message.content,
      timestamp: new Date(message.created_at),
      sentAt: new Date(message.created_at),
      isRead: message.read,
      attachments: message.attachments || [],
      senderName: "Unknown User",
      senderAvatar: undefined
    }));
  } catch (error) {
    console.error('Error in fetchUserMessages:', error);
    toast.error('Failed to load messages');
    return [];
  }
}

export async function sendMessage(senderId: string, recipientId: string, content: string, attachments?: string[]): Promise<boolean> {
  try {
    // First check if a conversation exists between these users
    const { data: conversationData, error: convError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', senderId);

    if (convError) {
      console.error('Error fetching conversations:', convError);
      toast.error('Failed to send message');
      return false;
    }

    let conversationId;
    
    if (conversationData.length) {
      // Check if there's a conversation with the recipient
      const { data: recipientConvData, error: recipientConvError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', recipientId)
        .in('conversation_id', conversationData.map(cp => cp.conversation_id));

      if (recipientConvError) {
        console.error('Error checking existing conversation:', recipientConvError);
        toast.error('Failed to send message');
        return false;
      }

      if (recipientConvData.length) {
        // Found existing conversation
        conversationId = recipientConvData[0].conversation_id;
      }
    }

    // Create new conversation if needed
    if (!conversationId) {
      const { data: newConvData, error: newConvError } = await supabase
        .from('conversations')
        .insert([{}])
        .select();

      if (newConvError) {
        console.error('Error creating conversation:', newConvError);
        toast.error('Failed to send message');
        return false;
      }

      conversationId = newConvData[0].id;

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversationId, user_id: senderId },
          { conversation_id: conversationId, user_id: recipientId }
        ]);

      if (participantsError) {
        console.error('Error adding conversation participants:', participantsError);
        toast.error('Failed to send message');
        return false;
      }
    }

    // Now send the message
    const { error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        attachments,
        read: false
      }]);

    if (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }

    toast.success('Message sent successfully');
    return true;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    toast.error('Failed to send message');
    return false;
  }
}

export async function markMessageAsRead(messageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markMessageAsRead:', error);
    return false;
  }
}

// Favorites Functions
export async function fetchUserFavorites(userId: string): Promise<FavoriteService[]> {
  try {
    const { data, error } = await supabase
      .from('favorite_services')
      .select('*, service:service_id(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
      return [];
    }

    return data.map(fav => {
      const defaultService = {
        id: fav.service_id,
        title: 'Unknown Service',
        description: '',
        price: 0,
        providerId: '',
        providerName: 'Unknown Provider',
        categoryId: '',
        imageUrl: undefined,
        rating: 0,
        reviewCount: 0
      };

      // Safely handle the case where service might be null or have an error
      let service = defaultService;
      
      if (fav.service && typeof fav.service === 'object') {
        service = {
          id: fav.service_id,
          title: fav.service?.title || 'Unknown Service',
          description: fav.service?.description || '',
          price: fav.service?.price || 0,
          providerId: fav.service?.provider_id || '',
          providerName: fav.service?.provider_name || 'Unknown Provider',
          categoryId: fav.service?.category || '',
          imageUrl: fav.service?.image || undefined,
          rating: fav.service?.rating || 0,
          reviewCount: fav.service?.review_count || 0
        };
      }

      return {
        id: fav.id,
        userId: fav.user_id,
        serviceId: fav.service_id,
        createdAt: new Date(fav.created_at),
        service
      };
    });
  } catch (error) {
    console.error('Error in fetchUserFavorites:', error);
    toast.error('Failed to load favorites');
    return [];
  }
}

export async function addFavorite(userId: string, serviceId: string): Promise<boolean> {
  try {
    const { count, error: countError } = await supabase
      .from('favorite_services')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('service_id', serviceId);

    if (countError) {
      console.error('Error checking existing favorite:', countError);
      toast.error('Failed to add to favorites');
      return false;
    }

    if (count && count > 0) {
      toast.info('Service is already in your favorites');
      return true;
    }

    const { error } = await supabase
      .from('favorite_services')
      .insert([{
        user_id: userId,
        service_id: serviceId
      }]);

    if (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add to favorites');
      return false;
    }

    toast.success('Added to favorites');
    return true;
  } catch (error) {
    console.error('Error in addFavorite:', error);
    toast.error('Failed to add to favorites');
    return false;
  }
}

export async function removeFavorite(userId: string, serviceId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('favorite_services')
      .delete()
      .eq('user_id', userId)
      .eq('service_id', serviceId);

    if (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
      return false;
    }

    toast.success('Removed from favorites');
    return true;
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    toast.error('Failed to remove from favorites');
    return false;
  }
}

export function formatFavorites(favorites: any[]) {
  if (!favorites || !Array.isArray(favorites)) return [];
  
  return favorites.map(fav => {
    return {
      id: fav.id,
      userId: fav.user_id,
      serviceId: fav.service_id,
      createdAt: fav.created_at,
      service: fav.service ? {
        id: fav.service?.id,
        title: fav.service?.title,
        description: fav.service?.description,
        price: fav.service?.price,
        location: fav.service?.location,
        image: fav.service?.image,
        category: fav.service?.category,
        isActive: fav.service?.is_active,
        providerId: fav.service?.provider_id,
        pricingModel: fav.service?.pricing_model,
        createdAt: fav.service?.created_at,
        updatedAt: fav.service?.updated_at
      } : null
    };
  });
}

export async function getFavoriteServices(userId: string): Promise<any[]> {
  try {
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorite_services')
      .select(`
        id,
        service:service_id (
          id,
          title,
          description,
          price,
          image,
          category,
          provider_id
        )
      `)
      .eq('user_id', userId);

    if (favoritesError) {
      console.error('Error fetching favorite services:', favoritesError);
      return [];
    }

    const formattedFavorites = favorites
      .filter(fav => fav.service !== null) // Filter out any null services
      .map((fav) => ({
        id: fav.id,
        serviceId: fav.service?.id || '',
        title: fav.service?.title || '',
        description: fav.service?.description || '',
        price: fav.service?.price || 0,
        image: fav.service?.image || '',
        category: fav.service?.category || '',
        providerId: fav.service?.provider_id || '',
      }));

    return formattedFavorites;
  } catch (error) {
    console.error('Error in getFavoriteServices:', error);
    return [];
  }
}
