
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DbUserProfile, UserAddress, PaymentMethod, User2FA } from '@/types/auth';
import { fetchUserProfile, updateUserProfile, updateUserPassword } from '@/services/profileService';

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<DbUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await fetchUserProfile(user.id);
      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [user?.id]);

  const updateProfile = async (data: Partial<DbUserProfile>) => {
    if (!user?.id || !profile) return false;

    setLoading(true);
    const updatedProfile = await updateUserProfile(user.id, data);
    
    if (updatedProfile) {
      setProfile(updatedProfile);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      setLoading(false);
      return true;
    } 
    
    toast({
      variant: "destructive",
      title: "Update failed",
      description: "Failed to update your profile. Please try again."
    });
    
    setLoading(false);
    return false;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.id) return false;

    setLoading(true);
    const success = await updateUserPassword(newPassword);
    
    if (success) {
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed."
      });
      setLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Password change failed",
      description: "Failed to change your password. Please check your current password and try again."
    });
    
    setLoading(false);
    return false;
  };

  return {
    profile,
    loading,
    updateProfile,
    changePassword
  };
}
