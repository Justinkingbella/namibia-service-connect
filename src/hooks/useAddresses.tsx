
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Address {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  region?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return null;

    try {
      const newAddress = {
        ...address,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('user_addresses')
        .insert(newAddress)
        .select()
        .single();

      if (error) throw error;

      // If this is the first address or marked as default, update others
      if (address.is_default) {
        await updateOtherAddressesDefaultStatus(data.id);
      }

      setAddresses(prev => [data, ...prev]);
      toast.success('Address added successfully');
      return data;
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
      return null;
    }
  };

  const updateAddress = async (id: string, updates: Partial<Address>) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // If marking as default, update other addresses
      if (updates.is_default) {
        await updateOtherAddressesDefaultStatus(id);
      }

      // Update local state
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === id 
            ? { ...addr, ...updates, updated_at: new Date().toISOString() }
            : updates.is_default ? { ...addr, is_default: false } : addr
        )
      );

      toast.success('Address updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
      return false;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      // Check if it's the default address
      const addressToDelete = addresses.find(addr => addr.id === id);
      
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // If it was the default address, set a new default
      if (addressToDelete?.is_default) {
        // Get remaining addresses after filtering out the deleted one
        const remainingAddresses = addresses.filter(addr => addr.id !== id);
        
        if (remainingAddresses.length > 0) {
          // Set the first remaining address as default
          await updateAddress(remainingAddresses[0].id, { is_default: true });
        }
      }

      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast.success('Address deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
      return false;
    }
  };

  const setDefaultAddress = async (id: string) => {
    return await updateAddress(id, { is_default: true });
  };

  // Helper function to update other addresses when setting a new default
  const updateOtherAddressesDefaultStatus = async (newDefaultId: string) => {
    try {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .neq('id', newDefaultId)
        .eq('user_id', user?.id || '');
    } catch (error) {
      console.error('Error updating other addresses:', error);
    }
  };

  return {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    defaultAddress: addresses.find(addr => addr.is_default)
  };
}
