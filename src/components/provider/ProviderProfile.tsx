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
import { DbUserProfile, DbProviderProfile, ProviderVerificationStatus, SubscriptionTier } from '@/types/auth';
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
              subscription_tier: 'free' as SubscriptionTier,
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
          verification_status: data.verification_status as ProviderVerificationStatus,
          subscription_tier: data.subscription_tier as SubscriptionTier
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
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
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
      const updateUserProfile = async (data: Partial<DbUserProfile>) => {
        if (!user?.id) return false;
        
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              avatar_url: url,
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

      // Update avatar in profile
      await updateUserProfile({ avatarUrl: url || undefined });

      // Also update in provider profile if applicable
      if (localProviderData) {
        await updateProviderData({ avatar_url: url || undefined });
      }

      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated'
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update avatar'
      });
    }
  };

  const handleEdit = () => {
    if (!providerData) return;

    // Convert snake_case form to camelCase for our internal state
    setEditData({
      businessName: providerData.business_name || '',
      businessDescription: providerData.business_description || '',
      address: providerData.address || '',
      city: providerData.city || '',
      country: providerData.country || '',
      website: providerData.website || '',
      phone: providerData.phone_number || '',
      email: providerData.email || '',
      avatarUrl: providerData.avatar_url || '',
      bannerUrl: providerData.banner_url || '',
      // Use as assertion to match expected type
      verificationStatus: providerData.verification_status as ProviderVerificationStatus || 'pending',
    });
    
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // 1. Update personal details in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: personalData.firstName,
          last_name: personalData.lastName,
          phone_number: personalData.phoneNumber,
          email: personalData.email,
          address: personalData.address,
          city: personalData.city,
          country: personalData.country,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
        
      if (profileError) throw profileError;
      
      // 2. Update provider details in service_providers table
      if (localProviderData) {
        const { error: providerError } = await supabase
          .from('service_providers')
          .update({
            business_name: localProviderData.business_name,
            business_description: localProviderData.business_description,
            phone_number: personalData.phoneNumber,
            email: personalData.email,
            address: personalData.address,
            city: personalData.city,
            country: personalData.country,
            website: localProviderData.website,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id);
          
        if (providerError) throw providerError;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.'
      });
      
      setIsEditing(false);
      
      // Refresh the provider data
      await refreshData();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update profile'
      });
    } finally {
      setIsSaving(false);
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
          <div className="flex justify-between">
            <div>
              <CardTitle>Provider Profile</CardTitle>
              <CardDescription>
                Manage your provider profile information
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-start">
                  <AvatarUpload 
                    userId={user?.id || ''}
                    currentAvatarUrl={user?.avatarUrl}
                    onAvatarChange={handleAvatarChange}
                  />
                </div>
                
                <div className="col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input 
                          name="firstName"
                          value={personalData.firstName || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input 
                          name="lastName"
                          value={personalData.lastName || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input 
                          name="email"
                          value={personalData.email || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input 
                          name="phoneNumber"
                          value={personalData.phoneNumber || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Business Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Business Name</label>
                        <Input 
                          name="business_name"
                          value={localProviderData?.business_name || ''}
                          onChange={handleProviderInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input 
                          name="website"
                          value={localProviderData?.website || ''}
                          onChange={handleProviderInputChange}
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Business Description</label>
                        <Textarea 
                          name="business_description"
                          value={localProviderData?.business_description || ''}
                          onChange={handleProviderInputChange}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input 
                      name="address"
                      value={personalData.address || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input 
                      name="city"
                      value={personalData.city || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input 
                      name="country"
                      value={personalData.country || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white text-4xl">
                      {user?.firstName?.charAt(0) || 'P'}
                    </div>
                  )}
                </Avatar>
                
                <div className="text-center">
                  <h3 className="font-medium text-lg">{user?.firstName} {user?.lastName}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {localProviderData?.verification_status === 'verified' 
                        ? 'Verified Provider' 
                        : 'Pending Verification'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 w-full gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalServices}</p>
                    <p className="text-xs text-muted-foreground">Services</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedBookings}</p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{localProviderData?.rating || 0}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p>{user?.firstName} {user?.lastName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{user?.phoneNumber || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>
                          {user?.city && user?.country 
                            ? `${user.city}, ${user.country}` 
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Business Name</p>
                        <p>{localProviderData?.business_name || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Subscription</p>
                        <p className="capitalize">{localProviderData?.subscription_tier || 'Free'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-start">
                      <User className="h-4 w-4 text-muted-foreground mr-2 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Business Description</p>
                        <p className="mt-1">
                          {localProviderData?.business_description || 'No business description provided.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderProfile;
