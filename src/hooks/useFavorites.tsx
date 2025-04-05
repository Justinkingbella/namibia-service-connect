
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FavoriteService } from '@/types/service';

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
              id, title, description, price, image, provider_id, provider_name
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Create properly structured favorites with default values for missing properties
        const processedFavorites: FavoriteService[] = (data || []).map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          service_id: item.service_id,
          created_at: item.created_at,
          service: {
            id: item.service?.id || '',
            title: item.service?.title || '',
            description: item.service?.description || '',
            price: item.service?.price || 0,
            image: item.service?.image,
            provider_id: item.service?.provider_id || '',
            provider_name: item.service?.provider_name || ''
          }
        }));
        
        setFavorites(processedFavorites);
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
            id, title, description, price, image, provider_id, provider_name
          )
        `)
        .single();

      if (error) throw error;

      if (data) {
        const newFavorite: FavoriteService = {
          id: data.id,
          user_id: data.user_id,
          service_id: data.service_id,
          created_at: data.created_at,
          service: {
            id: data.service?.id || '',
            title: data.service?.title || '',
            description: data.service?.description || '',
            price: data.service?.price || 0,
            image: data.service?.image,
            provider_id: data.service?.provider_id || '',
            provider_name: data.service?.provider_name || ''
          }
        };
        setFavorites(prev => [...prev, newFavorite]);
      }
      
      toast.success('Added to favorites');
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
