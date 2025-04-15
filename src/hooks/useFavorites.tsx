
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ServiceListItem } from '@/types/service';
import { Json } from '@/types/schema';

interface ServiceWithProvider {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  pricing_model: string;
  created_at: string;
  updated_at: string;
  features: string[];
  tags: string[];
  location: string;
  is_active: boolean;
  provider_id: string;
  provider: {
    business_name: string;
    rating?: number;
    review_count?: number;
  } | null;
}

interface FavoriteWithService {
  id: string;
  created_at: string;
  user_id: string;
  service_id: string;
  service: ServiceWithProvider | null;
}

export interface FavoriteService {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  providerId: string;
  providerName: string;
  category: string;
  rating: number;
  reviewCount: number;
  addedAt: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  
  // Get user favorites with service details
  const fetchFavorites = useCallback(async () => {
    if (!user?.id) return [];
    
    try {
      // Get all favorites with service information
      const { data, error } = await supabase
        .from('favorite_services')
        .select(`
          id,
          created_at,
          user_id,
          service_id,
          service:service_id (
            id,
            title,
            description,
            price,
            image,
            category,
            pricing_model,
            provider_id,
            features,
            tags,
            location,
            is_active,
            created_at,
            updated_at,
            provider:provider_id (
              business_name,
              rating,
              review_count
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data) return [];
      
      // Transform response data
      const favorites: FavoriteService[] = data
        .filter(item => item.service && typeof item.service !== 'string')
        .map((item: any) => {
          if (!item.service || typeof item.service === 'string') {
            return null;
          }
          
          // Check if provider exists and has valid properties
          const provider = item.service.provider || {};
          
          return {
            id: item.id,
            serviceId: item.service.id,
            title: item.service.title,
            description: item.service.description,
            price: item.service.price,
            image: item.service.image,
            providerId: item.service.provider_id,
            providerName: provider.business_name || 'Unknown Provider',
            category: item.service.category,
            rating: provider.rating || 0,
            reviewCount: provider.review_count || 0,
            addedAt: item.created_at
          };
        })
        .filter(Boolean) as FavoriteService[];
      
      return favorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorite services');
      return [];
    }
  }, [user?.id]);
  
  const { data: favorites = [], isLoading, refetch } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: fetchFavorites,
    enabled: !!user?.id
  });

  // Add a service to favorites
  const addToFavorites = async (serviceId: string) => {
    if (!user?.id) {
      toast.error('Please sign in to save this service');
      return false;
    }
    
    try {
      setIsAddingToFavorites(true);
      
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorite_services')
        .select('id')
        .eq('user_id', user.id)
        .eq('service_id', serviceId)
        .maybeSingle();
      
      if (existing) {
        toast.info('This service is already in your favorites');
        return false;
      }
      
      // Add to favorites
      const { error } = await supabase
        .from('favorite_services')
        .insert({ user_id: user.id, service_id: serviceId });
      
      if (error) throw error;
      
      // Get the service details to show in the toast
      const { data: serviceData } = await supabase
        .from('services')
        .select(`
          id, 
          title,
          provider_id,
          provider:provider_id (business_name, rating, review_count)
        `)
        .eq('id', serviceId)
        .single();
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['favorites', user.id] });
      
      toast.success(`${serviceData.title} added to favorites`);
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add service to favorites');
      return false;
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (favoriteId: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('favorite_services')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update the state locally without refetching
      queryClient.invalidateQueries({ queryKey: ['favorites', user.id] });
      
      toast.success('Service removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove service from favorites');
      return false;
    }
  };

  // Check if a service is in favorites
  const isInFavorites = useCallback((serviceId: string) => {
    return favorites.some(fav => fav.serviceId === serviceId);
  }, [favorites]);

  return {
    favorites,
    isLoading,
    isAddingToFavorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    refetch
  };
}
