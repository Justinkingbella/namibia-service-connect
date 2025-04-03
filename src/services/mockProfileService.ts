
import { Booking, BookingStatus, Dispute, PaymentStatus } from '@/types/booking';
import { PaymentHistory } from '@/types/payments';

// Mock data for disputes
export const fetchUserDisputes = async (userId: string): Promise<Dispute[]> => {
  // Mock data
  const disputes: Dispute[] = [
    {
      id: '1',
      bookingId: 'B1001',
      customerId: userId,
      providerId: 'P1',
      subject: 'Service not completed as described',
      description: 'The service was not completed according to the agreed scope. Several areas were left untouched.',
      status: 'pending',
      evidenceUrls: ['evidence1.jpg'],
      priority: 'medium',
      createdAt: new Date(Date.now() - 86400000 * 3),
      updatedAt: new Date(Date.now() - 86400000 * 2),
      reason: 'Service quality issues'
    },
    {
      id: '2',
      bookingId: 'B1002',
      customerId: userId,
      providerId: 'P2',
      subject: 'Overcharge for services',
      description: 'I was charged more than the initially agreed amount without prior notification of any additional costs.',
      status: 'in_review',
      evidenceUrls: ['evidence2.jpg', 'evidence3.jpg'],
      priority: 'high',
      createdAt: new Date(Date.now() - 86400000 * 5),
      updatedAt: new Date(Date.now() - 86400000),
      reason: 'Billing issues'
    }
  ];

  return disputes.filter(d => d.customerId === userId);
};

export const fetchProviderDisputes = async (providerId: string): Promise<Dispute[]> => {
  // Mock data
  const disputes: Dispute[] = [
    {
      id: '1',
      bookingId: 'B1001',
      customerId: 'C1',
      providerId,
      subject: 'Service not completed as described',
      description: 'The service was not completed according to the agreed scope. Several areas were left untouched.',
      status: 'pending',
      evidenceUrls: ['evidence1.jpg'],
      priority: 'medium',
      createdAt: new Date(Date.now() - 86400000 * 3),
      updatedAt: new Date(Date.now() - 86400000 * 2),
      reason: 'Service quality issues'
    }
  ];

  return disputes.filter(d => d.providerId === providerId);
};

export const fetchAllDisputes = async (): Promise<Dispute[]> => {
  // Mock data for admin
  return [
    {
      id: '1',
      bookingId: 'B1001',
      customerId: 'C1',
      providerId: 'P1',
      subject: 'Service not completed as described',
      description: 'The service was not completed according to the agreed scope. Several areas were left untouched.',
      status: 'pending',
      evidenceUrls: ['evidence1.jpg'],
      priority: 'medium',
      createdAt: new Date(Date.now() - 86400000 * 3),
      updatedAt: new Date(Date.now() - 86400000 * 2),
      reason: 'Service quality issues'
    },
    {
      id: '2',
      bookingId: 'B1002',
      customerId: 'C2',
      providerId: 'P2',
      subject: 'Overcharge for services',
      description: 'I was charged more than the initially agreed amount without prior notification of any additional costs.',
      status: 'in_review',
      evidenceUrls: ['evidence2.jpg', 'evidence3.jpg'],
      priority: 'high',
      createdAt: new Date(Date.now() - 86400000 * 5),
      updatedAt: new Date(Date.now() - 86400000),
      reason: 'Billing issues'
    },
    {
      id: '3',
      bookingId: 'B1003',
      customerId: 'C3',
      providerId: 'P3',
      subject: 'Service quality issues',
      description: 'The quality of the service was below standard. Had to hire another provider to fix the issues.',
      status: 'resolved',
      resolution: 'Partial refund processed.',
      evidenceUrls: [],
      priority: 'medium',
      createdAt: new Date(Date.now() - 86400000 * 10),
      updatedAt: new Date(Date.now() - 86400000 * 7),
      reason: 'Service quality issues'
    }
  ];
};

export const createDispute = async (data: Partial<Dispute>): Promise<boolean> => {
  // Mock API call
  console.log('Creating dispute:', data);
  
  // Simulate successful creation
  return true;
};

// Mock payment history
export const fetchPaymentHistory = async (userId: string): Promise<PaymentHistory[]> => {
  // Mock data
  return [
    {
      id: '1',
      userId,
      amount: 150,
      description: 'Payment for Home Cleaning Service',
      date: new Date(Date.now() - 86400000 * 5),
      status: 'completed',
      type: 'payment',
      reference: 'B1001'
    },
    {
      id: '2',
      userId,
      amount: 200,
      description: 'Payment for Garden Maintenance',
      date: new Date(Date.now() - 86400000 * 10),
      status: 'completed',
      type: 'payment',
      reference: 'B1002'
    },
    {
      id: '3',
      userId,
      amount: 50,
      description: 'Refund for cancelled service',
      date: new Date(Date.now() - 86400000 * 15),
      status: 'completed',
      type: 'refund',
      reference: 'B1003'
    }
  ];
};

// Mock bookings data
export const fetchUserBookings = async (userId: string, role: 'customer' | 'provider'): Promise<Booking[]> => {
  // Mock data
  const bookings: Booking[] = [
    {
      id: 'B1001',
      customerId: 'C1',
      providerId: 'P1',
      serviceId: 'S1',
      date: new Date(Date.now() + 86400000 * 2),
      startTime: '10:00',
      endTime: '12:00',
      status: 'confirmed' as BookingStatus,
      totalAmount: 120,
      paymentStatus: 'paid' as PaymentStatus,
      paymentMethod: 'credit_card',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      duration: 2
    },
    {
      id: 'B1002',
      customerId: 'C1',
      providerId: 'P2',
      serviceId: 'S2',
      date: new Date(Date.now() + 86400000 * 5),
      startTime: '14:00',
      endTime: '16:00',
      status: 'pending' as BookingStatus,
      totalAmount: 180,
      paymentStatus: 'pending' as PaymentStatus,
      createdAt: new Date(Date.now() - 86400000 * 2),
      updatedAt: new Date(Date.now() - 86400000 * 2),
      duration: 2
    },
    {
      id: 'B1003',
      customerId: 'C2',
      providerId: 'P1',
      serviceId: 'S1',
      date: new Date(Date.now() - 86400000 * 3),
      startTime: '09:00',
      endTime: '11:00',
      status: 'completed' as BookingStatus,
      totalAmount: 120,
      paymentStatus: 'paid' as PaymentStatus,
      paymentMethod: 'credit_card',
      createdAt: new Date(Date.now() - 86400000 * 5),
      updatedAt: new Date(Date.now() - 86400000 * 3),
      rating: 4,
      duration: 2
    }
  ];

  return bookings.filter(b => 
    role === 'customer' ? b.customerId === userId : b.providerId === userId
  );
};
