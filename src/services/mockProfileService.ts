
import { Dispute } from '@/types/booking';
import { PaymentHistory } from '@/types/payments';
import { UserAddress } from '@/types/auth';
import { Message } from '@/types/conversations';

// Mock data
const mockAddresses: UserAddress[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Home',
    street: '123 Main St',
    city: 'Windhoek',
    region: 'Khomas',
    postalCode: '10001',
    country: 'Namibia',
    isDefault: true,
    createdAt: new Date()
  }
];

// Mock functions for useAddresses
export const fetchUserAddresses = async (userId: string): Promise<UserAddress[]> => {
  return mockAddresses.filter(addr => addr.userId === userId);
};

export const addUserAddress = async (address: Partial<UserAddress>): Promise<UserAddress> => {
  const newAddress: UserAddress = {
    id: Date.now().toString(),
    userId: address.userId || '',
    name: address.name || 'Default',
    street: address.street || '',
    city: address.city || '',
    region: address.region,
    postalCode: address.postalCode,
    country: address.country || 'Namibia',
    isDefault: address.isDefault || false,
    createdAt: new Date()
  };
  
  mockAddresses.push(newAddress);
  return newAddress;
};

export const updateUserAddress = async (addressId: string, data: Partial<UserAddress>): Promise<UserAddress> => {
  const index = mockAddresses.findIndex(addr => addr.id === addressId);
  if (index === -1) throw new Error('Address not found');
  
  mockAddresses[index] = { ...mockAddresses[index], ...data };
  return mockAddresses[index];
};

export const deleteUserAddress = async (addressId: string): Promise<void> => {
  const index = mockAddresses.findIndex(addr => addr.id === addressId);
  if (index === -1) throw new Error('Address not found');
  
  mockAddresses.splice(index, 1);
};

// Mock functions for useFavorites
export const fetchUserFavorites = async (userId: string): Promise<any[]> => {
  return [];
};

export const addFavorite = async (userId: string, serviceId: string): Promise<boolean> => {
  return true;
};

export const removeFavorite = async (userId: string, serviceId: string): Promise<boolean> => {
  return true;
};

// Mock functions for useMessages
export const fetchUserMessages = async (conversationId: string): Promise<Message[]> => {
  return [];
};

export const sendMessage = async (message: Partial<Message>): Promise<Message> => {
  return {
    id: Date.now().toString(),
    conversationId: message.conversationId || '',
    senderId: message.senderId || '',
    content: message.content || '',
    createdAt: new Date(),
    isRead: false,
    ...message
  };
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  return true;
};
