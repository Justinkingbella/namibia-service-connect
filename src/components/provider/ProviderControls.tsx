
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, DollarSign, MapPin, Award, Users, Bell, MessageSquare, Mail, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProviderControlsProps {
  providerId?: string;
}

const ProviderControls: React.FC<ProviderControlsProps> = ({ providerId }) => {
  const [activeTab, setActiveTab] = useState('availability');
  const [availabilitySettings, setAvailabilitySettings] = useState({
    acceptingBookings: true,
    instantBooking: true,
    advanceBooking: true,
    urgentRequests: true,
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    bookingRequests: true,
    bookingConfirmations: true,
    newMessages: true,
    paymentReceipts: true,
    reviewAlerts: true,
    marketingUpdates: false,
  });
  
  const [weekdays, setWeekdays] = useState({
    monday: { active: true, start: '08:00', end: '17:00' },
    tuesday: { active: true, start: '08:00', end: '17:00' },
    wednesday: { active: true, start: '08:00', end: '17:00' },
    thursday: { active: true, start: '08:00', end: '17:00' },
    friday: { active: true, start: '08:00', end: '17:00' },
    saturday: { active: true, start: '09:00', end: '14:00' },
    sunday: { active: false, start: '09:00', end: '14:00' },
  });
  
  const updateAvailability = (key: string, value: boolean) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const updateNotification = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const updateWeekday = (day: string, field: 'active' | 'start' | 'end', value: boolean | string) => {
    setWeekdays(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Service Provider Controls</CardTitle>
        <CardDescription>
          Manage your availability, pricing, and booking preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="availability" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="availability">
              <Calendar className="h-4 w-4 mr-2" />
              Availability
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="reputation">
              <Award className="h-4 w-4 mr-2" />
              Reputation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="availability" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Booking Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Accept Bookings</h4>
                    <p className="text-sm text-muted-foreground">Allow customers to book your services</p>
                  </div>
                  <Switch 
                    id="accepting-bookings"
                    checked={availabilitySettings.acceptingBookings}
                    onCheckedChange={(value) => updateAvailability('acceptingBookings', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Instant Booking</h4>
                    <p className="text-sm text-muted-foreground">Allow bookings without manual confirmation</p>
                  </div>
                  <Switch 
                    id="instant-booking"
                    checked={availabilitySettings.instantBooking}
                    onCheckedChange={(value) => updateAvailability('instantBooking', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Advance Booking</h4>
                    <p className="text-sm text-muted-foreground">Allow customers to book in advance</p>
                  </div>
                  <Switch 
                    id="advance-booking"
                    checked={availabilitySettings.advanceBooking}
                    onCheckedChange={(value) => updateAvailability('advanceBooking', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Urgent Requests</h4>
                    <p className="text-sm text-muted-foreground">Accept urgent/same-day service requests</p>
                  </div>
                  <Switch 
                    id="urgent-requests"
                    checked={availabilitySettings.urgentRequests}
                    onCheckedChange={(value) => updateAvailability('urgentRequests', value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Working Hours</h3>
              <div className="space-y-4">
                {Object.entries(weekdays).map(([day, settings]) => (
                  <div key={day} className="flex items-center p-4 border rounded-lg">
                    <div className="w-1/4">
                      <div className="flex items-center">
                        <Switch 
                          id={`day-${day}`}
                          checked={settings.active}
                          onCheckedChange={(value) => updateWeekday(day, 'active', value)}
                          className="mr-2"
                        />
                        <Label htmlFor={`day-${day}`} className="capitalize">
                          {day}
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center w-3/4">
                      <div className="flex items-center space-x-2 w-full justify-end">
                        <div className={`flex items-center ${!settings.active && 'opacity-50'}`}>
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <input
                            type="time"
                            value={settings.start}
                            onChange={(e) => updateWeekday(day, 'start', e.target.value)}
                            disabled={!settings.active}
                            className="border rounded p-1"
                          />
                          <span className="mx-2">to</span>
                          <input
                            type="time"
                            value={settings.end}
                            onChange={(e) => updateWeekday(day, 'end', e.target.value)}
                            disabled={!settings.active}
                            className="border rounded p-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pricing" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing Models</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Hourly Rate</h4>
                    <Switch 
                      id="hourly-rate"
                      checked={true}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="standard-rate">Standard Rate (N$ per hour)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="standard-rate"
                          type="number"
                          min="0"
                          defaultValue="250"
                          className="w-full pl-10 p-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="premium-rate">Premium/Urgent Rate (N$ per hour)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="premium-rate"
                          type="number"
                          min="0"
                          defaultValue="350"
                          className="w-full pl-10 p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Fixed Price</h4>
                    <Switch 
                      id="fixed-price"
                      checked={true}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set specific fixed prices for individual services in the Service Management section.
                  </p>
                  <Button variant="outline" size="sm">
                    Manage Fixed Price Services
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Service Area</h3>
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <h4 className="font-medium">Service Locations</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primary-location">Primary Location</Label>
                    <select
                      id="primary-location"
                      className="w-full p-2 mt-1 border rounded-md"
                      defaultValue="Windhoek"
                    >
                      <option value="Windhoek">Windhoek</option>
                      <option value="Swakopmund">Swakopmund</option>
                      <option value="Walvis Bay">Walvis Bay</option>
                      <option value="Oshakati">Oshakati</option>
                      <option value="Rundu">Rundu</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="service-radius">Service Radius (km)</Label>
                    <input
                      id="service-radius"
                      type="number"
                      min="0"
                      defaultValue="25"
                      className="w-full p-2 mt-1 border rounded-md"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="travel-fee">Charge Travel Fee</Label>
                    <Switch id="travel-fee" defaultChecked={true} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Booking Requests</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts for new booking requests</p>
                  </div>
                  <Switch 
                    id="booking-requests"
                    checked={notificationSettings.bookingRequests}
                    onCheckedChange={(value) => updateNotification('bookingRequests', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Booking Confirmations</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts when bookings are confirmed</p>
                  </div>
                  <Switch 
                    id="booking-confirmations"
                    checked={notificationSettings.bookingConfirmations}
                    onCheckedChange={(value) => updateNotification('bookingConfirmations', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">New Messages</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts for new customer messages</p>
                  </div>
                  <Switch 
                    id="new-messages"
                    checked={notificationSettings.newMessages}
                    onCheckedChange={(value) => updateNotification('newMessages', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Payment Receipts</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts for payment receipts</p>
                  </div>
                  <Switch 
                    id="payment-receipts"
                    checked={notificationSettings.paymentReceipts}
                    onCheckedChange={(value) => updateNotification('paymentReceipts', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Review Alerts</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts when customers leave reviews</p>
                  </div>
                  <Switch 
                    id="review-alerts"
                    checked={notificationSettings.reviewAlerts}
                    onCheckedChange={(value) => updateNotification('reviewAlerts', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Marketing Updates</h4>
                    <p className="text-sm text-muted-foreground">Receive platform news and promotional offers</p>
                  </div>
                  <Switch 
                    id="marketing-updates"
                    checked={notificationSettings.marketingUpdates}
                    onCheckedChange={(value) => updateNotification('marketingUpdates', value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Communication Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    <span>In-App Messages</span>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reputation" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reputation Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Rating</p>
                        <div className="flex items-center mt-1">
                          <h3 className="text-2xl font-bold">4.8</h3>
                          <div className="flex ml-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Based on 92 reviews</p>
                      </div>
                      <Award className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Retention</p>
                        <h3 className="text-2xl font-bold">78%</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> +5% vs. previous period
                        </p>
                      </div>
                      <Users className="h-10 w-10 text-primary-foreground bg-primary rounded-full p-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">3 days ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-2">
                        "Excellent service! The cleaner was thorough, professional, and finished ahead of schedule."
                      </p>
                      <Button size="sm" variant="ghost" className="mt-2 h-auto py-1 px-2 text-xs">
                        Respond
                      </Button>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Michael Brown</p>
                            <div className="flex items-center">
                              {[1, 2, 3, 4].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">1 week ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-2">
                        "Good service, but they were a little late. Otherwise did a great job cleaning my apartment."
                      </p>
                      <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                        <p className="font-medium text-xs mb-1">Your Response:</p>
                        "Thank you for your feedback, Michael. We apologize for the delay and are working on improving our scheduling."
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Reviews
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProviderControls;
