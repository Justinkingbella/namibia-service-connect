
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to conditionally join CSS class names together
 */
export function classNames(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .join(' ')
    .trim();
}

// Add missing utility functions that were referenced in other files
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatBookingStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

export const getStatusColor = (status: string): string => {
  const statusColorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-gray-100 text-gray-800',
    no_show: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
  };
  
  return statusColorMap[status] || 'bg-gray-100 text-gray-800';
};
