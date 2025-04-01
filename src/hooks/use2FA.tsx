
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User2FA } from '@/types/auth';
import { fetchUser2FAStatus, enable2FA, disable2FA } from '@/services/profileService';

export function use2FA() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [twoFAStatus, setTwoFAStatus] = useState<User2FA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load2FAStatus = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchUser2FAStatus(user.id);
      setTwoFAStatus(data);
      setLoading(false);
    };

    load2FAStatus();
  }, [user?.id]);

  const enableTwoFA = async (secret: string, backupCodes: string[]) => {
    if (!user?.id) return false;

    setLoading(true);
    const success = await enable2FA(user.id, secret, backupCodes);
    
    if (success) {
      setTwoFAStatus(prev => prev ? { ...prev, isEnabled: true, secret, backupCodes } : null);
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account."
      });
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to enable 2FA",
      description: "There was an error enabling two-factor authentication. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  const disableTwoFA = async () => {
    if (!user?.id) return false;

    setLoading(true);
    const success = await disable2FA(user.id);
    
    if (success) {
      setTwoFAStatus(prev => prev ? { ...prev, isEnabled: false, secret: undefined, backupCodes: undefined } : null);
      
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled for your account."
      });
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Failed to disable 2FA",
      description: "There was an error disabling two-factor authentication. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  return {
    twoFAStatus,
    loading,
    enableTwoFA,
    disableTwoFA
  };
}
