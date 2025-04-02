
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
