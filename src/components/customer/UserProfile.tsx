
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Phone, User, Edit, Save, Star, Clock, Calendar, CreditCard, Shield, Smartphone, TrendingUp } from 'lucide-react';

interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

interface UserProfileProps {
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+264 81 123 4567',
    birthDate: '1985-06-15',
    address: {
      street: '123 Main Street',
      city: 'Windhoek',
      region: 'Khomas',
      postalCode: '10001',
      country: 'Namibia'
    },
    preferredLanguage: 'English',
    joinDate: new Date(2021, 5, 10), // June 10, 2021
    paymentMethods: [
      { id: 'pm1', type: 'credit_card', name: 'Visa ending in 4242', isDefault: true },
      { id: 'pm2', type: 'e_wallet', name: 'E-Wallet (081 123 4567)', isDefault: false }
    ],
    addresses: [
      {
        id: 'addr1',
        name: 'Home',
        street: '123 Main Street',
        city: 'Windhoek',
        region: 'Khomas',
        postalCode: '10001',
        country: 'Namibia',
        isDefault: true
      },
      {
        id: 'addr2',
        name: 'Work',
        street: '456 Business Avenue',
        city: 'Windhoek',
        region: 'Khomas',
        postalCode: '10002',
        country: 'Namibia',
        isDefault: false
      }
    ]
  });
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  const saveProfile = () => {
    setIsEditing(false);
    // Here you would normally save the profile to the backend
    console.log('Saving profile:', profile);
  };
  
  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAddressChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://via.placeholder.com/150" alt="Profile picture" />
              <AvatarFallback className="text-2xl">SJ</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {profile.email}
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {profile.phone}
                </div>
              </div>
              <div className="flex items-center mt-1 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.address.city}, {profile.address.country}
              </div>
              
              <div className="flex items-center mt-3 text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Member since {formatDate(profile.joinDate)}</span>
              </div>
            </div>
            
            <div>
              {isEditing ? (
                <Button onClick={saveProfile}>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              ) : (
                <Button variant="outline" onClick={toggleEdit}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="addresses">
            <MapPin className="h-4 w-4 mr-2" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <input
                    id="firstName"
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 mt-1 border rounded-md"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <input
                    id="lastName"
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 mt-1 border rounded-md"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 mt-1 border rounded-md"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 mt-1 border rounded-md"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <input
                    id="birthDate"
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 mt-1 border rounded-md"
                  />
                </div>
                
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <select
                    id="language"
                    value={profile.preferredLanguage}
                    onChange={(e) => handleChange('preferredLanguage', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 mt-1 border rounded-md"
                  >
                    <option value="English">English</option>
                    <option value="Afrikaans">Afrikaans</option>
                    <option value="Oshiwambo">Oshiwambo</option>
                    <option value="Otjiherero">Otjiherero</option>
                    <option value="Rukwangali">Rukwangali</option>
                    <option value="Silozi">Silozi</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Service Preferences</CardTitle>
              <CardDescription>
                Customize your service preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceCategory">Preferred Service Categories</Label>
                  <select
                    id="serviceCategory"
                    multiple
                    disabled={!isEditing}
                    className="w-full p-2 mt-1 border rounded-md h-20"
                  >
                    <option value="home">Home Services</option>
                    <option value="errand">Errands</option>
                    <option value="professional">Professional Services</option>
                    <option value="freelance">Freelance Work</option>
                    <option value="transport">Transport</option>
                    <option value="health">Health Services</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="serviceFrequency">Service Frequency</Label>
                  <select
                    id="serviceFrequency"
                    disabled={!isEditing}
                    className="w-full p-2 mt-1 border rounded-md"
                    defaultValue="as_needed"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="as_needed">As Needed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Your Addresses</CardTitle>
                  <CardDescription>
                    Manage your saved addresses for service bookings
                  </CardDescription>
                </div>
                <Button size="sm">Add New Address</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <h3 className="font-medium">{address.name}</h3>
                        {address.isDefault && (
                          <Badge className="ml-2 bg-primary">Default</Badge>
                        )}
                      </div>
                      <div>
                        <Button variant="ghost" size="sm" circle>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{address.street}</p>
                    <p className="text-sm">{address.city}, {address.region} {address.postalCode}</p>
                    <p className="text-sm">{address.country}</p>
                    
                    {!address.isDefault && (
                      <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                        Set as default
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods for service bookings
                  </CardDescription>
                </div>
                <Button size="sm">Add Payment Method</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          {method.type === 'credit_card' ? (
                            <CreditCard className="h-5 w-5 text-primary" />
                          ) : (
                            <Smartphone className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{method.name}</h3>
                          {method.isDefault && (
                            <Badge className="mt-1 bg-primary">Default</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm" circle>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {!method.isDefault && (
                      <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                        Set as default
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your recent payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 text-sm font-medium">Date</th>
                        <th className="text-left p-3 text-sm font-medium">Service</th>
                        <th className="text-left p-3 text-sm font-medium">Amount</th>
                        <th className="text-left p-3 text-sm font-medium">Payment Method</th>
                        <th className="text-left p-3 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3 text-sm">Jun 15, 2023</td>
                        <td className="p-3 text-sm">Home Cleaning</td>
                        <td className="p-3 text-sm">N$500.00</td>
                        <td className="p-3 text-sm">Visa ending in 4242</td>
                        <td className="p-3 text-sm">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Paid
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm">May 22, 2023</td>
                        <td className="p-3 text-sm">Plumbing Repair</td>
                        <td className="p-3 text-sm">N$350.00</td>
                        <td className="p-3 text-sm">E-Wallet</td>
                        <td className="p-3 text-sm">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Paid
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm">Apr 10, 2023</td>
                        <td className="p-3 text-sm">Errand Running</td>
                        <td className="p-3 text-sm">N$150.00</td>
                        <td className="p-3 text-sm">Visa ending in 4242</td>
                        <td className="p-3 text-sm">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Paid
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <Button variant="outline" className="mt-4">
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Last changed 3 months ago
                </p>
                <Button>Change Password</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Login Sessions</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Manage devices where you're currently logged in
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-xs text-muted-foreground">Windhoek, Namibia - Current session</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      This Device
                    </Button>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                    <div>
                      <p className="font-medium">Safari on iPhone</p>
                      <p className="text-xs text-muted-foreground">Windhoek, Namibia - 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Log Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Profile Visibility</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow service providers to see your profile information
                  </p>
                </div>
                <input type="checkbox" defaultChecked={true} className="toggle" />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Communications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about booking updates and offers
                  </p>
                </div>
                <input type="checkbox" defaultChecked={true} className="toggle" />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Location Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your location with service providers
                  </p>
                </div>
                <input type="checkbox" defaultChecked={true} className="toggle" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
