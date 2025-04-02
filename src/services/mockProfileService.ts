
// This file contains mock implementations of profile service functions
// that are referenced by hooks but not yet implemented

import { toast } from 'sonner';
import { User2FA, UserAddress, PaymentMethod } from '@/types/auth';
import { Dispute, PaymentHistory } from '@/types/payments';
import { Message } from '@/types/message';
import { FavoriteService } from '@/types/favorites';

// 2FA functions
export async function fetchUser2FAStatus(userId: string): Promise<User2FA | null> {
  console.log('Mock fetchUser2FAStatus called for user:', userId);
  return {
    userId,
    isEnabled: false
  };
}

export async function enable2FA(userId: string, secret: string, backupCodes: string[]): Promise<boolean> {
  console.log('Mock enable2FA called:', { userId, secret, backupCodes });
  return true;
}

export async function disable2FA(userId: string): Promise<boolean> {
  console.log('Mock disable2FA called for user:', userId);
  return true;
}

// Address functions
export async function fetchUserAddresses(userId: string): Promise<UserAddress[]> {
  console.log('Mock fetchUserAddresses called for user:', userId);
  return [];
}

export async function addUserAddress(userId: string, address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>): Promise<UserAddress | null> {
  console.log('Mock addUserAddress called:', { userId, address });
  return {
    id: 'mock-address-id',
    userId,
    ...address,
    createdAt: new Date()
  };
}

export async function updateUserAddress(addressId: string, data: Partial<Omit<UserAddress, 'id' | 'userId' | 'createdAt'>>): Promise<boolean> {
  console.log('Mock updateUserAddress called:', { addressId, data });
  return true;
}

export async function deleteUserAddress(addressId: string): Promise<boolean> {
  console.log('Mock deleteUserAddress called for address:', addressId);
  return true;
}

// Dispute functions
export async function fetchUserDisputes(userId: string): Promise<Dispute[]> {
  console.log('Mock fetchUserDisputes called for user:', userId);
  return [];
}

export async function createDispute(data: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dispute | null> {
  console.log('Mock createDispute called with data:', data);
  return {
    id: 'mock-dispute-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data
  };
}

// Favorites functions
export async function fetchUserFavorites(userId: string): Promise<FavoriteService[]> {
  console.log('Mock fetchUserFavorites called for user:', userId);
  return [];
}

export async function addFavorite(userId: string, serviceId: string): Promise<boolean> {
  console.log('Mock addFavorite called:', { userId, serviceId });
  return true;
}

export async function removeFavorite(userId: string, serviceId: string): Promise<boolean> {
  console.log('Mock removeFavorite called:', { userId, serviceId });
  return true;
}

// Messages functions
export async function fetchUserMessages(userId: string): Promise<Message[]> {
  console.log('Mock fetchUserMessages called for user:', userId);
  return [];
}

export async function sendMessage(
  senderId: string, 
  recipientId: string, 
  content: string, 
  attachments?: string[]
): Promise<boolean> {
  console.log('Mock sendMessage called:', { senderId, recipientId, content, attachments });
  return true;
}

export async function markMessageAsRead(messageId: string): Promise<boolean> {
  console.log('Mock markMessageAsRead called for message:', messageId);
  return true;
}

// Payment history functions
export async function fetchPaymentHistory(userId: string): Promise<PaymentHistory[]> {
  console.log('Mock fetchPaymentHistory called for user:', userId);
  return [];
}

// Payment methods functions
export async function fetchUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  console.log('Mock fetchUserPaymentMethods called for user:', userId);
  return [];
}

export async function addPaymentMethod(userId: string, method: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>): Promise<PaymentMethod | null> {
  console.log('Mock addPaymentMethod called:', { userId, method });
  return {
    id: 'mock-payment-method-id',
    userId,
    createdAt: new Date(),
    ...method
  };
}

export async function deletePaymentMethod(methodId: string): Promise<boolean> {
  console.log('Mock deletePaymentMethod called for method:', methodId);
  return true;
}

export async function setDefaultPaymentMethod(methodId: string, userId: string): Promise<boolean> {
  console.log('Mock setDefaultPaymentMethod called:', { methodId, userId });
  return true;
}

// Password functions
export async function updateUserPassword(newPassword: string): Promise<boolean> {
  console.log('Mock updateUserPassword called');
  return true;
}
