
import { v4 as uuidv4 } from 'uuid';
import { PaymentHistory, Dispute } from '@/types/payments';
import { FavoriteService } from '@/types/favorites';
import { Message } from '@/types/message';
import { UserAddress, PaymentMethod, User2FA } from '@/types/auth';

// Mock data functions to use until real implementation is ready
export const fetchPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
  // Mock payment history data
  return [
    {
      id: uuidv4(),
      userId,
      amount: 1200,
      status: 'completed',
      paymentMethod: 'credit_card',
      description: 'Payment for home cleaning service',
      transactionId: uuidv4(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      id: uuidv4(),
      userId,
      bookingId: uuidv4(),
      amount: 800,
      status: 'completed',
      paymentMethod: 'mobile_money',
      description: 'Payment for gardening service',
      transactionId: uuidv4(),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
    }
  ];
};

export const fetchUserDisputes = async (userId: string): Promise<Dispute[]> => {
  // Mock disputes data
  return [
    {
      id: uuidv4(),
      bookingId: uuidv4(),
      customerId: userId,
      providerId: uuidv4(),
      reason: 'Service not completed as described',
      description: 'The provider did not complete all the tasks that were agreed upon.',
      status: 'pending',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      subject: 'Incomplete Service',
      priority: 'medium'
    }
  ];
};

export const createDispute = async (disputeData: Partial<Dispute>): Promise<Dispute | null> => {
  // Create a mock dispute
  const newDispute: Dispute = {
    id: uuidv4(),
    bookingId: disputeData.bookingId || uuidv4(),
    customerId: disputeData.customerId || '',
    providerId: disputeData.providerId || '',
    reason: disputeData.reason || '',
    description: disputeData.description || '',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    subject: disputeData.subject || 'Service Dispute',
    priority: disputeData.priority || 'medium'
  };
  
  return newDispute;
};

export const fetchUserFavorites = async (userId: string): Promise<FavoriteService[]> => {
  // Mock favorites data
  return [
    {
      id: uuidv4(),
      userId,
      serviceId: uuidv4(),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      serviceName: 'Premium House Cleaning',
      serviceImage: 'https://example.com/images/cleaning.jpg'
    },
    {
      id: uuidv4(),
      userId,
      serviceId: uuidv4(),
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      serviceName: 'Garden Maintenance',
      serviceImage: 'https://example.com/images/gardening.jpg'
    }
  ];
};

export const addFavorite = async (userId: string, serviceId: string): Promise<FavoriteService | null> => {
  // Create a mock favorite
  return {
    id: uuidv4(),
    userId,
    serviceId,
    createdAt: new Date(),
    serviceName: 'New Favorite Service',
    serviceImage: 'https://example.com/images/service.jpg'
  };
};

export const removeFavorite = async (userId: string, serviceId: string): Promise<boolean> => {
  // Mock remove favorite
  return true;
};

export const fetchUserMessages = async (userId: string): Promise<Message[]> => {
  // Mock messages data
  return [
    {
      id: uuidv4(),
      senderId: uuidv4(),
      recipientId: userId,
      content: 'Hello! I\'m interested in your service.',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      id: uuidv4(),
      senderId: userId,
      recipientId: uuidv4(),
      content: 'Thank you for your inquiry. I\'m available next week.',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ];
};

export const sendMessage = async (message: Partial<Message>): Promise<Message | null> => {
  // Create a mock message
  return {
    id: uuidv4(),
    senderId: message.senderId || '',
    recipientId: message.recipientId || '',
    content: message.content || '',
    isRead: false,
    createdAt: new Date()
  };
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  // Mock mark message as read
  return true;
};

export const fetchUserAddresses = async (userId: string): Promise<UserAddress[]> => {
  // Mock addresses data
  return [
    {
      id: uuidv4(),
      userId,
      name: 'Home',
      street: '123 Main Street',
      city: 'Windhoek',
      region: 'Khomas',
      postalCode: '10001',
      country: 'Namibia',
      isDefault: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    },
    {
      id: uuidv4(),
      userId,
      name: 'Work',
      street: '456 Business Avenue',
      city: 'Windhoek',
      region: 'Khomas',
      postalCode: '10002',
      country: 'Namibia',
      isDefault: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    }
  ];
};

export const addUserAddress = async (userId: string, address: Partial<UserAddress>): Promise<UserAddress | null> => {
  // Create a mock address
  return {
    id: uuidv4(),
    userId,
    name: address.name || 'New Address',
    street: address.street || '',
    city: address.city || '',
    region: address.region,
    postalCode: address.postalCode,
    country: address.country || 'Namibia',
    isDefault: address.isDefault || false,
    createdAt: new Date()
  };
};

export const updateUserAddress = async (addressId: string, address: Partial<UserAddress>): Promise<boolean> => {
  // Mock update address
  return true;
};

export const deleteUserAddress = async (addressId: string): Promise<boolean> => {
  // Mock delete address
  return true;
};

export const fetchUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  // Mock payment methods data
  return [
    {
      id: uuidv4(),
      userId,
      name: 'Credit Card',
      type: 'credit_card',
      details: {
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025
      },
      isDefault: true,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
    },
    {
      id: uuidv4(),
      userId,
      name: 'Mobile Money',
      type: 'mobile_money',
      details: {
        phoneNumber: '+264123456789',
        provider: 'MTC'
      },
      isDefault: false,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) // 25 days ago
    }
  ];
};

export const addPaymentMethod = async (userId: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null> => {
  // Create a mock payment method
  return {
    id: uuidv4(),
    userId,
    name: paymentMethod.name || 'New Payment Method',
    type: paymentMethod.type || 'credit_card',
    details: paymentMethod.details || {},
    isDefault: paymentMethod.isDefault || false,
    createdAt: new Date()
  };
};

export const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
  // Mock delete payment method
  return true;
};

export const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
  // Mock set default payment method
  return true;
};

export const fetchUser2FAStatus = async (userId: string): Promise<User2FA | null> => {
  // Mock 2FA status
  return {
    userId,
    isEnabled: false
  };
};

export const enable2FA = async (userId: string): Promise<{ secret: string; backupCodes: string[] } | null> => {
  // Mock enable 2FA
  return {
    secret: 'ABCDEFGHIJKLMNOP',
    backupCodes: [
      'ABCD-EFGH-IJKL',
      'MNOP-QRST-UVWX',
      'YZAB-CDEF-GHIJ',
      'KLMN-OPQR-STUV',
      'WXYZ-ABCD-EFGH'
    ]
  };
};

export const disable2FA = async (userId: string): Promise<boolean> => {
  // Mock disable 2FA
  return true;
};

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  // Mock update password
  return true;
};
