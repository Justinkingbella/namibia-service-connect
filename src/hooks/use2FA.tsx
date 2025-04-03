
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User2FA } from '@/types/auth';
import { fetchUser2FAStatus, enable2FA, disable2FA } from '@/services/mockProfileService';

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
    
    if (success) {
      setTwoFactorStatus({
        userId: user.id,
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
