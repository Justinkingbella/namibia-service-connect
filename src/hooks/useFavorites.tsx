import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FavoriteService } from '@/types/service';
import { useToast } from './use-toast';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchFavorites = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('favorite_services')
        .select('*, service:service_id(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;

      const transformedFavorites: FavoriteService[] = data.map(item => {
        if (!item.service || typeof item.service === 'string' || 'error' in item.service) {
          return {
            id: item.id,
            service_id: item.service_id,
            user_id: item.user_id,
            service: {
              id: item.service_id,
              title: 'Unknown Service',
              description: 'Service information unavailable',
              price: 0,
              provider_id: '',
              provider_name: 'Unknown Provider'
            }
          };
        }
        
        return {
          id: item.id,
          service_id: item.service_id,
          user_id: item.user_id,
          service: {
            id: item.service.id || item.service_id,
            title: item.service.title || 'Untitled Service',
            description: item.service.description || '',
            price: item.service.price || 0,
            image: item.service.image,
            provider_id: item.service.provider_id || '',
            provider_name: item.service.provider_name || 'Unknown Provider',
            category: item.service.category,
            pricingModel: item.service.pricing_model,
            rating: item.service.rating,
            reviewCount: item.service.review_count,
            location: item.service.location
          }
        };
      });

      setFavorites(transformedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: 'Failed to load favorites',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (serviceId: string): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save favorites',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const existingFavorite = favorites.find(f => f.service_id === serviceId);
      
      if (existingFavorite) {
        const { error } = await supabase
          .from('favorite_services')
          .delete()
          .eq('id', existingFavorite.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setFavorites(prev => prev.filter(f => f.id !== existingFavorite.id));
        
        toast({
          title: 'Removed from favorites',
          description: 'Service removed from your favorites',
        });
      } else {
        const { data, error } = await supabase
          .from('favorite_services')
          .insert({
            service_id: serviceId,
            user_id: user.id
          })
          .select('*, service:service_id(*)')
          .single();
        
        if (error) throw error;
        
        const { data: serviceData } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single();
        
        const newFavorite: FavoriteService = {
          id: data.id,
          service_id: data.service_id,
          user_id: data.user_id,
          service: serviceData || {
            id: serviceId,
            title: 'Unknown Service',
            description: 'Service information unavailable',
            price: 0,
            provider_id: '',
            provider_name: 'Unknown Provider'
          }
        };
        
        setFavorites(prev => [...prev, newFavorite]);
        
        toast({
          title: 'Added to favorites',
          description: 'Service added to your favorites',
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Operation failed',
        description: 'Failed to update favorites. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const isFavorite = (serviceId: string): boolean => {
    return favorites.some(f => f.service_id === serviceId);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
  };
}
