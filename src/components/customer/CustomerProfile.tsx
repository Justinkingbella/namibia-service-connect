
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const CustomerProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+264 81 123 4567',
    address: '123 Independence Ave, Windhoek, Namibia',
    bio: 'I enjoy finding quality service providers for my home and business needs.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Manage your personal information and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input 
                        id="name" 
                        name="name" 
                        value={profile.name} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <span>{profile.name}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={profile.email} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <span>{profile.email}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={profile.phone} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <span>{profile.phone}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input 
                        id="address" 
                        name="address" 
                        value={profile.address} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <span>{profile.address}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    value={profile.bio} 
                    onChange={handleInputChange} 
                    rows={3} 
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CustomerProfile;
