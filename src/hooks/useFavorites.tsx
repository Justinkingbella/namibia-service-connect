
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FavoriteService, Service } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { ServiceData } from '@/types/service';

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
          service:services(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Map the data and handle possibly null service
      const mappedFavorites: FavoriteService[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        serviceId: item.service_id,
        createdAt: item.created_at,
        // Only access properties if service is not null
        service: item.service ? {
          id: item.service.id,
          title: item.service.title,
          description: item.service.description || '',
          price: item.service.price || 0,
          image: item.service.image || '',
          provider_id: item.service.provider_id || '',
          provider_name: item.service.provider_name || '',
          category: item.service.category || '',
          pricingModel: item.service.pricing_model || '',
          rating: item.service.rating || 0,
          reviewCount: item.service.review_count || 0,
          location: item.service.location || ''
        } : null
      }));

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
          service:services(*)
        `)
        .single();

      if (error) throw error;

      const newFavorite: FavoriteService = {
        id: data.id,
        userId: data.user_id,
        serviceId: data.service_id,
        createdAt: data.created_at,
        // Safely handle potentially null service data
        service: data.service ? {
          id: data.service.id,
          title: data.service.title,
          description: data.service.description || '',
          price: data.service.price || 0,
          image: data.service.image || '',
          provider_id: data.service.provider_id || '',
          provider_name: data.service.provider_name || '',
          category: data.service.category || '',
          pricingModel: data.service.pricing_model || '',
          rating: data.service.rating || 0,
          reviewCount: data.service.review_count || 0,
          location: data.service.location || ''
        } : null
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

      setFavorites(prev => prev.filter(fav => fav.serviceId !== serviceId));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }, [user]);

  // Check if service is favorite
  const isFavorite = useCallback((serviceId: string): boolean => {
    return favorites.some(fav => fav.serviceId === serviceId);
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
