import { Dispute } from '@/types/booking';
import { PaymentHistory } from '@/types/payments';
import { UserAddress } from '@/types/auth';
import { Message } from '@/types/conversations';

// Mock data
const mockAddresses: UserAddress[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'Home',
    street: '123 Main St',
    city: 'Windhoek',
    region: 'Khomas',
    postal_code: '10001',
    country: 'Namibia',
    is_default: true,
    createdAt: new Date()
  }
];

// Mock dispute data
const mockDisputes: Dispute[] = [
  {
    id: '1',
    bookingId: 'B1001',
    customerId: 'C1',
    providerId: 'P1',
    subject: 'Service not completed',
    description: 'The cleaning service was not completed as agreed.',
    status: 'pending',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    priority: 'high',
    evidenceUrls: ['https://example.com/evidence1.jpg'],
    refundAmount: 150,
    reason: 'incomplete_service'
  },
  {
    id: '2',
    bookingId: 'B1002',
    customerId: 'C1',
    providerId: 'P2',
    subject: 'Damaged property',
    description: 'My furniture was damaged during the service.',
    status: 'in_review',
    resolution: 'We are investigating the damage claim',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    evidenceUrls: ['https://example.com/evidence2.jpg', 'https://example.com/evidence3.jpg'],
    refundAmount: 75,
    reason: 'property_damage'
  },
  {
    id: '3',
    bookingId: 'B1003',
    customerId: 'C2',
    providerId: 'P1',
    subject: 'Late arrival',
    description: 'Service provider arrived 2 hours late without notice.',
    status: 'resolved',
    resolution: 'Issued a partial refund for the inconvenience',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    priority: 'low',
    refundAmount: 50,
    reason: 'late_service'
  }
];

// Mock functions for useAddresses
export const fetchUserAddresses = async (userId: string): Promise<UserAddress[]> => {
  return mockAddresses.filter(addr => addr.user_id === userId);
};

export const addUserAddress = async (address: Partial<UserAddress>): Promise<UserAddress> => {
  const newAddress: UserAddress = {
    id: Date.now().toString(),
    user_id: address.user_id || '',
    name: address.name || 'Default',
    street: address.street || '',
    city: address.city || '',
    region: address.region,
    postal_code: address.postal_code,
    country: address.country || 'Namibia',
    is_default: address.is_default || false,
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
    read: false,
    ...message
  };
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  return true;
};

// Mock functions for disputes
export const fetchUserDisputes = async (userId: string): Promise<Dispute[]> => {
  // Return disputes where the user is the customer
  return mockDisputes.filter(dispute => dispute.customerId === userId);
};

export const fetchProviderDisputes = async (providerId: string): Promise<Dispute[]> => {
  // Return disputes where the user is the provider
  return mockDisputes.filter(dispute => dispute.providerId === providerId);
};

export const fetchAllDisputes = async (): Promise<Dispute[]> => {
  // Return all disputes (for admin)
  return mockDisputes;
};

export const createDispute = async (disputeData: Partial<Dispute>): Promise<boolean> => {
  const newDispute: Dispute = {
    id: Date.now().toString(),
    bookingId: disputeData.bookingId || '',
    customerId: disputeData.customerId || '',
    providerId: disputeData.providerId || '',
    subject: disputeData.subject || '',
    description: disputeData.description || '',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: disputeData.priority || 'medium',
    evidenceUrls: disputeData.evidenceUrls || [],
    refundAmount: disputeData.refundAmount,
    reason: disputeData.reason
  };
  
  mockDisputes.push(newDispute);
  return true;
};

export const updateDisputeStatus = async (disputeId: string, status: string, resolution?: string): Promise<boolean> => {
  const index = mockDisputes.findIndex(dispute => dispute.id === disputeId);
  if (index === -1) return false;
  
  mockDisputes[index] = { 
    ...mockDisputes[index], 
    status: status as Dispute['status'], 
    resolution,
    updatedAt: new Date() 
  };
  
  return true;
};

export const fetchDisputeById = async (disputeId: string): Promise<Dispute | null> => {
  const dispute = mockDisputes.find(d => d.id === disputeId);
  return dispute || null;
};
