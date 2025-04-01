
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/common/Button';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { DbUserProfile } from '@/types/auth';
import { Avatar } from '@/components/ui/avatar';
import { User, Key, Check } from 'lucide-react';

const AdminProfile: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<DbUserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
      email: profile?.email || '',
      address: profile?.address || '',
      city: profile?.city || '',
      country: profile?.country || '',
      bio: profile?.bio || '',
    });
    setIsEditing(true);
  };

  if (loading) {
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
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>
            Manage your admin account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" />
                ) : (
                  <div className="bg-primary text-white w-full h-full flex items-center justify-center text-3xl">
                    {profile?.first_name?.charAt(0) || 'A'}
                  </div>
                )}
              </Avatar>
              <Button size="sm" variant="outline">Change Avatar</Button>
            </div>
            
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input 
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input 
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input 
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input 
                        name="phone_number"
                        value={formData.phone_number || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input 
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input 
                        name="city"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Input 
                        name="country"
                        value={formData.country || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
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
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                      <p className="text-base">
                        {profile?.first_name || ''} {profile?.last_name || ''}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="text-base">{profile?.email || ''}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                      <p className="text-base">{profile?.phone_number || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                      <p className="text-base capitalize">{profile?.role || 'Admin'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                      <p className="text-base">{profile?.address || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                      <p className="text-base">
                        {profile?.city && profile?.country 
                          ? `${profile.city}, ${profile.country}` 
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button 
                      variant="outline" 
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Permissions</CardTitle>
          <CardDescription>
            Your administrator permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-2 rounded-lg bg-green-50 border border-green-100">
              <Check className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium">User Management</h4>
                <p className="text-sm text-muted-foreground">Manage users and their permissions</p>
              </div>
            </div>
            <div className="flex items-center p-2 rounded-lg bg-green-50 border border-green-100">
              <Check className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium">Provider Verification</h4>
                <p className="text-sm text-muted-foreground">Verify and approve service providers</p>
              </div>
            </div>
            <div className="flex items-center p-2 rounded-lg bg-green-50 border border-green-100">
              <Check className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium">Subscription Management</h4>
                <p className="text-sm text-muted-foreground">Manage subscription plans and tiers</p>
              </div>
            </div>
            <div className="flex items-center p-2 rounded-lg bg-green-50 border border-green-100">
              <Check className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium">Platform Configuration</h4>
                <p className="text-sm text-muted-foreground">Configure platform settings and parameters</p>
              </div>
            </div>
          </div>
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Set Up</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
