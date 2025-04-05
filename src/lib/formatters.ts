
import { BookingStatus, PaymentStatus } from "@/types/booking";

export function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NA', {
    style: 'currency',
    currency: 'NAD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatBookingStatus(status: BookingStatus): string {
  const statusMap: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    no_show: 'No Show',
  };
  
  return statusMap[status] || status;
}

export function formatPaymentStatus(status: PaymentStatus): string {
  const statusMap: Record<PaymentStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
    partially_refunded: 'Partially Refunded',
  };
  
  return statusMap[status] || status;
}

export function getStatusColor(status: BookingStatus | PaymentStatus): string {
  const colorMap: Record<string, string> = {
    // Booking status colors
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-gray-100 text-gray-800',
    no_show: 'bg-orange-100 text-orange-800',
    
    // Payment status colors
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
    partially_refunded: 'bg-amber-100 text-amber-800',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}
