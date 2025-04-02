
export interface SiteSetting {
  key: string;
  value: string | number | boolean | string[] | Record<string, any>;
  description?: string;
  group: SettingGroup;
  type: 'string' | 'number' | 'boolean' | 'array' | 'json' | 'color' | 'image' | 'file';
  options?: Array<{ label: string; value: string | number | boolean }>;
  isPublic: boolean;
  isRequired: boolean;
  validation?: string;
  defaultValue?: any;
  updatedAt: string;
  updatedBy?: string;
}

export type SettingGroup = 
  | 'general'
  | 'appearance'
  | 'booking'
  | 'payment'
  | 'notification'
  | 'security'
  | 'integration'
  | 'legal'
  | 'advanced';

export interface AppearanceSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  enableDarkMode: boolean;
  defaultTheme: 'light' | 'dark' | 'system';
  customCss?: string;
  heroImageUrl?: string;
  footerText: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  navbarLinks: Array<{ label: string; url: string; isExternal?: boolean }>;
  footerLinks: Array<{ label: string; url: string; isExternal?: boolean }>;
}

export interface BookingSettings {
  bookingFeePercentage: number;
  minBookingAmount: number;
  maxBookingAmount: number;
  cancellationWindow: number;
  allowedPaymentMethods: string[];
  lateCancellationFee: number;
  noShowFee: number;
  providerAutoPayout: boolean;
  payoutDelayDays: number;
  ratingRequired: boolean;
  enableInstantBooking: boolean;
  maxBookingsPerDay: number;
  enableServiceAddons: boolean;
  bookingTimeSlotInterval: number;
  allowBookingRescheduling: boolean;
  rescheduleDeadlineHours: number;
  minimumAdvanceBookingHours: number;
  maximumAdvanceBookingDays: number;
  defaultServiceDurationMinutes: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  bookingConfirmation: boolean;
  bookingReminder: boolean;
  bookingCancellation: boolean;
  paymentReceipt: boolean;
  providerAssignment: boolean;
  systemAnnouncements: boolean;
  marketingEmails: boolean;
  emailProvider: string;
  smsProvider: string;
  pushProvider: string;
  emailSenderName: string;
  emailSenderAddress: string;
  reminderHours: number[];
}

export interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  loginAttemptsLimit: number;
  accountLockoutDuration: number;
  sessionTimeout: number;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  enableTwoFactorAuth: boolean;
  defaultTwoFactorMethod: 'email' | 'sms' | 'app';
  jwtExpiryHours: number;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  enableDataExport: boolean;
  enableAccountDeletion: boolean;
}

export interface PaymentSettings {
  currency: string;
  currencySymbol: string;
  decimalPlaces: number;
  stripeEnabled: boolean;
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  payFastEnabled: boolean;
  payFastMerchantId?: string;
  payFastMerchantKey?: string;
  payTodayEnabled: boolean;
  payTodayApiKey?: string;
  eWalletEnabled: boolean;
  bankTransferEnabled: boolean;
  bankTransferInstructions?: string;
  cashEnabled: boolean;
  platformFeePercentage: number;
  minimumWithdrawalAmount: number;
  withdrawalProcessingDays: number;
  vatPercentage: number;
  autoInvoiceGeneration: boolean;
  invoicePrefix: string;
  receiptPrefix: string;
}

export interface IntegrationSettings {
  googleAnalyticsId?: string;
  googleMapsApiKey?: string;
  facebookPixelId?: string;
  intercomAppId?: string;
  zendeskEnabled: boolean;
  zendeskWidgetKey?: string;
  chatIntegration: 'none' | 'intercom' | 'zendesk' | 'crisp' | 'custom';
  customChatScript?: string;
  mailchimpApiKey?: string;
  mailchimpListId?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
  slackWebhookUrl?: string;
}

export interface GeneralSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  contactEmail: string;
  contactPhone?: string;
  businessAddress?: string;
  businessHours?: Record<string, { open: string; close: string }>;
  userRegistrationEnabled: boolean;
  providerRegistrationEnabled: boolean;
  requireProviderApproval: boolean;
  googleRecaptchaEnabled: boolean;
  googleRecaptchaKey?: string;
  googleRecaptchaSecret?: string;
}

export interface SettingsState {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  booking: BookingSettings;
  payment: PaymentSettings;
  notification: NotificationSettings;
  security: SecuritySettings;
  integration: IntegrationSettings;
  isLoading: boolean;
  error: string | null;
}
