
import { User, UserRole, Customer, Provider } from '@/types';

// Mock customer profile
export const mockCustomerProfile: Customer = {
  id: 'user123',
  email: 'customer@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'customer' as UserRole,
  phoneNumber: '+264 81 123 4567',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  emailVerified: true,
  preferredCategories: ['CLEANING', 'PLUMBING', 'ELECTRICAL'],
  savedServices: ['service1', 'service2'],
  address: '123 Main St, Windhoek',
  city: 'Windhoek',
  country: 'Namibia',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  birthDate: '1990-01-01',
  bio: 'Regular customer looking for home maintenance services.',
  loyaltyPoints: 150,
  notificationPreferences: {
    email: true,
    sms: false,
    push: true
  }
};

// Mock provider profile
export const mockProviderProfile: Provider = {
  id: 'provider123',
  email: 'provider@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  role: 'provider' as UserRole,
  phoneNumber: '+264 81 987 6543',
  avatarUrl: 'https://i.pravatar.cc/150?img=2',
  emailVerified: true,
  businessName: 'Jane\'s Cleaning Services',
  businessDescription: 'Professional cleaning services for homes and offices.',
  categories: ['CLEANING', 'HOUSEKEEPING'],
  services: ['service1', 'service2', 'service3'],
  rating: 4.8,
  commission: 10,
  verificationStatus: 'verified',
  bannerUrl: 'https://example.com/banner.jpg',
  website: 'https://janescleaningservices.com',
  taxId: 'TAX123456',
  reviewCount: 32,
  address: '456 Business Ave, Windhoek',
  city: 'Windhoek',
  country: 'Namibia',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  subscriptionTier: 'premium',
  isVerified: true,
  bankDetails: {
    bankName: 'First National Bank',
    accountNumber: '12345678',
    accountType: 'Business'
  }
};
