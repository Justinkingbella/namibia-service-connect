
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { User } from '@/types/auth';

interface ExtendedUser extends User {
  phoneNumber?: string;
  birthDate?: string | Date;
}

const UserProfile = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatarUrl: '',
    birthDate: undefined as Date | undefined
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>();

  useEffect(() => {
    if (user) {
      const extendedUser = user as ExtendedUser;
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: extendedUser.phoneNumber || '',
        avatarUrl: user.avatarUrl || '',
        birthDate: extendedUser.birthDate ? new Date(extendedUser.birthDate) : undefined
      });
      setDate(extendedUser.birthDate ? new Date(extendedUser.birthDate as string) : undefined);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to update your profile');
      navigate('/auth/sign-in');
      return;
    }

    setIsSaving(true);
    try {
      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        avatar_url: formData.avatarUrl,
        updated_at: new Date().toISOString(),
        birth_date: date ? date.toISOString() : null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="avatarUrl">Avatar</Label>
            <div className="mt-2 flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                {formData.avatarUrl ? (
                  <AvatarImage src={formData.avatarUrl} alt="Avatar" />
                ) : (
                  <AvatarFallback>{formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                {isEditing ? (
                  <Input
                    type="url"
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring focus:ring-primary/50"
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring focus:ring-primary/50"
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
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring focus:ring-primary/50"
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
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring focus:ring-primary/50"
            />
          </div>
          <div>
            <Label>Birth Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={!isEditing}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={!isEditing}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end space-x-2">
            {!isEditing ? (
              <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phoneNumber: userProfile?.phoneNumber || '',
                    avatarUrl: user.avatarUrl || '',
                    birthDate: userProfile?.birthDate ? new Date(userProfile.birthDate) : undefined
                  });
                  setDate(userProfile?.birthDate ? new Date(userProfile.birthDate) : undefined);
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </form>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
