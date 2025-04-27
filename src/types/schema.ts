
// Adding missing type definitions for WalletPaymentType and other required types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface BookingStatus {
  readonly PENDING: 'pending';
  readonly CONFIRMED: 'confirmed';
  readonly IN_PROGRESS: 'in_progress';
  readonly COMPLETED: 'completed';
  readonly CANCELLED: 'cancelled';
  readonly REJECTED: 'rejected';
  readonly NO_SHOW: 'no_show';
  readonly RESCHEDULED: 'rescheduled';
  readonly DISPUTED: 'disputed';
}

export interface PaymentStatus {
  readonly PENDING: 'pending';
  readonly PAID: 'paid';
  readonly REFUNDED: 'refunded';
  readonly FAILED: 'failed';
  readonly CANCELLED: 'cancelled';
  readonly PROCESSING: 'processing';
}

export enum PaymentMethodType {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  CASH = 'cash',
  MOBILE_MONEY = 'mobile_money',
}

export enum WalletPaymentType {
  E_WALLET = 'e_wallet',
  EASY_WALLET = 'easy_wallet',
  BANK_TRANSFER = 'bank_transfer',
}

export enum WalletVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  RESUBMITTED = 'resubmitted',
  SUBMITTED = 'submitted',
}

export type SubscriptionTierType = 'free' | 'basic' | 'standard' | 'premium' | 'enterprise';
