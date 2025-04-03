
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface User2FA {
  userId: string;
  isEnabled: boolean;
  secret?: string;
  backupCodes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export function use2FA() {
  const { user } = useAuth();
  const [twoFAStatus, setTwoFAStatus] = useState<User2FA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch2FAStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_2fa')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error('Error fetching 2FA status:', error);
          }
          // If not found, set default state
          setTwoFAStatus({
            userId: user.id,
            isEnabled: false
          });
        } else {
          setTwoFAStatus({
            userId: data.user_id,
            isEnabled: data.is_enabled,
            secret: data.secret,
            backupCodes: data.backup_codes,
            createdAt: data.created_at ? new Date(data.created_at) : undefined,
            updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
          });
        }
      } catch (error) {
        console.error('Error in fetch2FAStatus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch2FAStatus();
  }, [user]);

  const update2FAStatus = async (isEnabled: boolean): Promise<boolean> => {
    if (!user || !twoFAStatus) return false;

    try {
      const { error } = await supabase
        .from('user_2fa')
        .upsert({
          user_id: user.id,
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating 2FA status:', error);
        return false;
      }

      setTwoFAStatus({
        ...twoFAStatus,
        isEnabled
      });
      
      return true;
    } catch (error) {
      console.error('Error in update2FAStatus:', error);
      return false;
    }
  };

  return {
    twoFAStatus,
    loading,
    update2FAStatus
  };
}
