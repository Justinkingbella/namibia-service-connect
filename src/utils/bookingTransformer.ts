
import { BookingData, BookingWithDetails } from '@/types';

/**
 * Extended BookingWithDetails interface to include formattedDate property
 */
export interface ExtendedBookingWithDetails extends BookingWithDetails {
  formattedDate: string;
}

/**
 * Transforms raw booking data with related objects into a properly typed BookingWithDetails
 */
export function transformBookingDetails(bookingData: any): ExtendedBookingWithDetails {
  // The service data - handle potential null/undefined
  const serviceData = bookingData.service || {};
  const providerData = bookingData.provider || {};
  const customerData = bookingData.customer || {};
  
  // Format date for display
  const formattedDate = bookingData.date ? 
    new Date(bookingData.date).toLocaleDateString() : 
    'No date';
  
  return {
    id: bookingData.id,
    serviceId: bookingData.service_id,
    customerId: bookingData.customer_id,
    providerId: bookingData.provider_id,
    date: bookingData.date,
    startTime: bookingData.start_time,
    endTime: bookingData.end_time || null,
    status: bookingData.status,
    paymentStatus: bookingData.payment_status,
    paymentMethod: bookingData.payment_method,
    totalAmount: bookingData.total_amount,
    commission: bookingData.commission,
    notes: bookingData.notes || '',
    createdAt: bookingData.created_at,
    updatedAt: bookingData.updated_at || bookingData.created_at,
    
    // Safely map nested objects
    service: {
      title: serviceData.title || 'Unknown Service',
      image: serviceData.image || '',
    },
    provider: {
      businessName: providerData.business_name || 'Unknown Provider',
      avatarUrl: providerData.avatar_url || '',
    },
    customer: {
      name: `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim() || 'Unknown Customer',
      avatarUrl: customerData.avatar_url || '',
    },
    
    // Add formatted date property
    formattedDate: formattedDate
  };
}

/**
 * Transforms partial booking data to a format suitable for Supabase insert
 */
export function prepareBookingInsert(bookingData: Partial<BookingData>): any {
  // Fill in required fields with defaults if not provided
  const processedData: Record<string, any> = {
    ...bookingData,
  };
  
  // Ensure these required fields have values
  if (!processedData.commission && processedData.total_amount) {
    processedData.commission = Number(processedData.total_amount) * 0.1;
  }

  if (!processedData.status) {
    processedData.status = 'pending';
  }

  if (!processedData.payment_status) {
    processedData.payment_status = 'pending';
  }
  
  return processedData;
}
