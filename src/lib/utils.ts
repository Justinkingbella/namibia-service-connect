
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

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatBookingStatus(status: string): string {
  return status.replace('_', ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'disputed':
      return 'bg-orange-100 text-orange-800';
    case 'no_show':
      return 'bg-gray-100 text-gray-800';
    case 'rescheduled':
      return 'bg-teal-100 text-teal-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// A safe type cast function to convert strings to enum values
export function safeEnumCast<T extends string>(value: string, enumObj: Record<string, string>): T {
  return (Object.values(enumObj).includes(value) ? value : Object.values(enumObj)[0]) as T;
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

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
