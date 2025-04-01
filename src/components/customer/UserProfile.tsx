
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, Mail, Phone, User, Edit, Save, Star, Clock, Calendar, 
  CreditCard, Shield, Smartphone, TrendingUp, Loader2, Plus, Trash2, Check
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAddresses } from '@/hooks/useAddresses';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { use2FA } from '@/hooks/use2FA';
import { DbUserProfile, UserAddress, PaymentMethod } from '@/types/auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserProfileProps {
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { addresses, loading: addressesLoading, addAddress, updateAddress, removeAddress } = useAddresses();
  const { paymentMethods, loading: paymentMethodsLoading, addMethod, removeMethod, setDefault } = usePaymentMethods();
  const { twoFAStatus, loading: twoFALoading } = use2FA();
  
  const [editedProfile, setEditedProfile] = useState<Partial<DbUserProfile>>({});
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<UserAddress, 'id' | 'userId' | 'createdAt'>>({
    name: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    isDefault: false
  });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>>({
    type: 'credit_card',
    name: '',
    details: {},
    isDefault: false
  });
  
  const toggleEdit = () => {
    if (isEditing) {
      // Discard changes
      setEditedProfile({});
    } else {
      // Set initial edited values from profile
      setEditedProfile({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        email: profile?.email || '',
        phone_number: profile?.phone_number || '',
        birth_date: profile?.birth_date || '',
        preferred_language: profile?.preferred_language || 'English',
        bio: profile?.bio || '',
      });
    }
    setIsEditing(!isEditing);
  };
  
  const saveProfile = async () => {
    if (await updateProfile(editedProfile)) {
      setIsEditing(false);
      setEditedProfile({});
    }
  };
  
  const handleProfileChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAddressChange = (field: string, value: string) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePaymentMethodChange = (field: string, value: any) => {
    if (field === 'details') {
      setNewPaymentMethod(prev => ({
        ...prev,
        details: {
          ...prev.details,
          ...value
        }
      }));
    } else {
      setNewPaymentMethod(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const submitNewAddress = async () => {
    // Validate address
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.country) {
      return;
    }
    
    const result = await addAddress(newAddress);
    if (result) {
      setIsAddingAddress(false);
      setNewAddress({
        name: '',
        street: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
        isDefault: false
      });
    }
  };
  
  const submitNewPaymentMethod = async () => {
    // Validate payment method
    if (!newPaymentMethod.name || !newPaymentMethod.type) {
      return;
    }
    
    // Add payment method specific validation
    if (newPaymentMethod.type === 'credit_card') {
      if (!newPaymentMethod.details.cardNumber || !newPaymentMethod.details.cardName || 
          !newPaymentMethod.details.expiryDate || !newPaymentMethod.details.cvv) {
        return;
      }
    }
    
    const result = await addMethod(newPaymentMethod);
    if (result) {
      setIsAddingPayment(false);
      setNewPaymentMethod({
        type: 'credit_card',
        name: '',
        details: {},
        isDefault: false
      });
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }
  
  const displayName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'User';
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || "https://via.placeholder.com/150"} alt="Profile picture" />
              <AvatarFallback className="text-2xl">
                {displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {profile?.email || 'No email'}
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {profile?.phone_number || 'No phone number'}
                </div>
              </div>
              <div className="flex items-center mt-1 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {profile?.city ? `${profile.city}, ${profile.country || ''}` : 'No location set'}
              </div>
              
              <div className="flex items-center mt-3 text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Member since {formatDate(profile?.created_at)}</span>
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
                  <Input
                    id="firstName"
                    value={isEditing ? editedProfile.first_name || '' : profile?.first_name || ''}
                    onChange={(e) => handleProfileChange('first_name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={isEditing ? editedProfile.last_name || '' : profile?.last_name || ''}
                    onChange={(e) => handleProfileChange('last_name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedProfile.email || '' : profile?.email || ''}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={isEditing ? editedProfile.phone_number || '' : profile?.phone_number || ''}
                    onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={isEditing ? editedProfile.birth_date || '' : profile?.birth_date || ''}
                    onChange={(e) => handleProfileChange('birth_date', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <select
                    id="language"
                    value={isEditing ? editedProfile.preferred_language || 'English' : profile?.preferred_language || 'English'}
                    onChange={(e) => handleProfileChange('preferred_language', e.target.value)}
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
                
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={isEditing ? editedProfile.bio || '' : profile?.bio || ''}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    disabled={!isEditing}
                    className="w-full mt-1"
                    rows={3}
                  />
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
                <Button size="sm" onClick={() => setIsAddingAddress(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {addressesLoading ? (
                <div className="flex justify-center items-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Loading addresses...</span>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <h3 className="font-medium">{address.name}</h3>
                          {address.isDefault && (
                            <Badge className="ml-2 bg-primary">Default</Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeAddress(address.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">{address.street}</p>
                      <p className="text-sm">{address.city}, {address.region} {address.postalCode}</p>
                      <p className="text-sm">{address.country}</p>
                      
                      {!address.isDefault && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto mt-2 text-sm"
                          onClick={() => updateAddress(address.id, { isDefault: true })}
                        >
                          Set as default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">You haven't added any addresses yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsAddingAddress(true)}
                  >
                    Add your first address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Add Address Dialog */}
          <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Enter the details for your new address.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="addressName">Address Name</Label>
                  <Input
                    id="addressName"
                    placeholder="Home, Work, etc."
                    value={newAddress.name}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    placeholder="123 Main St"
                    value={newAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Windhoek"
                      value={newAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Region/State</Label>
                    <Input
                      id="region"
                      placeholder="Khomas"
                      value={newAddress.region}
                      onChange={(e) => handleAddressChange('region', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="10001"
                      value={newAddress.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Namibia"
                      value={newAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="defaultAddress"
                    checked={newAddress.isDefault}
                    onChange={(e) => handleAddressChange('isDefault', e.target.checked.toString())}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="defaultAddress">Set as default address</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                <Button onClick={submitNewAddress}>Save Address</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <Button size="sm" onClick={() => setIsAddingPayment(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {paymentMethodsLoading ? (
                <div className="flex justify-center items-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Loading payment methods...</span>
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeMethod(method.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {!method.isDefault && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto mt-2 text-sm"
                          onClick={() => setDefault(method.id)}
                        >
                          Set as default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">You haven't added any payment methods yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsAddingPayment(true)}
                  >
                    Add your first payment method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Add Payment Method Dialog */}
          <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Enter the details for your new payment method.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="paymentType">Payment Type</Label>
                  <select
                    id="paymentType"
                    value={newPaymentMethod.type}
                    onChange={(e) => handlePaymentMethodChange('type', e.target.value)}
                    className="w-full p-2 mt-1 border rounded-md"
                  >
                    <option value="credit_card">Credit/Debit Card</option>
                    <option value="e_wallet">E-Wallet</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="paymentName">Name</Label>
                  <Input
                    id="paymentName"
                    placeholder="Personal Card, Business Card, etc."
                    value={newPaymentMethod.name}
                    onChange={(e) => handlePaymentMethodChange('name', e.target.value)}
                  />
                </div>
                
                {newPaymentMethod.type === 'credit_card' && (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="**** **** **** ****"
                        value={newPaymentMethod.details.cardNumber || ''}
                        onChange={(e) => handlePaymentMethodChange('details', { cardNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Card Holder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={newPaymentMethod.details.cardName || ''}
                        onChange={(e) => handlePaymentMethodChange('details', { cardName: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={newPaymentMethod.details.expiryDate || ''}
                          onChange={(e) => handlePaymentMethodChange('details', { expiryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="***"
                          type="password"
                          value={newPaymentMethod.details.cvv || ''}
                          onChange={(e) => handlePaymentMethodChange('details', { cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {newPaymentMethod.type === 'e_wallet' && (
                  <>
                    <div>
                      <Label htmlFor="walletProvider">Wallet Provider</Label>
                      <select
                        id="walletProvider"
                        className="w-full p-2 mt-1 border rounded-md"
                        value={newPaymentMethod.details.provider || ''}
                        onChange={(e) => handlePaymentMethodChange('details', { provider: e.target.value })}
                      >
                        <option value="">Select Provider</option>
                        <option value="paytoday">PayToday</option>
                        <option value="bluewallet">BlueWallet</option>
                        <option value="easywallet">EasyWallet</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="+264 81 XXX XXXX"
                        value={newPaymentMethod.details.phoneNumber || ''}
                        onChange={(e) => handlePaymentMethodChange('details', { phoneNumber: e.target.value })}
                      />
                    </div>
                  </>
                )}
                
                {newPaymentMethod.type === 'bank_transfer' && (
                  <>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <select
                        id="bankName"
                        className="w-full p-2 mt-1 border rounded-md"
                        value={newPaymentMethod.details.bankName || ''}
                        onChange={(e) => handlePaymentMethodChange('details', { bankName: e.target.value })}
                      >
                        <option value="">Select Bank</option>
                        <option value="NED BANK">NED BANK</option>
                        <option value="FNB">FNB</option>
                        <option value="Bank Windhoek">Bank Windhoek</option>
                        <option value="Standard Bank">Standard Bank</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <Input
                        id="accountName"
                        placeholder="John Doe"
                        value={newPaymentMethod.details.accountName || ''}
                        onChange={(e) => handlePaymentMethodChange('details', { accountName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="123456789"
                        value={newPaymentMethod.details.accountNumber || ''}
                        onChange={(e) => handlePaymentMethodChange('details', { accountNumber: e.target.value })}
                      />
                    </div>
                  </>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="defaultPayment"
                    checked={newPaymentMethod.isDefault}
                    onChange={(e) => handlePaymentMethodChange('isDefault', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="defaultPayment">Set as default payment method</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingPayment(false)}>Cancel</Button>
                <Button onClick={submitNewPaymentMethod}>Save Payment Method</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
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
              <Button variant="outline" className="mt-4" as="a" href="/dashboard/customer/payment-history">
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
                  Change your password regularly to keep your account secure
                </p>
                <Button onClick={() => setIsChangingPassword(true)}>Change Password</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Add an extra layer of security to your account
                </p>
                <div className="flex items-center">
                  {twoFALoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    twoFAStatus && twoFAStatus.isEnabled ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <div className="h-4 w-4 mr-2"></div>
                    )
                  )}
                  <span className="mr-4">
                    {twoFAStatus?.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Button variant="outline">
                    {twoFAStatus?.isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </Button>
                </div>
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
      
      {/* Change Password Dialog */}
      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to a new secure one.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />
            </div>
            {passwordData.newPassword && passwordData.confirmPassword && 
             passwordData.newPassword !== passwordData.confirmPassword && (
              <Alert variant="destructive">
                <AlertTitle>Passwords do not match</AlertTitle>
                <AlertDescription>
                  Please make sure your passwords match.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                // Add password change logic here
                setIsChangingPassword(false);
              }}
              disabled={
                !passwordData.currentPassword || 
                !passwordData.newPassword || 
                !passwordData.confirmPassword ||
                passwordData.newPassword !== passwordData.confirmPassword
              }
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
