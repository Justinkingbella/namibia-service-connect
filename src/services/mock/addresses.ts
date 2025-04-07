
import { UserAddress } from '@/types';

// Mock user addresses with correct property names
export const mockUserAddresses: UserAddress[] = [
  {
    id: '1',
    user_id: 'user123',
    street: '123 Main St',
    city: 'Windhoek',
    state: 'Khomas',
    postal_code: '10001',
    country: 'Namibia',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user123',
    street: '456 Business Ave',
    city: 'Swakopmund',
    state: 'Erongo',
    postal_code: '20002',
    country: 'Namibia',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Function to get user addresses
export const getUserAddresses = async (userId: string): Promise<UserAddress[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUserAddresses.filter(address => address.user_id === userId);
};

// Function to create a new address
export const createUserAddress = async (addressData: Partial<UserAddress>): Promise<UserAddress> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create new address with proper property names
  const newAddress: UserAddress = {
    id: `address-${Date.now()}`,
    user_id: addressData.user_id || 'user123',
    street: addressData.street || '',
    city: addressData.city || '',
    state: addressData.state || '',
    postal_code: addressData.postal_code || '',
    country: addressData.country || 'Namibia',
    is_default: addressData.is_default || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // In a real app, you'd save to DB here
  
  return newAddress;
};
