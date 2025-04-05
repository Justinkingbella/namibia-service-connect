
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { ServiceData } from '@/types';
import { toast } from 'sonner';

interface ServiceState {
  services: ServiceData[];
  userServices: ServiceData[];
  selectedService: ServiceData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchServices: () => Promise<void>;
  fetchUserServices: (userId: string) => Promise<void>;
  fetchServiceById: (serviceId: string) => Promise<ServiceData | null>;
  createService: (serviceData: Partial<ServiceData>) => Promise<string | null>;
  updateService: (serviceId: string, serviceData: Partial<ServiceData>) => Promise<boolean>;
  toggleServiceActive: (serviceId: string) => Promise<boolean>;
  deleteService: (serviceId: string) => Promise<boolean>;
  setSelectedService: (service: ServiceData | null) => void;
  clearServices: () => void;
}

export const useServiceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      services: [],
      userServices: [],
      selectedService: null,
      loading: false,
      error: null,
      
      fetchServices: async () => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('services')
            .select(`
              *,
              provider:provider_id(*)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Map DB snake_case to camelCase for components
          const mappedServices: ServiceData[] = data.map((service: any) => ({
            ...service,
            // Add camelCase fields for component use
            pricingModel: service.pricing_model,
            isActive: service.is_active,
            providerId: service.provider_id,
            providerName: service.provider_name,
            createdAt: service.created_at,
            updatedAt: service.updated_at,
            reviewCount: service.review_count,
          }));
          
          set({ services: mappedServices, loading: false });
        } catch (error) {
          console.error('Error fetching services:', error);
          set({ error: 'Failed to fetch services', loading: false });
        }
      },
      
      fetchUserServices: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('provider_id', userId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Map DB snake_case to camelCase for components
          const mappedServices: ServiceData[] = data.map((service: any) => ({
            ...service,
            pricingModel: service.pricing_model,
            isActive: service.is_active,
            providerId: service.provider_id,
            providerName: service.provider_name,
            createdAt: service.created_at,
            updatedAt: service.updated_at,
            reviewCount: service.review_count,
          }));
          
          set({ userServices: mappedServices, loading: false });
        } catch (error) {
          console.error('Error fetching user services:', error);
          set({ error: 'Failed to fetch your services', loading: false });
        }
      },
      
      fetchServiceById: async (serviceId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('services')
            .select(`
              *,
              provider:provider_id(*)
            `)
            .eq('id', serviceId)
            .single();
          
          if (error) throw error;
          
          // Map DB snake_case to camelCase for components
          const serviceData: ServiceData = {
            ...data,
            pricingModel: data.pricing_model,
            isActive: data.is_active,
            providerId: data.provider_id,
            providerName: data.provider_name,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            reviewCount: data.review_count,
          };
          
          set({ selectedService: serviceData, loading: false });
          return serviceData;
        } catch (error) {
          console.error('Error fetching service details:', error);
          set({ error: 'Failed to fetch service details', loading: false });
          return null;
        }
      },
      
      createService: async (serviceData: Partial<ServiceData>) => {
        try {
          // Ensure the serviceData has the required fields
          if (!serviceData.title || !serviceData.description || !serviceData.price || !serviceData.category) {
            throw new Error('Missing required fields');
          }
          
          // Convert camelCase to snake_case for the database
          const dbServiceData: any = {
            ...serviceData,
            pricing_model: serviceData.pricingModel || serviceData.pricing_model || 'fixed',
            is_active: serviceData.isActive !== undefined ? serviceData.isActive : (serviceData.is_active !== undefined ? serviceData.is_active : true),
            provider_id: serviceData.providerId || serviceData.provider_id,
            provider_name: serviceData.providerName || serviceData.provider_name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          // Required field for Supabase
          if (!dbServiceData.price) {
            dbServiceData.price = 0;
          }
          
          const { data, error } = await supabase
            .from('services')
            .insert(dbServiceData)
            .select();
          
          if (error) throw error;
          
          if (!data || data.length === 0) {
            throw new Error('No data returned after service creation');
          }
          
          // Add the new service to state
          const newService = {
            ...data[0],
            pricingModel: data[0].pricing_model,
            isActive: data[0].is_active,
            providerId: data[0].provider_id,
            providerName: data[0].provider_name,
            createdAt: data[0].created_at,
            updatedAt: data[0].updated_at,
            reviewCount: data[0].review_count,
          };
          
          set(state => ({
            userServices: [newService, ...state.userServices]
          }));
          
          toast.success('Service created successfully');
          return data[0].id;
        } catch (error: any) {
          console.error('Error creating service:', error);
          toast.error(error.message || 'Failed to create service');
          return null;
        }
      },
      
      updateService: async (serviceId: string, serviceData: Partial<ServiceData>) => {
        try {
          // Convert camelCase to snake_case for the database
          const dbServiceData: any = { ...serviceData };
          
          if (serviceData.pricingModel !== undefined) {
            dbServiceData.pricing_model = serviceData.pricingModel;
            delete dbServiceData.pricingModel;
          }
          
          if (serviceData.isActive !== undefined) {
            dbServiceData.is_active = serviceData.isActive;
            delete dbServiceData.isActive;
          }
          
          if (serviceData.providerId !== undefined) {
            dbServiceData.provider_id = serviceData.providerId;
            delete dbServiceData.providerId;
          }
          
          if (serviceData.providerName !== undefined) {
            dbServiceData.provider_name = serviceData.providerName;
            delete dbServiceData.providerName;
          }
          
          // Always update the updated_at timestamp
          dbServiceData.updated_at = new Date().toISOString();
          
          const { error } = await supabase
            .from('services')
            .update(dbServiceData)
            .eq('id', serviceId);
          
          if (error) throw error;
          
          // Update both services and userServices arrays
          set(state => ({
            services: state.services.map(service => 
              service.id === serviceId ? { ...service, ...serviceData } : service
            ),
            userServices: state.userServices.map(service => 
              service.id === serviceId ? { ...service, ...serviceData } : service
            )
          }));
          
          // Update selected service if it's the one being updated
          if (get().selectedService?.id === serviceId) {
            set(state => ({
              selectedService: state.selectedService 
                ? { ...state.selectedService, ...serviceData } 
                : null
            }));
          }
          
          toast.success('Service updated successfully');
          return true;
        } catch (error) {
          console.error('Error updating service:', error);
          toast.error('Failed to update service');
          return false;
        }
      },
      
      toggleServiceActive: async (serviceId: string) => {
        // Get the current service
        const service = get().userServices.find(s => s.id === serviceId) || 
                       get().services.find(s => s.id === serviceId);
        
        if (!service) return false;
        
        // Toggle the is_active flag
        const newIsActive = !(service.isActive !== undefined ? service.isActive : service.is_active);
        
        try {
          const { error } = await supabase
            .from('services')
            .update({ 
              is_active: newIsActive,
              updated_at: new Date().toISOString()
            })
            .eq('id', serviceId);
          
          if (error) throw error;
          
          // Update both services and userServices arrays
          set(state => ({
            services: state.services.map(s => 
              s.id === serviceId ? { ...s, is_active: newIsActive, isActive: newIsActive } : s
            ),
            userServices: state.userServices.map(s => 
              s.id === serviceId ? { ...s, is_active: newIsActive, isActive: newIsActive } : s
            )
          }));
          
          // Update selected service if it's the one being toggled
          if (get().selectedService?.id === serviceId) {
            set(state => ({
              selectedService: state.selectedService 
                ? { ...state.selectedService, is_active: newIsActive, isActive: newIsActive } 
                : null
            }));
          }
          
          toast.success(`Service ${newIsActive ? 'activated' : 'deactivated'} successfully`);
          return true;
        } catch (error) {
          console.error('Error toggling service active state:', error);
          toast.error('Failed to update service status');
          return false;
        }
      },
      
      deleteService: async (serviceId: string) => {
        try {
          const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', serviceId);
          
          if (error) throw error;
          
          // Remove from both services and userServices arrays
          set(state => ({
            services: state.services.filter(service => service.id !== serviceId),
            userServices: state.userServices.filter(service => service.id !== serviceId)
          }));
          
          // Clear selected service if it's the one being deleted
          if (get().selectedService?.id === serviceId) {
            set({ selectedService: null });
          }
          
          toast.success('Service deleted successfully');
          return true;
        } catch (error) {
          console.error('Error deleting service:', error);
          toast.error('Failed to delete service');
          return false;
        }
      },
      
      setSelectedService: (service) => {
        set({ selectedService: service });
      },
      
      clearServices: () => {
        set({ services: [], userServices: [], selectedService: null });
      }
    }),
    {
      name: 'services-storage',
      // Only persist some fields to avoid storing too much data
      partialize: (state) => ({
        selectedService: state.selectedService
      })
    }
  )
);
