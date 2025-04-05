
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Service, ServiceData } from '@/types/service';
import { transformServiceData, reverseTransformServiceData } from '@/services/serviceDataTransformer';
import { toast } from 'sonner';

interface ServiceState {
  services: Service[];
  userServices: ServiceData[];
  featuredServices: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchServices: (category?: string) => Promise<void>;
  fetchUserServices: (providerId: string) => Promise<void>;
  fetchFeaturedServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<Service | null>;
  createService: (serviceData: Partial<ServiceData>) => Promise<string | null>;
  updateService: (id: string, serviceData: Partial<ServiceData>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  toggleServiceActive: (id: string, isActive: boolean) => Promise<boolean>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  userServices: [],
  featuredServices: [],
  selectedService: null,
  isLoading: false,
  error: null,

  fetchServices: async (category?: string) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('services').select('*').eq('is_active', true);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedServices = data.map(transformServiceData);
      set({ services: transformedServices });
    } catch (error: any) {
      console.error('Error fetching services:', error);
      set({ error: error.message });
      toast.error('Failed to fetch services', {
        description: error.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserServices: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId);

      if (error) throw error;

      set({ userServices: data as ServiceData[] });
    } catch (error: any) {
      console.error('Error fetching user services:', error);
      set({ error: error.message });
      toast.error('Failed to fetch your services', {
        description: error.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .limit(6);

      if (error) throw error;

      const transformedServices = data.map(transformServiceData);
      set({ featuredServices: transformedServices });
    } catch (error: any) {
      console.error('Error fetching featured services:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchServiceById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const transformedService = transformServiceData(data);
      set({ selectedService: transformedService });
      return transformedService;
    } catch (error: any) {
      console.error('Error fetching service by ID:', error);
      set({ error: error.message });
      toast.error('Failed to fetch service details', {
        description: error.message,
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createService: async (serviceData: Partial<ServiceData>) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure price is a number
      if (serviceData.price) {
        serviceData.price = Number(serviceData.price);
      }

      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;

      // Update the user services list
      const { userServices } = get();
      set({
        userServices: [...userServices, data as ServiceData]
      });

      toast.success('Service created successfully');
      return data.id;
    } catch (error: any) {
      console.error('Error creating service:', error);
      set({ error: error.message });
      toast.error('Failed to create service', {
        description: error.message,
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateService: async (id: string, serviceData: Partial<ServiceData>) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure price is a number if it's provided
      if (serviceData.price !== undefined) {
        serviceData.price = Number(serviceData.price);
      }

      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id);

      if (error) throw error;

      // Update the service in the store
      const { userServices, services, selectedService } = get();
      
      // Update userServices
      set({
        userServices: userServices.map(service => 
          service.id === id ? { ...service, ...serviceData } : service
        )
      });

      // Update services if it exists there
      set({
        services: services.map(service => {
          if (service.id === id) {
            // Create updated service data
            const updatedServiceData = {
              ...reverseTransformServiceData(service),
              ...serviceData
            };
            // Transform it back to frontend model
            return transformServiceData(updatedServiceData);
          }
          return service;
        })
      });

      // Update selectedService if it's the one being edited
      if (selectedService && selectedService.id === id) {
        const updatedServiceData = {
          ...reverseTransformServiceData(selectedService),
          ...serviceData
        };
        set({
          selectedService: transformServiceData(updatedServiceData)
        });
      }

      toast.success('Service updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating service:', error);
      set({ error: error.message });
      toast.error('Failed to update service', {
        description: error.message,
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteService: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove the service from the store
      const { userServices, services } = get();
      set({
        userServices: userServices.filter(service => service.id !== id),
        services: services.filter(service => service.id !== id),
        selectedService: null
      });

      toast.success('Service deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting service:', error);
      set({ error: error.message });
      toast.error('Failed to delete service', {
        description: error.message,
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleServiceActive: async (id: string, isActive: boolean) => {
    return get().updateService(id, { is_active: isActive });
  }
}));
