
import { Message } from '@/types/message';
import { Dispute, DisputeStatus } from '@/types/booking';
import { PaymentMethod, UserAddress } from '@/types/auth';
import { PaymentHistory } from '@/types/payments';
import { FavoriteService } from '@/types/favorites';

// Change dispute status from 'pending' to 'open' to match the Dispute type
export async function fetchUserDisputes(userId: string): Promise<Dispute[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock disputes for the user
  return [
    {
      id: 'disp_001',
      bookingId: 'book_001',
      customerId: userId,
      providerId: 'prov_001',
      status: 'open', // Changed from 'pending' to 'open'
      reason: 'Service not completed',
      description: 'The cleaning service was not completed as agreed. Several areas were left untouched.',
      evidenceUrls: ['https://example.com/image1.jpg'],
      resolution: '',
      createdAt: new Date(Date.now() - 604800000), // 7 days ago
      updatedAt: new Date(Date.now() - 604800000)
    },
    {
      id: 'disp_002',
      bookingId: 'book_002',
      customerId: userId,
      providerId: 'prov_002',
      status: 'resolved',
      reason: 'Overcharged for service',
      description: 'The final amount charged was higher than the quoted price without prior notification.',
      evidenceUrls: ['https://example.com/receipt.jpg'],
      resolution: 'Provider has agreed to refund the difference. A credit of N$150 has been issued to your account.',
      createdAt: new Date(Date.now() - 1209600000), // 14 days ago
      updatedAt: new Date(Date.now() - 864000000) // 10 days ago
    },
    {
      id: 'disp_003',
      bookingId: 'book_003',
      customerId: userId,
      providerId: 'prov_003',
      status: 'under_review',
      reason: 'Service quality issue',
      description: 'The plumbing repair was done but started leaking again within a day.',
      evidenceUrls: ['https://example.com/leak.jpg', 'https://example.com/leak2.jpg'],
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      updatedAt: new Date(Date.now() - 172800000) // 2 days ago
    }
  ];
}

export async function createDispute(disputeData: Partial<Dispute>): Promise<Dispute> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a new dispute with the provided data and some defaults
  const newDispute: Dispute = {
    id: `disp_${Math.random().toString(36).substring(2, 9)}`,
    bookingId: disputeData.bookingId || '',
    customerId: disputeData.customerId || '',
    providerId: disputeData.providerId || 'prov_unknown',
    status: 'open', // Changed from 'pending' to 'open'
    reason: disputeData.reason || disputeData.subject || 'Unspecified issue',
    description: disputeData.description || '',
    evidenceUrls: disputeData.evidenceUrls || [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Return the created dispute
  return newDispute;
}

// Mock favorites data
const mockFavorites = new Map();

// Fetch user favorites
export async function fetchUserFavorites(userId: string): Promise<FavoriteService[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!mockFavorites.has(userId)) {
    mockFavorites.set(userId, []);
  }
  
  return mockFavorites.get(userId) || [];
}

// Add a service to favorites
export async function addFavorite(userId: string, serviceId: string): Promise<FavoriteService> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (!mockFavorites.has(userId)) {
    mockFavorites.set(userId, []);
  }
  
  const favorites = mockFavorites.get(userId);
  
  // Check if already in favorites
  if (favorites.some(fav => fav.serviceId === serviceId)) {
    return favorites.find(fav => fav.serviceId === serviceId);
  }
  
  // Create new favorite
  const newFavorite: FavoriteService = {
    id: `fav_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    serviceId,
    createdAt: new Date(),
    service: {
      id: serviceId,
      title: `Service ${serviceId}`,
      description: "Service description",
      price: 100,
      pricingModel: "fixed",
      category: "cleaning",
      providerId: "provider_1",
      providerName: "Provider Name",
      features: [],
      image: "/placeholder.svg",
      isActive: true,
      location: "Windhoek, Namibia",
      rating: 4.5,
      reviewCount: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };
  
  favorites.push(newFavorite);
  mockFavorites.set(userId, favorites);
  
  return newFavorite;
}

// Remove a service from favorites
export async function removeFavorite(userId: string, serviceId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (!mockFavorites.has(userId)) {
    return false;
  }
  
  const favorites = mockFavorites.get(userId);
  const updatedFavorites = favorites.filter(fav => fav.serviceId !== serviceId);
  
  mockFavorites.set(userId, updatedFavorites);
  
  return favorites.length !== updatedFavorites.length;
}

// Add the updateUserPassword function
export async function updateUserPassword(newPassword: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful password update
  console.log('Password updated to:', newPassword);
  
  // Return success
  return true;
}

// Add mock functions for user 2FA
export async function fetchUser2FAStatus(userId: string): Promise<{ isEnabled: boolean }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { isEnabled: false };
}

export async function enable2FA(userId: string): Promise<{ secret: string; backupCodes: string[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock secret and backup codes
  const secret = 'ABCDEFGHIJKLMNOP';
  const backupCodes = Array(10).fill(0).map(() => Math.random().toString(36).substring(2, 10));
  
  return { secret, backupCodes };
}

export async function disable2FA(userId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return success
  return true;
}

// Add mock functions for user addresses
export async function fetchUserAddresses(userId: string): Promise<UserAddress[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return mock addresses
  return [
    {
      id: 'addr_001',
      userId,
      name: 'Home',
      street: '123 Main St',
      city: 'Windhoek',
      region: 'Khomas',
      postalCode: '10001',
      country: 'Namibia',
      isDefault: true,
      createdAt: new Date(Date.now() - 2000000000)
    },
    {
      id: 'addr_002',
      userId,
      name: 'Work',
      street: '456 Business Ave',
      city: 'Windhoek',
      region: 'Khomas',
      postalCode: '10002',
      country: 'Namibia',
      isDefault: false,
      createdAt: new Date(Date.now() - 1000000000)
    }
  ];
}

export async function addUserAddress(userId: string, address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>): Promise<UserAddress> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create new address
  const newAddress: UserAddress = {
    id: `addr_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    ...address,
    createdAt: new Date()
  };
  
  return newAddress;
}

