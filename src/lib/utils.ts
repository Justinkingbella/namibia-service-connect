
import { BookingStatus, PaymentStatus } from '@/types';

export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  if (!time) return '';
  // Convert 24-hour time format to 12-hour format
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NA', {
    style: 'currency',
    currency: 'NAD',
  }).format(amount);
}

export function formatBookingStatus(status: BookingStatus): string {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function getStatusColor(status: BookingStatus | PaymentStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed':
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'disputed':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'no_show':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'rescheduled':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'refunded':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'partial':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Function to convert camelCase to snake_case
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Function to convert snake_case to camelCase
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Transform object keys from snake_case to camelCase
export function transformKeysToCamel(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformKeysToCamel);
  }

  const camelObj: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    const camelKey = snakeToCamel(key);
    camelObj[camelKey] = transformKeysToCamel(obj[key]);
  });

  return camelObj;
}

// Transform object keys from camelCase to snake_case
export function transformKeysToSnake(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformKeysToSnake);
  }

  const snakeObj: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = camelToSnake(key);
    snakeObj[snakeKey] = transformKeysToSnake(obj[key]);
  });

  return snakeObj;
}

export function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
