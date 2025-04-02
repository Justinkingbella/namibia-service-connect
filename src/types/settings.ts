
export type SettingCategory = 'general' | 'appearance' | 'notifications' | 'payments' | 'security' | 'integrations';

export interface SiteSetting {
  id: string;
  key: string;
  value: string | number | boolean;
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

export interface BookingSetting {
  id: string;
  key: string;
  value: string | number | boolean;
  label: string;
  description: string;
  category: 'general' | 'restrictions' | 'cancellation' | 'reminders';
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
