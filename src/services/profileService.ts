
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

  return data;
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

  return data;
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

  return data.map(pm => ({
    id: pm.id,
    userId: pm.user_id,
    type: pm.type,
    name: pm.name,
    details: pm.details,
    isDefault: pm.is_default,
    createdAt: pm.created_at
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

  return {
    id: data.id,
    userId: data.user_id,
    type: data.type,
    name: data.name,
    details: data.details,
    isDefault: data.is_default,
    createdAt: data.created_at
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

    return {
      id: newData.id,
      userId: newData.user_id,
      isEnabled: newData.is_enabled,
      secret: newData.secret,
      backupCodes: newData.backup_codes,
      createdAt: newData.created_at
    };
  }

  return {
    id: data.id,
    userId: data.user_id,
    isEnabled: data.is_enabled,
    secret: data.secret,
    backupCodes: data.backup_codes,
    createdAt: data.created_at
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

  return data.map(payment => ({
    id: payment.id,
    userId: payment.user_id,
    bookingId: payment.booking_id,
    amount: payment.amount,
    description: payment.description,
    paymentMethod: payment.payment_method,
    status: payment.status,
    transactionId: payment.transaction_id,
    createdAt: payment.created_at
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

  return data.map(dispute => ({
    id: dispute.id,
    bookingId: dispute.booking_id,
    customerId: dispute.customer_id,
    providerId: dispute.provider_id,
    subject: dispute.subject,
    description: dispute.description,
    status: dispute.status,
    resolution: dispute.resolution,
    adminNotes: dispute.admin_notes,
    createdAt: dispute.created_at,
    updatedAt: dispute.updated_at
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

  return {
    id: data.id,
    bookingId: data.booking_id,
    customerId: data.customer_id,
    providerId: data.provider_id,
    subject: data.subject,
    description: data.description,
    status: data.status,
    resolution: data.resolution,
    adminNotes: data.admin_notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
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

  return data.map(favorite => ({
    id: favorite.id,
    userId: favorite.user_id,
    serviceId: favorite.service_id,
    createdAt: favorite.created_at,
    service: favorite.service ? {
      id: favorite.service.id,
      title: favorite.service.title,
      category: favorite.service.category,
      pricingModel: favorite.service.pricing_model,
      price: favorite.service.price,
      providerName: favorite.service.provider_name || '',
      providerId: favorite.service.provider_id,
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

  return data.map(message => ({
    id: message.id,
    conversationId: `${message.sender_id}_${message.recipient_id}`,
    senderId: message.sender_id,
    text: message.content,
    timestamp: new Date(message.created_at),
    isRead: message.read,
    attachments: message.attachments
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
