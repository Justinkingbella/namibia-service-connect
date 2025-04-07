
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dispute } from '@/types';
import { fetchUserDisputes, fetchProviderDisputes, fetchAllDisputes } from '@/services/mockProfileService';

export function useDisputes() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDisputes([]);
      setLoading(false);
      return;
    }

    const loadDisputes = async () => {
      setLoading(true);
      try {
        let result: Dispute[] = [];
        
        if (user.role === 'admin') {
          result = await fetchAllDisputes();
        } else if (user.role === 'provider') {
          result = await fetchProviderDisputes(user.id);
        } else {
          result = await fetchUserDisputes(user.id);
        }
        
        setDisputes(result);
      } catch (error) {
        console.error('Error loading disputes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDisputes();
  }, [user]);

  return { disputes, loading };
}
