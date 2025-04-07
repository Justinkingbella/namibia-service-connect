
import { Dispute } from '@/types/booking';

// Mock disputes
export const mockDisputes: Dispute[] = [
  {
    id: "disp1",
    bookingId: "book123",
    customerId: "user123",
    providerId: "provider123",
    subject: "Service quality issue",
    description: "The cleaning service didn't cover all the agreed areas.",
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    priority: 'medium',
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
    status: 'in_review',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    priority: 'low',
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
    status: 'resolved',
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    priority: 'high',
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

// Function to fetch provider disputes
export const fetchProviderDisputes = async (providerId: string): Promise<Dispute[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockDisputes.filter(dispute => dispute.providerId === providerId);
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
      status: 'pending',
      createdAt: new Date().toISOString(),
      priority: data.priority || 'medium',
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
