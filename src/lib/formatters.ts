
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { BookingStatus, PaymentStatus } from '@/types';

// Format currency
export const formatCurrency = (amount: number, currency = 'NAD') => {
  return new Intl.NumberFormat('en-NA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date in a readable format
export const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isToday(date)) {
    return `Today, ${format(date, 'p')}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'p')}`;
  } else {
    return format(date, 'PPP');
  }
};

// Format date in short format
export const formatShortDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return format(date, 'MMM d, yyyy');
};

// Format booking status to a human-readable form
export const formatBookingStatus = (status: BookingStatus): string => {
  const statusDisplay: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    no_show: 'No Show',
    disputed: 'Disputed',
    rescheduled: 'Rescheduled'
  };
  
  return statusDisplay[status] || 'Unknown';
};

// Format time ago
export const formatTimeAgo = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return formatDistanceToNow(date, { addSuffix: true });
};

// Format payment status to human-readable form
export const formatPaymentStatus = (status: PaymentStatus): string => {
  const statusDisplay: Record<PaymentStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
    canceled: 'Canceled',
    partially_refunded: 'Partially Refunded'
  };
  
  return statusDisplay[status] || 'Unknown';
};

// Get color class for booking status
export const getBookingStatusColorClass = (status: BookingStatus): string => {
  const statusColors: Record<BookingStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-100 text-gray-800',
    disputed: 'bg-orange-100 text-orange-800',
    rescheduled: 'bg-purple-100 text-purple-800'
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Get color class for payment status
export const getPaymentStatusColorClass = (status: PaymentStatus): string => {
  const statusColors: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
    canceled: 'bg-gray-100 text-gray-800',
    partially_refunded: 'bg-orange-100 text-orange-800'
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};
