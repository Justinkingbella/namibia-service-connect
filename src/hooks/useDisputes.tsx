
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dispute } from '@/types/booking';
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

  const submitDispute = async (disputeData: Partial<Dispute>) => {
    if (!user?.id) return false;

    setLoading(true);
    
    // Add user ID to the dispute data
    const completeDisputeData = {
      ...disputeData,
      customerId: user.id
    };
    
    const dispute = await createDispute(completeDisputeData);
    
    if (dispute) {
      setDisputes(prev => [...prev, dispute]);
      
      toast({
        title: "Dispute submitted",
        description: "Your dispute has been submitted successfully."
      });
      
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to submit dispute",
      description: "There was an error submitting your dispute. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  return {
    disputes,
    loading,
    submitDispute
  };
}
