
import { 
  User, 
  UserRole, 
  UserAddress, 
  Provider, 
  Customer
} from '@/types';
import { Message } from '@/types/conversations';
import { Dispute, DisputeStatus, DisputePriority } from '@/types';

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

// Mock messages for the conversation system
export const mockMessages: Message[] = [
  {
    id: 'msg1',
    conversation_id: 'conv1',
    sender_id: 'provider123',
    recipient_id: 'user123',
    content: 'Hello! Im available to provide my cleaning services next week. When would be a good time?',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    message_type: 'text',
    is_system_message: false,
    attachments: []
  },
  {
    id: 'msg2',
    conversation_id: 'conv1',
    sender_id: 'user123',
    recipient_id: 'provider123',
    content: 'Hi Jane! Tuesday at 10am would be perfect if youre available.',
    read: true,
    created_at: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
    message_type: 'text',
    is_system_message: false,
    attachments: []
  },
  {
    id: 'msg3',
    conversation_id: 'conv1',
    sender_id: 'provider123',
    recipient_id: 'user123',
    content: 'Tuesday at 10am works for me. Ill be there! Do you have any specific cleaning products preferences?',
    read: true,
    created_at: new Date(Date.now() - 3200000).toISOString(), // 53 minutes ago
    message_type: 'text',
    is_system_message: false,
    attachments: []
  }
];

// Function to get user messages
export const getUserMessages = async (userId: string, conversationId?: string): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  if (conversationId) {
    return mockMessages.filter(msg => 
      msg.conversation_id === conversationId &&
      (msg.sender_id === userId || msg.recipient_id === userId)
    );
  }
  
  return mockMessages.filter(msg => 
    msg.sender_id === userId || msg.recipient_id === userId
  );
};

// Mock disputes
export const mockDisputes: Dispute[] = [
  {
    id: "disp1",
    bookingId: "book123",
    customerId: "user123",
    providerId: "provider123",
    subject: "Service quality issue",
    description: "The cleaning service didn't cover all the agreed areas.",
    status: DisputeStatus.PENDING,
    dateCreated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    priority: DisputePriority.MEDIUM,
    customerName: "John Doe",
    providerName: "Jane's Cleaning Services",
    refundAmount: 250,
    resolution: "",
    attachments: []
  },
  {
    id: "disp2",
    bookingId: "book124",
    customerId: "user123",
    providerId: "provider456",
    subject: "Late arrival",
    description: "Provider was 2 hours late without prior notice.",
    status: DisputeStatus.IN_REVIEW,
    dateCreated: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    priority: DisputePriority.LOW,
    customerName: "John Doe",
    providerName: "Plumbing Experts",
    refundAmount: 0,
    resolution: "",
    attachments: []
  },
  {
    id: "disp3",
    bookingId: "book125",
    customerId: "user456",
    providerId: "provider123",
    subject: "Payment dispute",
    description: "Customer claims service wasn't completed as agreed.",
    status: DisputeStatus.RESOLVED,
    dateCreated: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    priority: DisputePriority.HIGH,
    customerName: "Sarah Johnson",
    providerName: "Jane's Cleaning Services",
    refundAmount: 150,
    resolution: "Partial refund of N$150 was provided.",
    attachments: []
  }
];

// Function to fetch user disputes
export const fetchUserDisputes = async (userId: string): Promise<Dispute[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockDisputes.filter(dispute => 
    dispute.customerId === userId || dispute.providerId === userId
  );
};

// Function to fetch all disputes (for admin)
export const fetchAllDisputes = async (): Promise<Dispute[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockDisputes;
};

// Function to create a dispute
export const createDispute = async (data: Partial<Dispute>): Promise<boolean> => {
  // Simulate API delay and success
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      bookingId: data.bookingId || '',
      customerId: data.customerId || '',
      providerId: data.providerId || '',
      subject: data.subject || '',
      description: data.description || '',
      status: DisputeStatus.PENDING,
      dateCreated: new Date().toISOString(),
      priority: data.priority || DisputePriority.MEDIUM,
      customerName: data.customerName || '',
      providerName: data.providerName || '',
      refundAmount: data.refundAmount || 0,
      resolution: '',
      attachments: data.attachments || []
    };
    
    // In a real app, you'd save to DB here
    mockDisputes.push(newDispute);
    
    return true;
  } catch (error) {
    console.error('Error creating dispute:', error);
    return false;
  }
};

// Function to fetch provider disputes
export const fetchProviderDisputes = async (providerId: string): Promise<Dispute[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockDisputes.filter(dispute => dispute.providerId === providerId);
};
