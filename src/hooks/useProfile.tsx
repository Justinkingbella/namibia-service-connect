
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DbUserProfile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface UseProfileResult {
  profile: DbUserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<DbUserProfile>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export function useProfile(): UseProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DbUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (isMounted && data) {
          setProfile(data as DbUserProfile);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const updateProfile = async (updatedData: Partial<DbUserProfile>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refetch the profile to get updated data
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data as DbUserProfile);
      setError(null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err.message || 'There was an error updating your profile.',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to change your password.',
      });
      return false;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Password updated',
        description: 'Your password has been successfully changed.',
      });
      return true;
    } catch (err: any) {
      console.error('Error updating password:', err);
      toast({
        variant: 'destructive',
        title: 'Password change failed',
        description: err.message || 'There was an error changing your password.',
      });
      return false;
    }
  };

  return { profile, loading, error, updateProfile, updatePassword };
}
