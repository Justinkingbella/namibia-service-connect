
import { supabase } from '@/integrations/supabase/client';
import { DbUserProfile, UserAddress, PaymentMethod, User2FA } from '@/types/auth';
import { FavoriteService } from '@/types/favorites';
import { PaymentHistory, Dispute } from '@/types/payments';
import { Message } from '@/types/message';

// Fetch user profile
export const fetchUserProfile = async (userId: string): Promise<DbUserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  // Cast to DbUserProfile to handle the role type
  return data as DbUserProfile;
};

// Update user profile
export const updateUserProfile = async (userId: string, profile: Partial<DbUserProfile>): Promise<DbUserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  // Cast to DbUserProfile to handle the role type
  return data as DbUserProfile;
};

// Update user password
export const updateUserPassword = async (newPassword: string): Promise<boolean> => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error('Error updating password:', error);
    return false;
  }

  return true;
};

// Fetch user addresses
export const fetchUserAddresses = async (userId: string): Promise<UserAddress[]> => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error) {
    console.error('Error fetching user addresses:', error);
    return [];
  }

  // Use type assertion for data conversion
  return data.map(address => ({
    id: address.id as string,
    userId: address.user_id as string,
    name: address.name as string,
    street: address.street as string,
    city: address.city as string,
    region: address.region as string,
    postalCode: address.postal_code as string,
    country: address.country as string,
    isDefault: address.is_default as boolean,
    createdAt: address.created_at as string
  }));
};

// Add user address
export const addUserAddress = async (userId: string, address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>): Promise<UserAddress | null> => {
  const { data, error } = await supabase
    .from('user_addresses')
    .insert({
      user_id: userId,
      name: address.name,
      street: address.street,
      city: address.city,
      region: address.region,
      postal_code: address.postalCode,
      country: address.country,
      is_default: address.isDefault
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding user address:', error);
    return null;
  }

  // Use type assertion for data conversion
  return {
    id: data.id as string,
    userId: data.user_id as string,
    name: data.name as string,
    street: data.street as string,
    city: data.city as string,
    region: data.region as string,
    postalCode: data.postal_code as string,
    country: data.country as string,
    isDefault: data.is_default as boolean,
    createdAt: data.created_at as string
  };
};

// Update user address
export const updateUserAddress = async (addressId: string, address: Partial<Omit<UserAddress, 'id' | 'userId' | 'createdAt'>>): Promise<boolean> => {
  const updateData: any = {};
  if (address.name) updateData.name = address.name;
  if (address.street) updateData.street = address.street;
  if (address.city) updateData.city = address.city;
  if (address.region) updateData.region = address.region;
  if (address.postalCode) updateData.postal_code = address.postalCode;
  if (address.country) updateData.country = address.country;
  if (address.isDefault !== undefined) updateData.is_default = address.isDefault;

  const { error } = await supabase
    .from('user_addresses')
    .update(updateData)
    .eq('id', addressId);

  if (error) {
    console.error('Error updating user address:', error);
    return false;
  }

  return true;
};

// Delete user address
export const deleteUserAddress = async (addressId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    console.error('Error deleting user address:', error);
    return false;
  }

  return true;
};

// Fetch user payment methods
export const fetchUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }

  // Use type assertion for data conversion
  return data.map(pm => ({
    id: pm.id as string,
    userId: pm.user_id as string,
    type: pm.type as string,
    name: pm.name as string,
    details: pm.details as Record<string, any>,
    isDefault: pm.is_default as boolean,
    createdAt: pm.created_at as string
  }));
};

// Add payment method
export const addPaymentMethod = async (userId: string, paymentMethod: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>): Promise<PaymentMethod | null> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: userId,
      type: paymentMethod.type,
      name: paymentMethod.name,
      details: paymentMethod.details,
      is_default: paymentMethod.isDefault
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding payment method:', error);
    return null;
  }

  // Use type assertion for data conversion
  return {
    id: data.id as string,
    userId: data.user_id as string,
    type: data.type as string,
    name: data.name as string,
    details: data.details as Record<string, any>,
    isDefault: data.is_default as boolean,
    createdAt: data.created_at as string
  };
};

// Delete payment method
export const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', paymentMethodId);

  if (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }

  return true;
};

// Set payment method as default
export const setDefaultPaymentMethod = async (paymentMethodId: string, userId: string): Promise<boolean> => {
  // First reset all payment methods to non-default
  const { error: resetError } = await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId);

  if (resetError) {
    console.error('Error resetting default payment methods:', resetError);
    return false;
  }

  // Then set the selected one as default
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', paymentMethodId);

  if (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }

  return true;
};

// Fetch user 2FA status
export const fetchUser2FAStatus = async (userId: string): Promise<User2FA | null> => {
  const { data, error } = await supabase
    .from('user_2fa')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching 2FA status:', error);
    return null;
  }

  if (!data) {
    // Create a new 2FA record if none exists
    const { data: newData, error: newError } = await supabase
      .from('user_2fa')
      .insert({
        user_id: userId,
        is_enabled: false
      })
      .select()
      .single();

    if (newError) {
      console.error('Error creating 2FA record:', newError);
      return null;
    }

    // Use type assertion for data conversion
    return {
      id: newData.id as string,
      userId: newData.user_id as string,
      isEnabled: newData.is_enabled as boolean,
      secret: newData.secret as string | undefined,
      backupCodes: newData.backup_codes as string[] | undefined,
      createdAt: newData.created_at as string
    };
  }

  // Use type assertion for data conversion
  return {
    id: data.id as string,
    userId: data.user_id as string,
    isEnabled: data.is_enabled as boolean,
    secret: data.secret as string | undefined,
    backupCodes: data.backup_codes as string[] | undefined,
    createdAt: data.created_at as string
  };
};

