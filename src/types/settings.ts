
export type SettingCategory = 'general' | 'appearance' | 'notifications' | 'payments' | 'security' | 'integrations';

// Base setting interface matching Supabase structure
export interface BaseSetting {
  id: string;
  key: string;
  value: any; // Using any to prevent recursive type issues
  created_at?: string;
  updated_at?: string;
}

// Extended setting interface with additional app properties
export interface SiteSetting extends BaseSetting {
  label: string;
  description: string;
  category: SettingCategory;
  isPublic: boolean;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'color' | 'image';
  options?: string[]; // For select/dropdown settings
  defaultValue?: string | number | boolean;
  isRequired?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  logo: string;
  favicon: string;
  showBranding: boolean;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  defaultLanguage: string;
  timeZone: string;
  currency: string;
  dateFormat: string;
  defaultPaginationLimit: number;
}

export interface NotificationSettings {
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  enableSmsNotifications: boolean;
  adminEmailAddresses: string[];
  emailFooter: string;
  emailHeader: string;
}

export interface PaymentSettings {
  commissionRate: number;
  minWithdrawalAmount: number;
  paymentMethods: string[];
  processingFee: number;
  processingFeeType: 'fixed' | 'percentage';
  withdrawalSchedule: 'instant' | 'daily' | 'weekly';
  supportedCurrencies: string[];
}

export interface SecuritySettings {
  requireEmailVerification: boolean;
  enableTwoFactorAuth: boolean;
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  ipBlacklist: string[];
}

export interface IntegrationSettings {
  enabledIntegrations: string[];
  apiKeys: Record<string, string>;
  webhookUrls: Record<string, string>;
  thirdPartyServices: {
    name: string;
    isEnabled: boolean;
    configData: Record<string, any>;
  }[];
}

// Modified BookingSetting to match database structure
export interface BookingSetting extends BaseSetting {
  label: string;
  description: string;
  category: 'general' | 'restrictions' | 'cancellation' | 'reminders';
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SettingGroup {
  category: SettingCategory;
  settings: SiteSetting[];
}
