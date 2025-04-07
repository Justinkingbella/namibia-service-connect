
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FavoriteService } from '@/types/favorites';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('favorite_services')
          .select(`
            *,
            service:service_id (
              id, title, description, price, image, provider_id, provider_name,
              category, pricing_model, rating, review_count, location
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Check if data is an array and handle errors properly
        if (Array.isArray(data) && data.length > 0) {
          // Transform the data to match our FavoriteService interface
          const transformedData: FavoriteService[] = data.map(item => {
            // If service is missing or has an error, provide a fallback
            const serviceData = item.service && 
                               typeof item.service === 'object' && 
                               !('error' in item.service) ? 
                               item.service : 
                               {
                                 id: '',
                                 title: 'Service unavailable',
                                 description: '',
                                 price: 0,
                                 provider_id: '',
                                 provider_name: '',
                               };
                                
            return {
              id: item.id,
              user_id: item.user_id,
              service_id: item.service_id,
              created_at: item.created_at,
              service: serviceData
            };
          });
          
          setFavorites(transformedData);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorite services');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const addFavorite = async (serviceId: string) => {
    if (!user?.id) return false;

    try {
      // Check if already a favorite
      const exists = favorites.some(fav => fav.service_id === serviceId);
      if (exists) {
        return true; // Already a favorite
      }

      const { data, error } = await supabase
        .from('favorite_services')
        .insert({
          user_id: user.id,
          service_id: serviceId
        })
        .select(`
          *,
          service:service_id (
            id, title, description, price, image, provider_id, provider_name,
            category, pricing_model, rating, review_count, location
          )
        `)
        .single();

      if (error) throw error;

      // Handle the case where data.service might be an error object
      if (data && data.service && typeof data.service === 'object' && !('error' in data.service)) {
        const newFavorite: FavoriteService = {
          id: data.id,
          user_id: data.user_id,
          service_id: data.service_id,
          created_at: data.created_at,
          service: data.service
        };
        
        setFavorites(prev => [...prev, newFavorite]);
        toast.success('Added to favorites');
      } else {
        // Even if the service details aren't available, still add the favorite
        const newFavorite: FavoriteService = {
          id: data.id,
          user_id: data.user_id,
          service_id: data.service_id,
          created_at: data.created_at,
          service: {
            id: serviceId,
            title: 'Service details unavailable',
            description: '',
            price: 0,
            provider_id: '',
            provider_name: ''
          }
        };
        
        setFavorites(prev => [...prev, newFavorite]);
        toast.success('Added to favorites');
      }
      
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add to favorites');
      return false;
    }
  };

  const removeFavorite = async (serviceId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('favorite_services')
        .delete()
        .eq('service_id', serviceId)
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.service_id !== serviceId));
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
      return false;
    }
  };

  const isFavorite = (serviceId: string) => {
    return favorites.some(fav => fav.service_id === serviceId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}