// Enable 2FA
export const enable2FA = async (userId: string, secret: string, backupCodes: string[]): Promise<boolean> => {
  const { error } = await supabase
    .from('user_2fa')
    .update({
      is_enabled: true,
      secret,
      backup_codes: backupCodes
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error enabling 2FA:', error);
    return false;
  }

  return true;
};

// Disable 2FA
export const disable2FA = async (userId: string): Promise<boolean> => {
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
    return false;
  }

  return true;
};

// Fetch user payment history
export const fetchPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
  const { data, error } = await supabase
    .from('payment_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }

  // Use type assertion for data conversion
  return data.map(payment => ({
    id: payment.id as string,
    userId: payment.user_id as string,
    bookingId: payment.booking_id as string | undefined,
    amount: payment.amount as number,
    description: payment.description as string,
    paymentMethod: payment.payment_method as string,
    status: payment.status as string,
    transactionId: payment.transaction_id as string | undefined,
    createdAt: payment.created_at as string
  }));
};

// Fetch user disputes
export const fetchUserDisputes = async (userId: string): Promise<Dispute[]> => {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .or(`customer_id.eq.${userId},provider_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching disputes:', error);
    return [];
  }

  // Use type assertion for data conversion
  return data.map(dispute => ({
    id: dispute.id as string,
    bookingId: dispute.booking_id as string,
    customerId: dispute.customer_id as string,
    providerId: dispute.provider_id as string,
    subject: dispute.subject as string,
    description: dispute.description as string,
    status: dispute.status as string,
    resolution: dispute.resolution as string | undefined,
    adminNotes: dispute.admin_notes as string | undefined,
    createdAt: dispute.created_at as string,
    updatedAt: dispute.updated_at as string
  }));
};

// Create dispute
export const createDispute = async (dispute: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dispute | null> => {
  const { data, error } = await supabase
    .from('disputes')
    .insert({
      booking_id: dispute.bookingId,
      customer_id: dispute.customerId,
      provider_id: dispute.providerId,
      subject: dispute.subject,
      description: dispute.description,
      status: dispute.status || 'pending',
      resolution: dispute.resolution,
      admin_notes: dispute.adminNotes
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating dispute:', error);
    return null;
  }

  // Use type assertion for data conversion
  return {
    id: data.id as string,
    bookingId: data.booking_id as string,
    customerId: data.customer_id as string,
    providerId: data.provider_id as string,
    subject: data.subject as string,
    description: data.description as string,
    status: data.status as string,
    resolution: data.resolution as string | undefined,
    adminNotes: data.admin_notes as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  };
};

// Fetch user favorites
export const fetchUserFavorites = async (userId: string): Promise<FavoriteService[]> => {
  const { data, error } = await supabase
    .from('favorite_services')
    .select(`
      *,
      service:service_id (*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  // Use type assertion for data conversion
  return data.map(favorite => ({
    id: favorite.id as string,
    userId: favorite.user_id as string,
    serviceId: favorite.service_id as string,
    createdAt: favorite.created_at as string,
    service: favorite.service ? {
      id: favorite.service.id as string,
      title: favorite.service.title as string,
      category: favorite.service.category as string,
      pricingModel: favorite.service.pricing_model as string,
      price: favorite.service.price as number,
      providerName: favorite.service.provider_name || '',
      providerId: favorite.service.provider_id as string,
      rating: favorite.service.rating || 0,
      reviewCount: favorite.service.review_count || 0,
      image: favorite.service.image || '/placeholder.svg',
      location: favorite.service.location || '',
      description: favorite.service.description || ''
    } : undefined
  }));
};

// Add favorite
export const addFavorite = async (userId: string, serviceId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('favorite_services')
    .insert({
      user_id: userId,
      service_id: serviceId
    });

  if (error) {
    console.error('Error adding favorite:', error);
    return false;
  }

  return true;
};

// Remove favorite
export const removeFavorite = async (userId: string, serviceId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('favorite_services')
    .delete()
    .eq('user_id', userId)
    .eq('service_id', serviceId);

  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }

  return true;
};

// Fetch user messages
export const fetchUserMessages = async (userId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  // Use type assertion for data conversion
  return data.map(message => ({
    id: message.id as string,
    conversationId: `${message.sender_id}_${message.recipient_id}`,
    senderId: message.sender_id as string,
    text: message.content as string,
    timestamp: new Date(message.created_at as string),
    isRead: message.read as boolean,
    attachments: message.attachments as string[] | undefined
  }));
};

// Send message
export const sendMessage = async (senderId: string, recipientId: string, content: string, attachments?: string[]): Promise<boolean> => {
  const { error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      read: false,
      attachments
    });

  if (error) {
    console.error('Error sending message:', error);
    return false;
  }

  return true;
};

// Mark message as read
export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);

  if (error) {
    console.error('Error marking message as read:', error);
    return false;
  }

  return true;
};
