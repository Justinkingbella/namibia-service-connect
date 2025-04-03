
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DbUserProfile, UserAddress, PaymentMethod, User2FA } from '@/types/auth';
import { fetchUserProfile } from '@/services/profileService';
import { updateUserPassword } from '@/services/mockProfileService';

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

      try {
        setLoading(true);
        const data = await fetchUserProfile(user.id);
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          variant: "destructive",
          title: "Profile loading failed",
          description: "There was an error loading your profile."
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id, toast]);

  const updateProfile = async (data: Partial<DbUserProfile>) => {
    if (!user?.id || !profile) return false;

    try {
      setLoading(true);
      // For now, we'll just update the local state
      setProfile(prev => prev ? {...prev, ...data} : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update your profile. Please try again."
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      const success = await updateUserPassword(newPassword);
      
      if (success) {
        toast({
          title: "Password updated",
          description: "Your password has been successfully changed."
        });
        return true;
      }
      
      throw new Error("Failed to change password");
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        variant: "destructive",
        title: "Password change failed",
        description: "Failed to change your password. Please check your current password and try again."
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    changePassword
  };
}
