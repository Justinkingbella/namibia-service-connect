
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number, currency: string = 'NAD'): string {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatBookingStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'rejected': 'Rejected',
    'in_progress': 'In Progress',
  };
  
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'pending': 'text-yellow-500 bg-yellow-50',
    'confirmed': 'text-blue-500 bg-blue-50',
    'completed': 'text-green-500 bg-green-50',
    'cancelled': 'text-red-500 bg-red-50',
    'rejected': 'text-red-500 bg-red-50',
    'in_progress': 'text-purple-500 bg-purple-50',
    'active': 'text-green-500 bg-green-50',
    'inactive': 'text-gray-500 bg-gray-50',
  };
  
  return colorMap[status] || 'text-gray-500 bg-gray-50';
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
