
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FavoriteService } from '@/types/favorites';
import { Service, ServiceData } from '@/types/service';
import { supabase } from '@/integrations/supabase/client';
import { transformServiceData } from '@/services/serviceDataTransformer';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorite_services')
        .select(`
          id,
          user_id,
          service_id,
          created_at,
          services:service_id(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Map the data and handle potentially null service
      const mappedFavorites: FavoriteService[] = data.map(item => {
        // Handle the service data safely
        let serviceData = null;
        if (item.services) {
          // Cast the service data to appropriate type
          const serviceItem = item.services as unknown as ServiceData;
          if (serviceItem) {
            serviceData = transformServiceData(serviceItem);
          }
        }

        return {
          id: item.id,
          user_id: item.user_id,
          service_id: item.service_id,
          created_at: item.created_at,
          // Add camelCase fields for compatibility with components
          userId: item.user_id,
          serviceId: item.service_id,
          createdAt: item.created_at,
          service: serviceData
        };
      });

      setFavorites(mappedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Add to favorites
  const addFavorite = useCallback(async (serviceId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('favorite_services')
        .insert({
          user_id: user.id,
          service_id: serviceId
        })
        .select(`
          id,
          user_id,
          service_id,
          created_at,
          services:service_id(*)
        `)
        .single();

      if (error) throw error;

      // Handle the service data safely
      let serviceData = null;
      if (data.services) {
        // Cast the service data to appropriate type
        const serviceItem = data.services as unknown as ServiceData;
        if (serviceItem) {
          serviceData = transformServiceData(serviceItem);
        }
      }

      const newFavorite: FavoriteService = {
        id: data.id,
        user_id: data.user_id,
        service_id: data.service_id,
        created_at: data.created_at,
        // Add camelCase fields for compatibility with components
        userId: data.user_id,
        serviceId: data.service_id,
        createdAt: data.created_at,
        service: serviceData
      };

      setFavorites(prev => [...prev, newFavorite]);
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  }, [user]);

  // Remove from favorites
  const removeFavorite = useCallback(async (serviceId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorite_services')
        .delete()
        .eq('user_id', user.id)
        .eq('service_id', serviceId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.service_id !== serviceId && fav.serviceId !== serviceId));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }, [user]);

  // Check if service is favorite
  const isFavorite = useCallback((serviceId: string): boolean => {
    return favorites.some(fav => fav.service_id === serviceId || fav.serviceId === serviceId);
  }, [favorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refreshFavorites: fetchFavorites
  };
};
