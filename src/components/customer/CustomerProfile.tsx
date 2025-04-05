import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const CustomerProfile = () => {
  const { user, userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatarUrl: '',
    birthDate: undefined as Date | undefined,
    address: '',
    city: '',
    country: '',
    bio: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile && userProfile.role === 'customer') {
      const profile = userProfile;
      setFormData({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phoneNumber: profile?.phoneNumber || '',
        avatarUrl: profile?.avatarUrl || '',
        birthDate: profile?.birthDate ? new Date(profile.birthDate) : undefined,
        address: profile?.address || '',
        city: profile?.city || '',
        country: profile?.country || '',
        bio: profile?.bio || ''
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prevState => ({
      ...prevState,
      birthDate: date
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to update your profile.',
          variant: 'destructive',
        });
        navigate('/auth/sign-in');
        return;
      }

      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        avatar_url: formData.avatarUrl,
        birth_date: formData.birthDate ? formData.birthDate.toISOString() : null,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update customer specific details
      const customerUpdates = {
        address: formData.address,
        city: formData.city,
        country: formData.country,
        bio: formData.bio
      };

      const { error: customerError } = await supabase
        .from('customers')
        .update(customerUpdates)
        .eq('id', user.id);

      if (customerError) {
        throw customerError;
      }

      // Update the user profile in the AuthContext
      setUserProfile({
        ...userProfile,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        avatarUrl: formData.avatarUrl,
        birthDate: formData.birthDate,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        bio: formData.bio
      });

      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Customer Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label>Birth Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.birthDate ? (
                    format(formData.birthDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.birthDate}
                  onSelect={handleDateChange}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full"
            />
          </div>
           <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="col-span-2 flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={formData.avatarUrl} />
              <AvatarFallback>{formData.firstName ? formData.firstName[0] : ''}{formData.lastName ? formData.lastName[0] : ''}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{formData.firstName} {formData.lastName}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div>
            <p>Phone Number: {formData.phoneNumber || 'Not provided'}</p>
          </div>
           <div>
            <p>Bio: {formData.bio || 'Not provided'}</p>
          </div>
          <div>
            <p>Birth Date: {formData.birthDate ? format(formData.birthDate, "PPP") : 'Not provided'}</p>
          </div>
          <div>
            <p>Address: {formData.address || 'Not provided'}</p>
            <p>City: {formData.city || 'Not provided'}</p>
            <p>Country: {formData.country || 'Not provided'}</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
