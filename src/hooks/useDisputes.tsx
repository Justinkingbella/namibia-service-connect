
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dispute } from '@/types/payments';
import { fetchUserDisputes, createDispute } from '@/services/mockProfileService';

export function useDisputes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDisputes = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchUserDisputes(user.id);
      setDisputes(data);
      setLoading(false);
    };

    loadDisputes();
  }, [user?.id]);

  const submitDispute = async (disputeData: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return null;

    setLoading(true);
    const newDispute = await createDispute({
      ...disputeData,
      customerId: user.id, // Assuming the user submitting is the customer
    });
    
    if (newDispute) {
      setDisputes(prev => [...prev, newDispute]);
      
      toast({
        title: "Dispute submitted",
        description: "Your dispute has been successfully submitted."
      });
      setLoading(false);
      return newDispute;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to submit dispute",
      description: "There was an error submitting your dispute. Please try again."
    });
    
    setLoading(false);
    return null;
  };

  return {
    disputes,
    loading,
    submitDispute
  };
}
