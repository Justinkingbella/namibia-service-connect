
import { ProviderVerificationStatus } from "./schema";

export interface ServiceProvider {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  avatar_url?: string;
  business_name?: string;
  business_description?: string;
  banner_url?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  commission_rate?: number;
  verification_status?: ProviderVerificationStatus;
  completed_bookings?: number;
  rating?: number;
  rating_count?: number;
  services_count?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  categories?: string[];
  services?: string[];
  tax_id?: string;
  review_count?: number;
}

export interface ServiceProviderProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  businessName: string;
  businessDescription: string;
  bannerUrl?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  commissionRate: number;
  verificationStatus: ProviderVerificationStatus;
  completedBookings: number;
  rating: number;
  ratingCount: number;
  servicesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categories: string[];
  services: string[];
  taxId?: string;
  reviewCount: number;
}
