
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FavoriteService {
  id: string;
  user_id: string;
  service_id: string;
  created_at: string;
  service?: {
    id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    provider_id: string;
    provider_name: string;
  };
}

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
        setFavorites(data);
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

      setFavorites(prev => [...prev, data as FavoriteService]);
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
