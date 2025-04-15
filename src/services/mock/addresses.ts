
import { UserAddress } from '@/types/auth';

// Mock addresses for testing
export const mockAddresses: UserAddress[] = [
  {
    id: 'addr1',
    name: 'Home',
    street: '123 Main Street',
    city: 'Windhoek',
    region: 'Khomas',
    postalCode: '10001',
    country: 'Namibia',
    userId: 'user1',
    isDefault: true,
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-01-15T08:30:00Z'
  },
  {
    id: 'addr2',
    name: 'Work',
    street: '456 Business Avenue',
    city: 'Swakopmund',
    region: 'Erongo',
    postalCode: '10002',
    country: 'Namibia',
    userId: 'user1',
    isDefault: false,
    createdAt: '2023-01-20T10:15:00Z',
    updatedAt: '2023-01-20T10:15:00Z'
  }
];

/**
 * Get all addresses for a user
 */
export const getUserAddresses = (userId: string): UserAddress[] => {
  return mockAddresses.filter(address => address.userId === userId);
};

/**
 * Get default address for a user
 */
export const getDefaultAddress = (userId: string): UserAddress | undefined => {
  return mockAddresses.find(address => address.userId === userId && address.isDefault);
};

/**
 * Add a new address for a user
 */
export const addAddress = (address: Partial<UserAddress>, userId: string): UserAddress => {
  const newAddress: UserAddress = {
    id: `addr${Date.now()}`,
    userId: userId,
    name: address.name || 'New Address',
    street: address.street || '',
    city: address.city || '',
    region: address.region || '',
    postalCode: address.postalCode || '',
    country: address.country || 'Namibia',
    isDefault: address.isDefault || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockAddresses.push(newAddress);
  return newAddress;
};
