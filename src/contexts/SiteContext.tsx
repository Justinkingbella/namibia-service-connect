
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SiteSettings {
  app_name: string;
  description: string;
  theme: string;
  primary_color: string;
  logo_url: string;
  contact_email: string;
  [key: string]: any;
}

interface SiteContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: SiteSettings = {
  app_name: 'Namibia Service Connect',
  description: 'Connect with service providers in Namibia',
  theme: 'light',
  primary_color: '#4f46e5',
  logo_url: '/logo.svg',
  contact_email: 'support@namibiaserviceconnect.com',
};

const SiteContext = createContext<SiteContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  isLoading: false,
});

export const useSite = () => useContext(SiteContext);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real implementation, this would fetch from the backend
        // For now, we'll just simulate a delay and use default settings
        setTimeout(() => {
          setSettings(defaultSettings);
          setIsLoading(false);
        }, 200);
      } catch (error) {
        console.error("Error fetching site settings:", error);
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      // In a real implementation, this would update the backend
      setSettings({ ...settings, ...newSettings });
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating site settings:", error);
      return Promise.reject(error);
    }
  };

  return (
    <SiteContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
};
