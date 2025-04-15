
import { Customer, Provider } from '@/types';

export const mockCustomers: Customer[] = [
  {
    id: 'c123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+264811234567',
    avatarUrl: '/placeholder.svg',
    createdAt: '2023-01-15T10:30:00Z',
    role: 'customer',
    preferredCategories: ['CLEANING', 'GARDENING'],
    savedServices: ['svc1', 'svc2'],
    address: '123 Main St',
    city: 'Windhoek',
    country: 'Namibia',
    active: true, // Use active instead of isActive
  },
  {
    id: 'c456',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+264817654321',
    avatarUrl: '/placeholder.svg',
    createdAt: '2023-02-20T14:45:00Z',
    role: 'customer',
    preferredCategories: ['ELECTRICAL', 'PLUMBING'],
    savedServices: [],
    address: '456 Oak Avenue',
    city: 'Swakopmund',
    country: 'Namibia',
    active: true, // Use active instead of isActive
  }
];

export const mockProviders: Provider[] = [
  {
    id: 'p123',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael@repairpro.com',
    phoneNumber: '+264813334444',
    role: 'provider',
    businessName: 'RepairPro Services',
    businessDescription: 'Professional repair services for your home and office',
    rating: 4.8,
    ratingCount: 56,
    avatarUrl: '/placeholder.svg',
    bannerUrl: '/placeholder.svg',
    verificationStatus: 'verified',
    address: '789 Business Park',
    city: 'Windhoek',
    country: 'Namibia',
    createdAt: '2022-12-10T09:15:00Z',
    completedBookings: 78,
    serviceCount: 5,
    commissionRate: 10,
    active: true, // Use active instead of isActive
    subscriptionTier: 'premium',
    categories: ['ELECTRICAL', 'PLUMBING']
  }
];

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.id === id);
};

export const getProviderById = (id: string): Provider | undefined => {
  return mockProviders.find(provider => provider.id === id);
};

export const getMockAddressByUserId = (userId: string) => {
  const customer = mockCustomers.find(c => c.id === userId);
  if (customer) {
    return {
      street: customer.address,
      city: customer.city,
      country: customer.country
    };
  }
  
  const provider = mockProviders.find(p => p.id === userId);
  if (provider) {
    return {
      street: provider.address,
      city: provider.city,
      country: provider.country
    };
  }
  
  return null;
};
