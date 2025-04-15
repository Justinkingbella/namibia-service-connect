import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';
import { toast } from 'sonner';

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
      // Get favorite service IDs from the customer profile
      const { data: profileData, error: profileError } = await supabase
        .from('customer_profiles')
        .select('favorites')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const favoriteIds = profileData?.favorites || [];
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        return;
      }

      // Fetch the actual services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          provider:provider_id (business_name, avatar_url)
        `)
        .in('id', favoriteIds);

      if (servicesError) {
        throw servicesError;
      }

      // Transform data to match Service type
      const transformedFavorites = servicesData.map(service => {
        // Use nullish coalescing to provide default values
        return {
          id: service?.id ?? '',
          title: service?.title ?? '',
          description: service?.description ?? '',
          price: service?.price ?? 0,
          image: service?.image ?? '',
          provider_id: service?.provider_id ?? '',
          provider_name: service?.provider?.business_name ?? '',
          // Keep these aligned with the Service type
          providerId: service?.provider_id ?? '',
          providerName: service?.provider?.business_name ?? '',
          category: service?.category ?? '',
          pricing_model: service?.pricing_model ?? '',
          rating: service?.rating ?? 0,
          review_count: service?.review_count ?? 0,
          location: service?.location ?? '',
          // Handle arrays safely
          features: Array.isArray(service?.features) ? service.features : [],
          is_active: service?.is_active ?? true,
          created_at: service?.created_at ?? '',
          updated_at: service?.updated_at ?? '',
          tags: Array.isArray(service?.tags) ? service.tags : []
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
        .from('customer_profiles')
        .select('favorites')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const currentFavorites = data?.favorites || [];
      
      // Add the service if it's not already in favorites
      if (!currentFavorites.includes(serviceId)) {
        const updatedFavorites = [...currentFavorites, serviceId];
        
        // Update favorites in the database
        const { error: updateError } = await supabase
          .from('customer_profiles')
          .update({ favorites: updatedFavorites })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
        
        // Fetch the service details to add to state
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select(`
            *,
            provider:provider_id (business_name, avatar_url)
          `)
          .eq('id', serviceId)
          .single();

        if (serviceError) throw serviceError;

        const newFavorite = {
          id: serviceData?.id ?? '',
          title: serviceData?.title ?? '',
          description: serviceData?.description ?? '',
          price: serviceData?.price ?? 0,
          image: serviceData?.image ?? '',
          provider_id: serviceData?.provider_id ?? '',
          provider_name: serviceData?.provider?.business_name ?? '',
          // Keep these aligned with the Service type
          providerId: serviceData?.provider_id ?? '',
          providerName: serviceData?.provider?.business_name ?? '',
          category: serviceData?.category ?? '',
          pricing_model: serviceData?.pricing_model ?? '',
          rating: serviceData?.rating ?? 0,
          review_count: serviceData?.review_count ?? 0,
          location: serviceData?.location ?? '',
          // Handle arrays safely
          features: Array.isArray(serviceData?.features) ? serviceData.features : [],
          is_active: serviceData?.is_active ?? true,
          created_at: serviceData?.created_at ?? '',
          updated_at: serviceData?.updated_at ?? '',
          tags: Array.isArray(serviceData?.tags) ? serviceData.tags : []
        };

        setFavorites(prev => [...prev, newFavorite]);
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
        .from('customer_profiles')
        .select('favorites')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const currentFavorites = data?.favorites || [];
      
      // Remove the service from favorites
      const updatedFavorites = currentFavorites.filter(id => id !== serviceId);
      
      // Update favorites in the database
      const { error: updateError } = await supabase
        .from('customer_profiles')
        .update({ favorites: updatedFavorites })
        .eq('user_id', user.id);

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
