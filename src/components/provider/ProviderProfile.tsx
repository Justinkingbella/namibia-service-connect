
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/common/Button';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { DbUserProfile, DbProviderProfile } from '@/types/auth';
import { Avatar } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { User, Building, MapPin, Phone, Mail, Globe, Key, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProviderProfile: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [personalData, setPersonalData] = useState<Partial<DbUserProfile>>({});
  const [businessData, setBusinessData] = useState<Partial<DbProviderProfile>>({});
  const [providerProfile, setProviderProfile] = useState<DbProviderProfile | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);

  // Fetch provider profile data
  React.useEffect(() => {
    const fetchProviderProfile = async () => {
      if (!profile?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', profile.id)
          .single();
          
        if (error) throw error;
        setProviderProfile(data);
      } catch (error) {
        console.error('Error fetching provider profile:', error);
        toast({
          variant: "destructive",
          title: "Failed to load provider profile",
          description: "There was an error loading your provider data."
        });
      } finally {
        setLoadingProvider(false);
      }
    };
    
    fetchProviderProfile();
  }, [profile?.id, toast]);

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleBusinessInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    // Initialize form data with current values
    setPersonalData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
      address: profile?.address || '',
      city: profile?.city || '',
      country: profile?.country || '',
    });
    
    setBusinessData({
      business_name: providerProfile?.business_name || '',
      business_description: providerProfile?.business_description || '',
      phone_number: providerProfile?.phone_number || '',
      email: providerProfile?.email || '',
      website: providerProfile?.website || '',
      address: providerProfile?.address || '',
      city: providerProfile?.city || '',
      country: providerProfile?.country || '',
    });
    
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update personal profile
      if (Object.keys(personalData).length > 0) {
        await updateProfile(personalData);
      }
      
      // Update business profile
      if (Object.keys(businessData).length > 0 && profile?.id) {
        const { error } = await supabase
          .from('service_providers')
          .update(businessData)
          .eq('id', profile.id);
          
        if (error) throw error;
      }
      
      // Refresh provider profile data
      if (profile?.id) {
        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', profile.id)
          .single();
          
        if (error) throw error;
        setProviderProfile(data);
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

  if (loading || loadingProvider) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const verificationStatusColor = {
    'unverified': 'bg-red-100 text-red-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'verified': 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Provider Profile</CardTitle>
              <CardDescription>
                Manage your personal and business information
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
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input 
                      name="first_name"
                      value={personalData.first_name || ''}
                      onChange={handlePersonalInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input 
                      name="last_name"
                      value={personalData.last_name || ''}
                      onChange={handlePersonalInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input 
                      name="phone_number"
                      value={personalData.phone_number || ''}
                      onChange={handlePersonalInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input 
                      name="address"
                      value={personalData.address || ''}
                      onChange={handlePersonalInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input 
                      name="city"
                      value={personalData.city || ''}
                      onChange={handlePersonalInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input 
                      name="country"
                      value={personalData.country || ''}
                      onChange={handlePersonalInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Business Name</label>
                    <Input 
                      name="business_name"
                      value={businessData.business_name || ''}
                      onChange={handleBusinessInputChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Business Description</label>
                    <Textarea 
                      name="business_description"
                      value={businessData.business_description || ''}
                      onChange={handleBusinessInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Email</label>
                    <Input 
                      name="email"
                      value={businessData.email || ''}
                      onChange={handleBusinessInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Phone</label>
                    <Input 
                      name="phone_number"
                      value={businessData.phone_number || ''}
                      onChange={handleBusinessInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input 
                      name="website"
                      value={businessData.website || ''}
                      onChange={handleBusinessInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Address</label>
                    <Input 
                      name="address"
                      value={businessData.address || ''}
                      onChange={handleBusinessInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input 
                      name="city"
                      value={businessData.city || ''}
                      onChange={handleBusinessInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input 
                      name="country"
                      value={businessData.country || ''}
                      onChange={handleBusinessInputChange}
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
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" />
                    ) : (
                      <div className="bg-primary text-white w-full h-full flex items-center justify-center text-3xl">
                        {profile?.first_name?.charAt(0) || 'P'}
                      </div>
                    )}
                  </Avatar>
                  <div className="mt-4 flex flex-col items-center">
                    <h3 className="font-medium text-lg">
                      {profile?.first_name || ''} {profile?.last_name || ''}
                    </h3>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <Badge className={`mt-2 ${verificationStatusColor[providerProfile?.verification_status as 'unverified' | 'pending' | 'verified'] || 'bg-gray-100'}`}>
                      {providerProfile?.verification_status ? 
                        providerProfile.verification_status.charAt(0).toUpperCase() + 
                        providerProfile.verification_status.slice(1) : 
                        'Unverified'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p>{profile?.first_name || ''} {profile?.last_name || ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{profile?.email || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{profile?.phone_number || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>
                          {profile?.city && profile?.country 
                            ? `${profile.city}, ${profile.country}` 
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Business Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Business Name</p>
                      <p className="font-medium text-lg">{providerProfile?.business_name || 'Not specified'}</p>
                      <p className="mt-1">{providerProfile?.business_description || 'No description provided.'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Business Email</p>
                        <p>{providerProfile?.email || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Business Phone</p>
                        <p>{providerProfile?.phone_number || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p>{providerProfile?.website || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Business Address</p>
                        <p>
                          {providerProfile?.address 
                            ? `${providerProfile.address}, ${providerProfile.city || ''} ${providerProfile.country || ''}` 
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Business Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-600">Rating</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium text-xl">
                        {providerProfile?.rating ? providerProfile.rating.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({providerProfile?.rating_count || 0})
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-600">Services</p>
                    <p className="font-medium text-xl mt-1">
                      {providerProfile?.services_count || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-sm text-purple-600">Bookings</p>
                    <p className="font-medium text-xl mt-1">
                      {providerProfile?.completed_bookings || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-sm text-amber-600">Subscription</p>
                    <p className="font-medium text-xl mt-1 capitalize">
                      {providerProfile?.subscription_tier || 'Free'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security
          </CardDescription>
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
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderProfile;
