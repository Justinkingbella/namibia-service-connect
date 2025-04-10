
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FavoriteService, Service } from '@/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch favorite services with service details
      const { data, error } = await supabase
        .from('favorite_services')
        .select(`
          id,
          user_id,
          service_id,
          created_at,
          service:service_id (*)
        `)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }

      // Map to FavoriteService type with proper null handling
      const mappedFavorites: FavoriteService[] = data.map(item => {
        // Use proper type checking and defaults for service data
        const serviceData = item.service || {};
        
        // Create a properly typed Service object with defaults for missing values
        const serviceObj: Service = {
          id: serviceData.id || '',
          title: serviceData.title || '',
          description: serviceData.description || '',
          price: serviceData.price || 0,
          image: serviceData.image || '',
          provider_id: serviceData.provider_id || '',
          provider_name: serviceData.provider_name || '',
          // Add camelCase variants for compatibility
          providerId: serviceData.provider_id || '',
          providerName: serviceData.provider_name || '',
          category: serviceData.category || '',
          pricingModel: serviceData.pricing_model || '',
          rating: serviceData.rating || 0,
          reviewCount: serviceData.review_count || 0,
          location: serviceData.location || '',
          // Additional properties from type
          features: serviceData.features || [],
          isActive: serviceData.is_active || false,
          createdAt: serviceData.created_at || '',
          updatedAt: serviceData.updated_at || '',
          tags: serviceData.tags || []
        };
        
        return {
          id: item.id,
          user_id: item.user_id,
          service_id: item.service_id,
          created_at: item.created_at,
          // Add camelCase variants for compatibility
          userId: item.user_id,
          serviceId: item.service_id,
          createdAt: item.created_at,
          service: serviceObj
        };
      });
      
      setFavorites(mappedFavorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch favorite services',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (serviceId: string) => {
    if (!user) return false;
    
    try {
      const newFavorite = {
        user_id: user.id,
        service_id: serviceId
      };
      
      const { data, error } = await supabase
        .from('favorite_services')
        .insert(newFavorite)
        .select(`
          id,
          user_id,
          service_id,
          created_at,
          service:service_id (*)
        `)
        .single();
        
      if (error) throw error;
      
      // Add to state with proper mapping
      // Use proper null checking for service
      const serviceData = data.service || {};
      
      // Create a properly typed Service object with defaults for missing values
      const serviceObj: Service = {
        id: serviceData.id || '',
        title: serviceData.title || '',
        description: serviceData.description || '',
        price: serviceData.price || 0,
        image: serviceData.image || '',
        provider_id: serviceData.provider_id || '',
        provider_name: serviceData.provider_name || '',
        // Add camelCase variants for compatibility
        providerId: serviceData.provider_id || '',
        providerName: serviceData.provider_name || '',
        category: serviceData.category || '',
        pricingModel: serviceData.pricing_model || '',
        rating: serviceData.rating || 0,
        reviewCount: serviceData.review_count || 0,
        location: serviceData.location || '',
        // Additional properties
        features: serviceData.features || [],
        isActive: serviceData.is_active || false,
        createdAt: serviceData.created_at || '',
        updatedAt: serviceData.updated_at || ''
      };
      
      const mappedFavorite: FavoriteService = {
        id: data.id,
        user_id: data.user_id,
        service_id: data.service_id,
        created_at: data.created_at,
        // Add camelCase variants for compatibility
        userId: data.user_id,
        serviceId: data.service_id,
        createdAt: data.created_at,
        service: serviceObj
      };
      
      setFavorites([...favorites, mappedFavorite]);
      
      toast({
        title: 'Success',
        description: 'Added to favorites',
      });
      
      return true;
    } catch (err) {
      console.error('Error adding favorite:', err);
      toast({
        title: 'Error',
        description: 'Failed to add to favorites',
        variant: 'destructive'
      });
      return false;
    }
  };

  const removeFavorite = async (serviceId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('favorite_services')
        .delete()
        .eq('user_id', user.id)
        .eq('service_id', serviceId);
        
      if (error) throw error;
      
      // Update state
      setFavorites(favorites.filter(fav => fav.service_id !== serviceId));
      
      toast({
        title: 'Success',
        description: 'Removed from favorites',
      });
      
      return true;
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast({
        title: 'Error',
        description: 'Failed to remove from favorites',
        variant: 'destructive'
      });
      return false;
    }
  };

  const isFavorite = (serviceId: string) => {
    return favorites.some(fav => fav.service_id === serviceId);
  };

  return {
    favorites,
    loading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}
