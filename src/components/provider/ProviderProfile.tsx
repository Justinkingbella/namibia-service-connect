import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/hooks/useProfile';
import { useProviderProfile } from '@/hooks/useProviderProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/avatar';
import { User, Key, MapPin, Phone, Mail, Briefcase, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DbUserProfile, DbProviderProfile, ProviderVerificationStatus } from '@/types/auth';
import { AvatarUpload } from '@/components/ui/avatar-upload';

const ProviderProfile: React.FC = () => {
  const { providerData: providerProfileData, loading, error, updateProviderData, refreshData } = useProviderProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [personalData, setPersonalData] = useState<Partial<DbUserProfile>>({});
  const [localProviderData, setLocalProviderData] = useState<Partial<DbProviderProfile> | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    completedBookings: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!user?.id) return;

      try {
        setLoadingProvider(true);

        // Check if provider exists
        const { data: existingProvider, error: checkError } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (checkError && checkError.code === 'PGRST116') {
          // Create new provider profile
          const { data: newProvider, error: createError } = await supabase
            .from('service_providers')
            .insert({
              id: user.id,
              business_name: '',
              business_description: '',
              verification_status: 'pending' as ProviderVerificationStatus,
              rating: 0,
              rating_count: 0,
              services_count: 0,
              completed_bookings: 0,
              email: user.email || ''
            })
            .select()
            .single();

          if (createError) throw createError;
          setLocalProviderData(newProvider);
          return;
        }

        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const typedData: Partial<DbProviderProfile> = {
          ...data,
          verification_status: data.verification_status as ProviderVerificationStatus
        };

        setLocalProviderData(typedData);

        setStats({
          totalServices: data.services_count || 0,
          completedBookings: data.completed_bookings || 0,
          totalEarnings: 0
        });
      } catch (error) {
        console.error('Error fetching provider data:', error);
        toast({
          variant: "destructive",
          title: "Failed to load provider data",
          description: "There was an error loading your provider profile."
        });
      } finally {
        setLoadingProvider(false);
      }
    };

    fetchProviderData();
  }, [user?.id, toast]);

  useEffect(() => {
    if (user && !isEditing) {
      setPersonalData({
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        phone_number: user.phoneNumber || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
      });
    }
  }, [user, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalProviderData(prev => prev ? { ...prev, [name]: value } : { [name]: value });
  };

  const handleAvatarChange = async (url: string | null) => {
    if (!user?.id) return;

    try {
      // Define updateProfile function locally if it's not available
      const updateProfile = async (data: Partial<DbUserProfile>) => {
        if (!user?.id) return false;
        
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              ...data,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (error) throw error;
          return true;
        } catch (error) {
          console.error('Error updating profile:', error);
          return false;
        }
      };
      
      await updateProfile({ avatar_url: url });
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        variant: "destructive",
        title: "Avatar update failed",
        description: "There was an error updating your profile picture."
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Update profile data
      const updateProfile = async (data: Partial<DbUserProfile>) => {
        if (!user?.id) return false;
        
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              ...data,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (error) throw error;
          return true;
        } catch (error) {
          console.error('Error updating profile:', error);
          return false;
        }
      };
      
      await updateProfile(personalData);

      // Update provider data if needed
      if (localProviderData && user?.id) {
        const { error } = await supabase
          .from('service_providers')
          .update({
            business_name: localProviderData.business_name,
            business_description: localProviderData.business_description,
            email: localProviderData.email,
            phone_number: localProviderData.phone_number,
            address: localProviderData.address,
            city: localProviderData.city,
            country: localProviderData.country,
            website: localProviderData.website
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your provider profile has been updated successfully."
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating provider profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully."
      });

      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: "There was an error changing your password."
      });
      return false;
    }
  };

  if (loading || loadingProvider) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={() => console.log('Save')}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </Avatar>
              
              <AvatarUpload
                currentAvatarUrl={user?.avatarUrl || ''}
                onAvatarChange={handleAvatarChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                {isEditing ? (
                  <Input
                    name="first_name"
                    value={personalData.first_name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{user?.firstName || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                {isEditing ? (
                  <Input
                    name="last_name"
                    value={personalData.last_name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{user?.lastName || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Mail className="inline h-4 w-4 mr-1" /> Email
                </label>
                <p className="text-gray-700">{user?.email || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Phone className="inline h-4 w-4 mr-1" /> Phone Number
                </label>
                {isEditing ? (
                  <Input
                    name="phone_number"
                    value={personalData.phone_number || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{user?.phoneNumber || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MapPin className="inline h-4 w-4 mr-1" /> Location
                </label>
                {isEditing ? (
                  <Input
                    name="location"
                    value={`${personalData.city || ''}, ${personalData.country || ''}`}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="text-gray-700">
                    {user?.city && user?.country ? `${user.city}, ${user.country}` : 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Manage your business details</CardDescription>
        </CardHeader>
        <CardContent>
          {providerProfileData && (
            <div>
              <h3 className="text-lg font-medium mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Name</label>
                  <Input 
                    name="business_name"
                    value={providerProfileData.business_name || ''}
                    onChange={handleProviderInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Email</label>
                  <Input 
                    name="email"
                    value={providerProfileData.email || ''}
                    onChange={handleProviderInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Phone</label>
                  <Input 
                    name="phone_number"
                    value={providerProfileData.phone_number || ''}
                    onChange={handleProviderInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input 
                    name="website"
                    value={providerProfileData.website || ''}
                    onChange={handleProviderInputChange}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Business Description</label>
                  <Textarea 
                    name="business_description"
                    value={providerProfileData.business_description || ''}
                    onChange={handleProviderInputChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>Your account verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const currentPassword = prompt("Enter your current password:");
                  if (currentPassword) {
                    const newPassword = prompt("Enter your new password:");
                    if (newPassword) {
                      handlePasswordChange(currentPassword, newPassword);
                    }
                  }
                }}
              >
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provider Statistics</CardTitle>
          <CardDescription>Overview of your provider activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-blue-100 rounded-full mb-3">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">Services</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalServices}</p>
                <p className="text-sm text-muted-foreground">Total services offered</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-3 bg-green-100 rounded-full mb-3">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Bookings</h3>
                <p className="text-3xl font-bold mt-2">{stats.completedBookings}</p>
                <p className="text-sm text-muted-foreground">Completed bookings</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-3 bg-purple-100 rounded-full mb-3">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium">Rating</h3>
                <p className="text-3xl font-bold mt-2">{providerProfileData?.rating || '0.0'}</p>
                <p className="text-sm text-muted-foreground">Average customer rating</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderProfile;
