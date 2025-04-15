
import { UserAddress } from '@/types';

// Sample user addresses
export const userAddresses: UserAddress[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Home',
    street: '123 Main Street',
    city: 'Windhoek',
    region: 'Khomas',
    postalCode: '9000',
    country: 'Namibia',
    isDefault: true
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Work',
    street: '456 Business Avenue',
    city: 'Windhoek',
    region: 'Khomas',
    postalCode: '9001',
    country: 'Namibia',
    isDefault: false
  }
];

// Function to get addresses by user ID
export const getAddressesByUserId = (userId: string): UserAddress[] => {
  return userAddresses.filter(address => address.userId === userId);
};

// Function to get default address for a user
export const getDefaultAddress = (userId: string): UserAddress | undefined => {
  return userAddresses.find(address => address.userId === userId && address.isDefault);
};

// Function to add a new address
export const addAddress = (address: Partial<UserAddress>): UserAddress => {
  const newAddress: UserAddress = {
    id: `addr_${Date.now()}`,
    userId: address.userId || '',
    name: address.name || 'New Address',
    street: address.street || '',
    city: address.city || '',
    region: address.region || '',
    postalCode: address.postalCode || '',
    country: address.country || 'Namibia',
    isDefault: address.isDefault || false
  };
  
  userAddresses.push(newAddress);
  return newAddress;
};

// Function to update an existing address
export const updateAddress = (id: string, address: Partial<UserAddress>): UserAddress | undefined => {
  const index = userAddresses.findIndex(addr => addr.id === id);
  if (index !== -1) {
    userAddresses[index] = { ...userAddresses[index], ...address };
    return userAddresses[index];
  }
  return undefined;
};

// Function to delete an address
export const deleteAddress = (id: string): boolean => {
  const index = userAddresses.findIndex(addr => addr.id === id);
  if (index !== -1) {
    userAddresses.splice(index, 1);
    return true;
  }
  return false;
};

// Function to set an address as default
export const setDefaultAddress = (userId: string, addressId: string): boolean => {
  const userAddrs = userAddresses.filter(addr => addr.userId === userId);
  
  for (const addr of userAddrs) {
    addr.isDefault = addr.id === addressId;
  }
  
  return true;
};
