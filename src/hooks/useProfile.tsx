
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DbUserProfile, UserRole } from '@/types/auth';
import { toast } from 'sonner';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DbUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // Transform snake_case database fields to camelCase for our frontend types
        const transformedProfile: DbUserProfile = {
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          phoneNumber: data.phone_number,
          avatarUrl: data.avatar_url,
          address: data.address,
          city: data.city,
          country: data.country,
          active: data.active,
          preferredLanguage: data.preferred_language,
          bio: data.bio,
          createdAt: data.created_at ? new Date(data.created_at) : undefined,
          updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
          birthDate: data.birth_date ? new Date(data.birth_date) : undefined,
          email: data.email,
          emailVerified: data.email_verified,
          role: data.role as UserRole,
          loyaltyPoints: data.loyalty_points,
          notificationPreferences: data.notification_preferences as any
        };
        
        setProfile(transformedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const updateProfile = async (updates: Partial<DbUserProfile>) => {
    if (!user?.id) return false;

    try {
      // Convert camelCase to snake_case for database
      const snakeCaseUpdates: Record<string, any> = {};
      
      if (updates.firstName !== undefined) snakeCaseUpdates.first_name = updates.firstName;
      if (updates.lastName !== undefined) snakeCaseUpdates.last_name = updates.lastName;
      if (updates.phoneNumber !== undefined) snakeCaseUpdates.phone_number = updates.phoneNumber;
      if (updates.avatarUrl !== undefined) snakeCaseUpdates.avatar_url = updates.avatarUrl;
      if (updates.address !== undefined) snakeCaseUpdates.address = updates.address;
      if (updates.city !== undefined) snakeCaseUpdates.city = updates.city;
      if (updates.country !== undefined) snakeCaseUpdates.country = updates.country;
      if (updates.active !== undefined) snakeCaseUpdates.active = updates.active;
      if (updates.preferredLanguage !== undefined) snakeCaseUpdates.preferred_language = updates.preferredLanguage;
      if (updates.bio !== undefined) snakeCaseUpdates.bio = updates.bio;
      if (updates.birthDate !== undefined) snakeCaseUpdates.birth_date = updates.birthDate;
      if (updates.email !== undefined) snakeCaseUpdates.email = updates.email;
      if (updates.emailVerified !== undefined) snakeCaseUpdates.email_verified = updates.emailVerified;
      if (updates.role !== undefined) snakeCaseUpdates.role = updates.role;
      if (updates.loyaltyPoints !== undefined) snakeCaseUpdates.loyalty_points = updates.loyaltyPoints;
      if (updates.notificationPreferences !== undefined) snakeCaseUpdates.notification_preferences = updates.notificationPreferences;
      
      // Add updated_at
      snakeCaseUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .update(snakeCaseUpdates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  return { profile, loading, updateProfile };
}
