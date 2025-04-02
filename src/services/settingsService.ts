
import {
  SiteSetting,
  AppearanceSettings,
  BookingSettings,
  NotificationSettings,
  SecuritySettings,
  PaymentSettings,
  IntegrationSettings,
  GeneralSettings,
  SettingGroup
} from '@/types/settings';

// Mock implementation - would be replaced with API calls in production
export const getAllSettings = async (): Promise<SiteSetting[]> => {
  console.log('Fetching all site settings');
  
  // Mock data
  return [
    {
      key: 'site_name',
      value: 'Namibia Service Hub',
      description: 'Name of the website displayed in browser tabs and headers',
      group: 'general',
      type: 'string',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'site_description',
      value: 'Find trusted service providers in Namibia',
      description: 'Brief description of the website for search engines',
      group: 'general',
      type: 'string',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'primary_color',
      value: '#3b82f6',
      description: 'Primary color used throughout the website',
      group: 'appearance',
      type: 'color',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'secondary_color',
      value: '#10b981',
      description: 'Secondary color used for accents and buttons',
      group: 'appearance',
      type: 'color',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'logo_url',
      value: '/logo.png',
      description: 'URL to the website logo',
      group: 'appearance',
      type: 'image',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'booking_fee_percentage',
      value: 10,
      description: 'Platform fee percentage for each booking',
      group: 'booking',
      type: 'number',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'min_booking_amount',
      value: 50,
      description: 'Minimum amount allowed for booking a service',
      group: 'booking',
      type: 'number',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'currency',
      value: 'N$',
      description: 'Currency symbol used throughout the website',
      group: 'payment',
      type: 'string',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'allowed_payment_methods',
      value: ['pay_fast', 'e_wallet', 'bank_transfer', 'cash'],
      description: 'Accepted payment methods for bookings',
      group: 'payment',
      type: 'array',
      isPublic: true,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    },
    {
      key: 'email_notifications',
      value: true,
      description: 'Enable email notifications for users',
      group: 'notification',
      type: 'boolean',
      isPublic: false,
      isRequired: true,
      updatedAt: '2023-05-01T08:30:00Z'
    }
  ];
};

export const getSettingsByGroup = async (group: SettingGroup): Promise<SiteSetting[]> => {
  console.log(`Fetching settings for group: ${group}`);
  
  const allSettings = await getAllSettings();
  return allSettings.filter(setting => setting.group === group);
};

export const getSetting = async (key: string): Promise<SiteSetting | null> => {
  console.log(`Fetching setting with key: ${key}`);
  
  const allSettings = await getAllSettings();
  return allSettings.find(setting => setting.key === key) || null;
};

export const updateSetting = async (key: string, value: any): Promise<SiteSetting> => {
  console.log(`Updating setting ${key} with value:`, value);
  
  const setting = await getSetting(key);
  
  if (!setting) {
    throw new Error(`Setting with key ${key} not found`);
  }
  
  // Update the setting
  const updatedSetting = {
    ...setting,
    value,
    updatedAt: new Date().toISOString()
  };
  
  // Mock implementation - would save to API in production
  return updatedSetting;
};

export const createSetting = async (setting: Omit<SiteSetting, 'updatedAt'>): Promise<SiteSetting> => {
  console.log('Creating new setting:', setting);
  
  // Mock implementation - would save to API in production
  return {
    ...setting,
    updatedAt: new Date().toISOString()
  };
};

export const deleteSetting = async (key: string): Promise<boolean> => {
  console.log(`Deleting setting with key: ${key}`);
  
  // Mock implementation - would delete from API in production
  return true;
};

export const getAppearanceSettings = async (): Promise<AppearanceSettings> => {
  console.log('Fetching appearance settings');
  
  // Mock implementation - would fetch from API in production
  return {
    siteName: 'Namibia Service Hub',
    siteDescription: 'Find trusted service providers in Namibia',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    fontFamily: 'Inter, sans-serif',
    enableDarkMode: true,
    defaultTheme: 'light',
    footerText: '© 2023 Namibia Service Hub. All rights reserved.',
    socialLinks: {
      facebook: 'https://facebook.com/namibiaservicehub',
      twitter: 'https://twitter.com/namibiaservices',
      instagram: 'https://instagram.com/namibiaservicehub',
    },
    navbarLinks: [
      { label: 'Home', url: '/' },
      { label: 'Services', url: '/services' },
      { label: 'About', url: '/about' },
      { label: 'Contact', url: '/contact' }
    ],
    footerLinks: [
      { label: 'Terms of Service', url: '/terms' },
      { label: 'Privacy Policy', url: '/privacy' },
      { label: 'FAQ', url: '/faq' }
    ]
  };
};

export const updateAppearanceSettings = async (settings: Partial<AppearanceSettings>): Promise<AppearanceSettings> => {
  console.log('Updating appearance settings:', settings);
  
  // Mock implementation - would update via API in production
  const currentSettings = await getAppearanceSettings();
  
  return {
    ...currentSettings,
    ...settings
  };
};

export const getBookingSettings = async (): Promise<BookingSettings> => {
  console.log('Fetching booking settings');
  
  // Mock implementation - would fetch from API in production
  return {
    bookingFeePercentage: 10,
    minBookingAmount: 50,
    maxBookingAmount: 10000,
    cancellationWindow: 24,
    allowedPaymentMethods: ['pay_fast', 'e_wallet', 'bank_transfer', 'cash'],
    lateCancellationFee: 15,
    noShowFee: 50,
    providerAutoPayout: true,
    payoutDelayDays: 3,
    ratingRequired: false,
    enableInstantBooking: true,
    maxBookingsPerDay: 10,
    enableServiceAddons: true,
    bookingTimeSlotInterval: 30,
    allowBookingRescheduling: true,
    rescheduleDeadlineHours: 12,
    minimumAdvanceBookingHours: 2,
    maximumAdvanceBookingDays: 30,
    defaultServiceDurationMinutes: 60
  };
};

export const updateBookingSetting = async (key: string, value: any): Promise<boolean> => {
  console.log(`Updating booking setting ${key} with value:`, value);
  
  // Mock implementation - would update via API in production
  return true;
};

export const createBookingSetting = async (data: { key: string, value: any, description?: string }): Promise<boolean> => {
  console.log('Creating booking setting:', data);
  
  // Mock implementation - would create via API in production
  return true;
};
