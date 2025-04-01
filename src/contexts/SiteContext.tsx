
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSiteSettings, getServiceCategories } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SiteContextType {
  settings: Record<string, any>;
  categories: any[];
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const siteSettings = await getSiteSettings();
      setSettings(siteSettings);
    } catch (error) {
      console.error('Failed to load site settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load site settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const serviceCategories = await getServiceCategories();
      setCategories(serviceCategories);
    } catch (error) {
      console.error('Failed to load service categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service categories',
        variant: 'destructive',
      });
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    Promise.all([fetchSettings(), fetchCategories()]);

    // Subscribe to changes in site_settings table
    const settingsChannel = supabase
      .channel('site-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    // Subscribe to changes in service_categories table
    const categoriesChannel = supabase
      .channel('service-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_categories'
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  return (
    <SiteContext.Provider value={{ 
      settings, 
      categories,
      isLoading, 
      refreshSettings,
      refreshCategories
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = (): SiteContextType => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
