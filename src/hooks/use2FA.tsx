
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User2FA } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

// Mock implementations for now - replace with actual API calls later
const fetchUser2FAStatus = async (userId: string): Promise<User2FA | null> => {
  try {
    const { data, error } = await supabase
      .from('user_2fa')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching 2FA status:', error);
      return null;
    }
    
    return data ? {
      userId: data.user_id,
      isEnabled: data.is_enabled,
      secret: data.secret,
      backupCodes: data.backup_codes
    } : null;
  } catch (err) {
    console.error('Error in fetchUser2FAStatus:', err);
    return null;
  }
};

const enable2FA = async (userId: string) => {
  try {
    // Generate secret and backup codes (this would typically be done by a secure API)
    const secret = 'SECRET_' + Math.random().toString(36).substring(2, 15);
    const backupCodes = Array(5).fill(0).map(() => Math.random().toString(36).substring(2, 10));
    
    const { data, error } = await supabase
      .from('user_2fa')
      .upsert({
        user_id: userId,
        is_enabled: true,
        secret,
        backup_codes: backupCodes
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error enabling 2FA:', error);
      return null;
    }
    
    return {
      secret,
      backupCodes
    };
  } catch (err) {
    console.error('Error in enable2FA:', err);
    return null;
  }
};

const disable2FA = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_2fa')
      .update({ is_enabled: false })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error disabling 2FA:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in disable2FA:', err);
    return false;
  }
};

export function use2FA() {
  const { user } = useAuth();
  const [twoFactorStatus, setTwoFactorStatus] = useState<User2FA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load2FAStatus = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const status = await fetchUser2FAStatus(user.id);
      setTwoFactorStatus(status);
      setLoading(false);
    };

    load2FAStatus();
  }, [user?.id]);

  const enableTwoFactor = async () => {
    if (!user?.id) return null;
    
    setLoading(true);
    const result = await enable2FA(user.id);
    
    if (result) {
      setTwoFactorStatus({
        userId: user.id,
        isEnabled: true,
        secret: result.secret,
        backupCodes: result.backupCodes
      });
      setLoading(false);
      return result;
    }
    
    setLoading(false);
    return null;
  };

  const disableTwoFactor = async () => {
    if (!user?.id) return false;
    
    setLoading(true);
    const success = await disable2FA(user.id);
    
    if (success && twoFactorStatus) {
      setTwoFactorStatus({
        ...twoFactorStatus,
        isEnabled: false
      });
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  return {
    twoFactorStatus,
    loading,
    enableTwoFactor,
    disableTwoFactor
  };
}