export async function updateUserAddress(addressId: string, address: Partial<UserAddress>): Promise<UserAddress> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return updated address
  return {
    id: addressId,
    userId: address.userId || 'user_default',
    name: address.name || 'Updated Address',
    street: address.street || '789 Update St',
    city: address.city || 'Windhoek',
    region: address.region,
    postalCode: address.postalCode,
    country: address.country || 'Namibia',
    isDefault: address.isDefault || false,
    createdAt: address.createdAt || new Date(Date.now() - 500000000)
  };
}

export async function deleteUserAddress(addressId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return success
  return true;
}

// Add mock functions for messages
export async function fetchUserMessages(userId: string, conversationId?: string): Promise<Message[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock messages
  return [
    {
      id: 'msg_001',
      conversationId: conversationId || 'conv_001',
      senderId: 'user_002',
      recipientId: userId,
      content: 'Hello, I have a question about your service.',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000),
      timestamp: new Date(Date.now() - 86400000),
      text: 'Hello, I have a question about your service.'
    },
    {
      id: 'msg_002',
      conversationId: conversationId || 'conv_001',
      senderId: userId,
      recipientId: 'user_002',
      content: 'Sure, how can I help you?',
      isRead: true,
      createdAt: new Date(Date.now() - 82800000),
      timestamp: new Date(Date.now() - 82800000),
      text: 'Sure, how can I help you?'
    },
    {
      id: 'msg_003',
      conversationId: conversationId || 'conv_001',
      senderId: 'user_002',
      recipientId: userId,
      content: 'What are your availability times for next week?',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000),
      timestamp: new Date(Date.now() - 3600000),
      text: 'What are your availability times for next week?'
    }
  ];
}

export async function sendMessage(message: Partial<Message>): Promise<Message> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create and return new message
  const newMessage: Message = {
    id: `msg_${Math.random().toString(36).substring(2, 9)}`,
    conversationId: message.conversationId || `conv_${Math.random().toString(36).substring(2, 9)}`,
    senderId: message.senderId || '',
    recipientId: message.recipientId || '',
    content: message.content || '',
    isRead: false,
    createdAt: new Date(),
    attachments: message.attachments || [],
    timestamp: new Date(),
    text: message.content || ''
  };
  
  return newMessage;
}

export async function markMessageAsRead(messageId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return success
  return true;
}

// Add mock functions for payment methods
export async function fetchUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return mock payment methods
  return [
    {
      id: 'pm_001',
      userId,
      name: 'Visa ending in 4242',
      type: 'credit_card',
      details: {
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025
      },
      isDefault: true,
      createdAt: new Date(Date.now() - 3000000000)
    },
    {
      id: 'pm_002',
      userId,
      name: 'Mobile Money',
      type: 'wallet',
      details: {
        phone: '+264123456789',
        provider: 'mobilePay'
      },
      isDefault: false,
      createdAt: new Date(Date.now() - 1500000000)
    }
  ];
}

export async function addPaymentMethod(userId: string, paymentMethod: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>): Promise<PaymentMethod> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create and return new payment method
  const newPaymentMethod: PaymentMethod = {
    id: `pm_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    ...paymentMethod,
    createdAt: new Date()
  };
  
  return newPaymentMethod;
}

export async function deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return success
  return true;
}

export async function setDefaultPaymentMethod(paymentMethodId: string, userId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return success
  return true;
}

// Add mock function for payment history
export async function fetchPaymentHistory(userId: string): Promise<PaymentHistory[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock payment history
  return [
    {
      id: 'ph_001',
      userId,
      bookingId: 'book_001',
      amount: 250,
      description: 'Payment for home cleaning service',
      status: 'completed',
      paymentMethod: 'credit_card',
      createdAt: new Date(Date.now() - 604800000) // 7 days ago
    },
    {
      id: 'ph_002',
      userId,
      bookingId: 'book_002',
      amount: 350,
      description: 'Payment for plumbing service',
      status: 'completed',
      paymentMethod: 'wallet',
      createdAt: new Date(Date.now() - 1209600000) // 14 days ago
    },
    {
      id: 'ph_003',
      userId,
      amount: 150,
      description: 'Subscription payment',
      transactionId: 'sub_001',
      status: 'completed',
      paymentMethod: 'credit_card',
      createdAt: new Date(Date.now() - 2592000000) // 30 days ago
    }
  ];
}
