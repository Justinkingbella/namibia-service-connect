
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';
import { toast } from 'sonner';
import { transformServiceData } from '@/utils/serviceDataTransformer';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    }
  }, [user?.id]);

  const fetchFavorites = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Get favorite service IDs from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('favorites')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const favoriteIds = profileData?.favorites || [];
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Fetch the actual services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*, provider:provider_id (*)')
        .in('id', favoriteIds);

      if (servicesError) {
        throw servicesError;
      }

      if (!servicesData || !Array.isArray(servicesData)) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Transform data to match Service type
      const transformedFavorites: Service[] = servicesData.map(service => {
        const providerData = service.provider && typeof service.provider === 'object' 
          ? service.provider
          : { business_name: 'Unknown Provider' };
          
        const providerName = providerData.business_name || 'Unknown Provider';
        
        return {
          id: service.id || '',
          title: service.title || '',
          description: service.description || '',
          price: Number(service.price) || 0,
          image: service.image || '',
          provider_id: service.provider_id || '',
          provider_name: providerName,
          providerId: service.provider_id || '',
          providerName: providerName,
          category: service.category || '',
          pricingModel: service.pricing_model || '',
          rating: Number(service.rating || 0),
          reviewCount: Number(service.review_count || 0),
          location: service.location || '',
          features: Array.isArray(service.features) ? service.features : [],
          isActive: service.is_active ?? true,
          createdAt: service.created_at || '',
          updatedAt: service.updated_at || '',
          tags: Array.isArray(service.tags) ? service.tags : []
        };
      });

      setFavorites(transformedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load your favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (serviceId: string) => {
    if (!user?.id) {
      toast.error('Please sign in to save favorites');
      return;
    }

    try {
      // Get current favorites
      const { data, error } = await supabase
        .from('profiles')
        .select('favorites')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const currentFavorites = data?.favorites || [];
      
      // Add the service if it's not already in favorites
      if (!currentFavorites.includes(serviceId)) {
        const updatedFavorites = [...currentFavorites, serviceId];
        
        // Update favorites in the database
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ favorites: updatedFavorites })
          .eq('id', user.id);

        if (updateError) throw updateError;
        
        // Fetch the service details to add to state
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*, provider:provider_id (*)')
          .eq('id', serviceId)
          .single();

        if (serviceError) throw serviceError;
        
        if (!serviceData) {
          toast.error('Service not found');
          return;
        }

        const providerData = serviceData.provider && typeof serviceData.provider === 'object'
          ? serviceData.provider
          : { business_name: 'Unknown Provider' };
          
        const providerName = providerData.business_name || 'Unknown Provider';

        const newFavorite: Service = {
          id: serviceData.id || '',
          title: serviceData.title || '',
          description: serviceData.description || '',
          price: Number(serviceData.price) || 0,
          image: serviceData.image || '',
          provider_id: serviceData.provider_id || '',
          provider_name: providerName,
          providerId: serviceData.provider_id || '',
          providerName: providerName,
          category: serviceData.category || '',
          pricingModel: serviceData.pricing_model || '',
          rating: Number(serviceData.rating || 0),
          reviewCount: Number(serviceData.review_count || 0),
          location: serviceData.location || '',
          features: Array.isArray(serviceData.features) ? serviceData.features : [],
          isActive: serviceData.is_active ?? true,
          createdAt: serviceData.created_at || '',
          updatedAt: serviceData.updated_at || '',
          tags: Array.isArray(serviceData.tags) ? serviceData.tags : []
        };

        setFavorites((prev) => [...prev, newFavorite]);
        toast.success('Added to favorites');
      } else {
        toast('Already in your favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (serviceId: string) => {
    if (!user?.id) return;

    try {
      // Get current favorites
      const { data, error } = await supabase
        .from('profiles')
        .select('favorites')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const currentFavorites = data?.favorites || [];
      
      // Remove the service from favorites
      const updatedFavorites = currentFavorites.filter(id => id !== serviceId);
      
      // Update favorites in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ favorites: updatedFavorites })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      // Update local state
      setFavorites(prev => prev.filter(favorite => favorite.id !== serviceId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const isFavorite = (serviceId: string) => {
    return favorites.some(favorite => favorite.id === serviceId);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites: fetchFavorites
  };
};

export default useFavorites;
