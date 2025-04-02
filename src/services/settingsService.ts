
import { supabase } from '@/integrations/supabase/client';
import { 
  BaseSetting,
  SiteSetting,
  AppearanceSettings,
  GeneralSettings,
  NotificationSettings,
  PaymentSettings, 
  SecuritySettings,
  IntegrationSettings,
  BookingSetting,
  SettingGroup,
  SettingCategory
} from '@/types/settings';

// Fetch all site settings
export const getSiteSettings = async (): Promise<Record<string, any>> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    throw new Error('Failed to fetch site settings');
  }

  // Convert array of settings to an object where keys are setting keys
  const settingsObj: Record<string, any> = {};
  data.forEach((setting) => {
    settingsObj[setting.key] = setting.value;
  });

  return settingsObj;
};

// Get settings by category
export const getSettingsByCategory = async (category: string): Promise<SiteSetting[]> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error(`Error fetching ${category} settings:`, error);
    throw new Error(`Failed to fetch ${category} settings`);
  }

  // Transform the data to match the SiteSetting interface
  return data.map(item => {
    // Safely handle the value as an object
    const valueObj = typeof item.value === 'object' && item.value !== null ? item.value : {};
    
    return {
      id: item.id,
      key: item.key,
      value: item.value,
      label: valueObj.label || item.key,
      description: valueObj.description || '',
      category: (valueObj.category || category) as SettingCategory,
      isPublic: Boolean(valueObj.isPublic) || false,
      dataType: valueObj.dataType || 'string',
      options: Array.isArray(valueObj.options) ? valueObj.options : [],
      defaultValue: valueObj.defaultValue,
      isRequired: Boolean(valueObj.isRequired) || false,
      createdAt: item.created_at || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString()
    } as SiteSetting;
  });
};

// Update a single setting
export const updateSiteSetting = async (key: string, value: any): Promise<void> => {
  const { error } = await supabase
    .from('site_settings')
    .update({ value })
    .eq('key', key);

  if (error) {
    console.error('Error updating site setting:', error);
    throw new Error('Failed to update site setting');
  }
};

// Upload an image for site settings (like logo, favicon)
export const uploadImage = async (file: File, path: string): Promise<string | null> => {
  const { data, error } = await supabase
    .storage
    .from('site-assets')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }

  // Get public URL
  const { data: urlData } = supabase
    .storage
    .from('site-assets')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

// Get all settings grouped by category
export const getAllSettingsGrouped = async (): Promise<SettingGroup[]> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching all settings:', error);
    throw new Error('Failed to fetch settings');
  }

  // Transform data to match SiteSetting interface
  const transformedData = data.map(item => {
    // Safely handle the value as an object
    const valueObj = typeof item.value === 'object' && item.value !== null ? item.value : {};
    
    return {
      id: item.id,
      key: item.key,
      value: item.value,
      label: valueObj.label || item.key,
      description: valueObj.description || '',
      category: (valueObj.category || 'general') as SettingCategory,
      isPublic: Boolean(valueObj.isPublic) || false,
      dataType: valueObj.dataType || 'string',
      options: Array.isArray(valueObj.options) ? valueObj.options : [],
      defaultValue: valueObj.defaultValue,
      isRequired: Boolean(valueObj.isRequired) || false,
      createdAt: item.created_at || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString()
    } as SiteSetting;
  });

  // Group settings by category
  const groupedSettings: Record<string, SiteSetting[]> = {};
  transformedData.forEach(setting => {
    if (!groupedSettings[setting.category]) {
      groupedSettings[setting.category] = [];
    }
    groupedSettings[setting.category].push(setting);
  });

  // Convert to array of SettingGroup
  return Object.entries(groupedSettings).map(([category, settings]) => ({
    category: category as SettingCategory,
    settings
  }));
};

// Get booking settings
export const getBookingSettings = async (): Promise<BookingSetting[]> => {
  const { data, error } = await supabase
    .from('booking_settings')
    .select('*');

  if (error) {
    console.error('Error fetching booking settings:', error);
    throw new Error('Failed to fetch booking settings');
  }

  // Transform data to match BookingSetting interface
  return data.map(item => {
    // Safely handle the value as an object
    const valueObj = typeof item.value === 'object' && item.value !== null ? item.value : {};
    
    return {
      id: item.id,
      key: item.key,
      value: item.value,
      label: valueObj.label || item.key,
      description: item.description || '',
      category: valueObj.category || 'general',
      isEnabled: Boolean(valueObj.isEnabled) || false,
      createdAt: item.created_at || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString()
    } as BookingSetting;
  });
};

// Update booking setting
export const updateBookingSetting = async (id: string, updates: Partial<BookingSetting>): Promise<void> => {
  const { error } = await supabase
    .from('booking_settings')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating booking setting:', error);
    throw new Error('Failed to update booking setting');
  }
};

// Get appearance settings (for theme, colors, etc.)
export const getAppearanceSettings = async (): Promise<AppearanceSettings> => {
  const settings = await getSiteSettings();
  
  return {
    theme: settings.theme || 'light',
    primaryColor: settings.primary_color || '#4f46e5',
    accentColor: settings.accent_color || '#10b981',
    logo: settings.logo_url || '/placeholder.svg',
    favicon: settings.favicon_url || '/favicon.ico',
    showBranding: settings.show_branding !== false
  };
};

// Get general settings
export const getGeneralSettings = async (): Promise<GeneralSettings> => {
  const settings = await getSiteSettings();
  
  return {
    siteName: settings.app_name || 'Namibia Service Hub',
    siteDescription: settings.app_description || 'Find and book services in Namibia',
    contactEmail: settings.contact_email || 'contact@example.com',
    supportPhone: settings.support_phone || '',
    defaultLanguage: settings.default_language || 'en',
    timeZone: settings.time_zone || 'Africa/Windhoek',
    currency: settings.currency || 'N$',
    dateFormat: settings.date_format || 'DD/MM/YYYY',
    defaultPaginationLimit: settings.pagination_limit ||
      Number(settings.pagination_limit) || 10
  };
};
