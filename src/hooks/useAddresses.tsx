
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserAddress } from '@/types/auth';
import { 
  fetchUserAddresses, 
  addUserAddress, 
  updateUserAddress, 
  deleteUserAddress 
} from '@/services/profileService';

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

  const addAddress = async (address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>) => {
    if (!user?.id) return null;

    setLoading(true);
    const newAddress = await addUserAddress(user.id, address);
    
    if (newAddress) {
      // If the new address is default, update existing addresses
      if (newAddress.isDefault) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === newAddress.id
        })));
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      
      toast({
        title: "Address added",
        description: "Your address has been successfully added."
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

  const updateAddress = async (addressId: string, addressData: Partial<Omit<UserAddress, 'id' | 'userId' | 'createdAt'>>) => {
    setLoading(true);
    const success = await updateUserAddress(addressId, addressData);
    
    if (success) {
      // Refresh the address list
      if (user?.id) {
        const updatedAddresses = await fetchUserAddresses(user.id);
        setAddresses(updatedAddresses);
      }
      
      toast({
        title: "Address updated",
        description: "Your address has been successfully updated."
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
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      toast({
        title: "Address removed",
        description: "Your address has been successfully removed."
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
