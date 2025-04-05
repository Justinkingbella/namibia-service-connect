
import { create } from 'zustand';
import { ServiceData, ServiceCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transformKeysToCamel } from '@/lib/utils';

interface ServicesState {
  services: ServiceData[];
  favoriteServices: string[];
  userServices: ServiceData[];
  featuredServices: ServiceData[];
  categoryCounts: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchServices: () => Promise<void>;
  fetchUserServices: (providerId: string) => Promise<void>;
  fetchFavoriteServiceIds: (userId: string) => Promise<void>;
  fetchCategoryCounts: () => Promise<void>;
  addService: (service: ServiceData) => Promise<boolean>;
  updateService: (serviceId: string, data: Partial<ServiceData>) => Promise<boolean>;
  deleteService: (serviceId: string) => Promise<boolean>;
  toggleFavorite: (userId: string, serviceId: string, isFavorite: boolean) => Promise<boolean>;
  clearServicesState: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useServiceStore = create<ServicesState>()((set, get) => ({
  services: [],
  favoriteServices: [],
  userServices: [],
  featuredServices: [],
  categoryCounts: {},
  isLoading: false,
  error: null,
  
  fetchServices: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;

      // Transform the data from snake_case to camelCase
      const transformedData = data.map((item) => transformKeysToCamel(item)) as ServiceData[];
      
      set({ 
        services: transformedData,
        // Also set featured services
        featuredServices: transformedData.filter(s => s.featured),
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching services:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchUserServices: async (providerId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId);
        
      if (error) throw error;

      // Transform the data from snake_case to camelCase
      const transformedData = data.map((item) => transformKeysToCamel(item)) as ServiceData[];
      
      set({ userServices: transformedData, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching user services:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchFavoriteServiceIds: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // First get the customer data
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('saved_services')
        .eq('id', userId)
        .single();
        
      if (customerError) throw customerError;
      
      // Set the favorite service IDs
      set({ 
        favoriteServices: customerData.saved_services || [],
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching favorite services:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchCategoryCounts: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get counts of services by category
      const { data, error } = await supabase
        .from('services')
        .select('category')
        .eq('is_active', true);
        
      if (error) throw error;
      
      // Count occurrences of each category
      const counts: Record<string, number> = {};
      data.forEach(item => {
        if (item.category) {
          counts[item.category] = (counts[item.category] || 0) + 1;
        }
      });
      
      set({ categoryCounts: counts, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching category counts:', error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  addService: async (service: ServiceData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert camelCase to snake_case for the database
      const { data, error } = await supabase
        .from('services')
        .insert({
          title: service.title,
          description: service.description,
          price: service.price,
          pricing_model: service.pricingModel,
          category: service.category,
          provider_id: service.providerId,
          provider_name: service.providerName,
          image: service.image || null,
          features: service.features || [],
          is_active: true,
          location: service.location || null,
        })
        .select();
        
      if (error) throw error;
      
      // Update local state
      if (data && data.length > 0) {
        const newService = transformKeysToCamel(data[0]) as ServiceData;
        set(state => ({ 
          services: [...state.services, newService],
          userServices: [...state.userServices, newService],
          isLoading: false 
        }));
      }
      
      return true;
    } catch (error: any) {
      console.error('Error adding service:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  updateService: async (serviceId: string, serviceData: Partial<ServiceData>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Convert to snake_case properties for database
      const updateData: any = {};
      if (serviceData.title) updateData.title = serviceData.title;
      if (serviceData.description) updateData.description = serviceData.description;
      if (serviceData.price !== undefined) updateData.price = serviceData.price;
      if (serviceData.pricingModel) updateData.pricing_model = serviceData.pricingModel;
      if (serviceData.category) updateData.category = serviceData.category;
      if (serviceData.image) updateData.image = serviceData.image;
      if (serviceData.features) updateData.features = serviceData.features;
      if (serviceData.location) updateData.location = serviceData.location;
      if (serviceData.isActive !== undefined) updateData.is_active = serviceData.isActive;
      
      const { error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', serviceId);
        
      if (error) throw error;
      
      // Update local state
      const services = get().services.map(service => 
        service.id === serviceId ? { ...service, ...serviceData } : service
      );
      
      const userServices = get().userServices.map(service => 
        service.id === serviceId ? { ...service, ...serviceData } : service
      );
      
      set({ services, userServices, isLoading: false });
      return true;
    } catch (error: any) {
      console.error('Error updating service:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  deleteService: async (serviceId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
        
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        services: state.services.filter(service => service.id !== serviceId),
        userServices: state.userServices.filter(service => service.id !== serviceId),
        isLoading: false 
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting service:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  toggleFavorite: async (userId: string, serviceId: string, isFavorite: boolean) => {
    try {
      set({ isLoading: true, error: null });
      
      // First get the current saved_services array
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('saved_services')
        .eq('id', userId)
        .single();
        
      if (customerError) throw customerError;
      
      // Update the saved_services array
      const currentSavedServices = customerData.saved_services || [];
      let updatedSavedServices: string[];
      
      if (isFavorite && !currentSavedServices.includes(serviceId)) {
        // Add service to favorites
        updatedSavedServices = [...currentSavedServices, serviceId];
      } else if (!isFavorite && currentSavedServices.includes(serviceId)) {
        // Remove service from favorites
        updatedSavedServices = currentSavedServices.filter(id => id !== serviceId);
      } else {
        // No change needed
        set({ isLoading: false });
        return true;
      }
      
      // Update the customer record
      const { error: updateError } = await supabase
        .from('customers')
        .update({ saved_services: updatedSavedServices })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      // Update local state
      set({ 
        favoriteServices: updatedSavedServices,
        isLoading: false 
      });
      
      return true;
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  clearServicesState: () => {
    set({ 
      services: [],
      favoriteServices: [],
      userServices: [],
      featuredServices: [],
      categoryCounts: {},
      isLoading: false,
      error: null
    });
  },
  
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));
