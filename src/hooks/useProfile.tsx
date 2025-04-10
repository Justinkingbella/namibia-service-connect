
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DbUserProfile, UserRole } from '@/types';
import { useToast } from './use-toast';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DbUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Convert the data format to match DbUserProfile
        const mappedProfile: DbUserProfile = {
          id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          avatar_url: data.avatar_url,
          email_verified: data.email_verified,
          role: data.role as UserRole,
          is_active: data.active || false,
          created_at: data.created_at,
          updated_at: data.updated_at,
          address: data.address,
          city: data.city,
          country: data.country,
          bio: data.bio,
          birth_date: data.birth_date,
          loyalty_points: data.loyalty_points,
          // Fix notification preferences handling with safe access
          notification_preferences: {
            email: true, // Default values
            sms: false,
            push: true
          }
        };

        // Safely update notification preferences if they exist
        if (data.user_preferences && 
            typeof data.user_preferences === 'object' && 
            data.user_preferences !== null) {
          try {
            // Extract notification preferences safely
            const userPrefs = data.user_preferences;
            if (userPrefs.notification_preferences && 
                typeof userPrefs.notification_preferences === 'object') {
              mappedProfile.notification_preferences = {
                email: userPrefs.notification_preferences.email ?? true,
                sms: userPrefs.notification_preferences.sms ?? false,
                push: userPrefs.notification_preferences.push ?? true
              };
            }
          } catch (prefError) {
            console.error('Error parsing notification preferences:', prefError);
          }
        }

        setProfile(mappedProfile);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (data: Partial<DbUserProfile>) => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name || profile?.first_name,
          last_name: data.last_name || profile?.last_name,
          phone_number: data.phone_number || profile?.phone_number,
          avatar_url: data.avatar_url || profile?.avatar_url,
          bio: data.bio || profile?.bio,
          address: data.address || profile?.address,
          city: data.city || profile?.city,
          country: data.country || profile?.country,
          is_active: data.is_active !== undefined ? data.is_active : profile?.is_active,
          birth_date: data.birth_date || profile?.birth_date,
          email_verified: data.email_verified !== undefined ? data.email_verified : profile?.email_verified,
          loyalty_points: data.loyalty_points !== undefined ? data.loyalty_points : profile?.loyalty_points,
          user_preferences: {
            notification_preferences: data.notification_preferences || profile?.notification_preferences
          }
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...data,
        });
      }

      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating profile:', err);
      toast({
        title: 'Update Failed',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { profile, loading, error, updateProfile };
}
