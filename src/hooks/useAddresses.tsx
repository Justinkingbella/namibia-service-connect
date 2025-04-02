
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserAddress } from '@/types/auth';
import {
  fetchUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress
} from '@/services/mockProfileService';

export function useAddresses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchUserAddresses(user.id);
      setAddresses(data);
      setLoading(false);
    };

    loadAddresses();
  }, [user?.id]);

  const addAddress = async (addressData: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>) => {
    if (!user?.id) return null;

    setLoading(true);
    const newAddress = await addUserAddress(user.id, addressData);
    
    if (newAddress) {
      // If the new address is default, update all other addresses
      if (newAddress.isDefault) {
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            isDefault: addr.id === newAddress.id
          }))
        );
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      
      toast({
        title: "Address added",
        description: "Your new address has been added successfully."
      });
      
      setLoading(false);
      return newAddress;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to add address",
      description: "There was an error adding your address. Please try again."
    });
    
    setLoading(false);
    return null;
  };

  const updateAddress = async (addressId: string, addressData: Partial<UserAddress>) => {
    setLoading(true);
    const success = await updateUserAddress(addressId, addressData);
    
    if (success) {
      // Update the address in state
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === addressId 
            ? { ...addr, ...addressData } 
            : addressData.isDefault && addressData.isDefault === true
              ? { ...addr, isDefault: false }
              : addr
        )
      );
      
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully."
      });
      
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to update address",
      description: "There was an error updating your address. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  const removeAddress = async (addressId: string) => {
    setLoading(true);
    const success = await deleteUserAddress(addressId);
    
    if (success) {
      // Remove the address from state
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      toast({
        title: "Address removed",
        description: "Your address has been removed successfully."
      });
      
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to remove address",
      description: "There was an error removing your address. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    removeAddress
  };
}
