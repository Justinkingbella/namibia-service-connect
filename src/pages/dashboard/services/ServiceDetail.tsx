
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  ChevronLeft, 
  Heart,
  Share,
  MessageSquare,
  Shield
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ServiceListItem, PricingModel } from '@/types';

// Mock service data - in a real app, this would come from an API
const mockServices: ServiceListItem[] = [
  {
    id: '1',
    title: 'Professional Home Cleaning',
    category: 'home',
    pricingModel: 'hourly',
    price: 250,
    providerName: 'CleanHome Pro',
    providerId: '1',
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia',
    description: 'Professional home cleaning services tailored to your needs. We provide comprehensive cleaning for all areas of your home, including kitchens, bathrooms, bedrooms, and living spaces. Our trained cleaners use eco-friendly products and follow a detailed checklist to ensure your home is spotless.'
  },
  {
    id: '2',
    title: 'Emergency Plumbing Services',
    category: 'home',
    pricingModel: 'fixed',
    price: 350,
    providerName: 'Plumb Perfect',
    providerId: '2',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    location: 'Windhoek, Namibia',
    description: 'Fast and reliable emergency plumbing services. Available 24/7 for leaks, blockages, burst pipes, and other plumbing emergencies. Our licensed plumbers arrive promptly with all necessary tools and parts to fix your plumbing issues on the spot.'
  }
];

// Mock available time slots
const mockAvailableSlots = [
  { date: '2023-07-01', slots: ['09:00', '11:00', '14:00', '16:00'] },
  { date: '2023-07-02', slots: ['10:00', '13:00', '15:00'] },
  { date: '2023-07-03', slots: ['09:00', '12:00', '17:00'] },
];

const formatPrice = (price: number, model: PricingModel) => {
  return `N$${price}${model === 'hourly' ? '/hr' : ''}`;
};

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Find the service with the matching ID
  const service = mockServices.find(service => service.id === id);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(2); // Default 2 hours for hourly services
  const [notes, setNotes] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pay_today');

  // Calculate total based on selected options
  const calculateTotal = () => {
    if (!service) return 0;
    
    let total = service.pricingModel === 'hourly' 
      ? service.price * duration 
      : service.price;
      
    // Add urgent service fee if applicable
    if (isUrgent) {
      total += total * 0.2; // 20% premium for urgent service
    }
    
    return total;
  };

  const handleBookService = () => {
    // In a real app, this would make an API call to create a booking
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking Successful!",
      description: `Your booking with ${service?.providerName} has been confirmed.`
    });

    // Redirect to the bookings page
    navigate('/dashboard/bookings');
  };

  if (!service) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <Button 
            onClick={() => navigate('/dashboard/services')}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/services')}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        {/* Service Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden h-80">
              <img 
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
            <h1 className="text-xl font-bold">{service.title}</h1>
            
            <div className="flex items-center mt-2 text-sm">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-gray-600">{service.location}</span>
            </div>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-medium">{service.rating.toFixed(1)}</span>
              </div>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-sm text-gray-600">{service.reviewCount} reviews</span>
            </div>
            
            <div className="mt-4 py-4 border-t border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-700">
                  {service.pricingModel === 'hourly' ? (
                    <>
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Hourly Rate</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-5 w-5 mr-2" />
                      <span>Fixed Price</span>
                    </>
                  )}
                </div>
                <div className="text-xl font-bold text-primary">
                  {formatPrice(service.price, service.pricingModel)}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Provided by</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {service.providerName.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="font-medium">{service.providerName}</div>
                  <div className="text-sm text-gray-500">Verified Provider</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button className="w-full">Book Now</Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center flex-1 justify-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex items-center flex-1 justify-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" className="flex items-center flex-1 justify-center">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details and Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4">Service Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {service.description || 'No description available.'}
              </p>
            </div>

            {/* Provider Information */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-bold mb-4">About the Provider</h2>
              <div className="flex gap-4 items-start">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xl">
                  {service.providerName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{service.providerName}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 font-medium">{service.rating.toFixed(1)}</span>
                    </div>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{service.reviewCount} reviews</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Professional service provider in {service.location}. Specializing in {service.category} services.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Reviews</h2>
                <Button variant="outline" size="sm">See All ({service.reviewCount})</Button>
              </div>
              
              <div className="space-y-4">
                {/* Sample reviews - in a real app, these would come from an API */}
                <div className="border-b pb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      J
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">John D.</div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 5 ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500">June 2023</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Excellent service! Very professional and thorough. Would definitely use again.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      M
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">Maria L.</div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 4 ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500">May 2023</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Good service, arrived on time and did a great job. Only giving 4 stars because they could have been more thorough.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-8">
              <h2 className="text-xl font-bold mb-4">Book This Service</h2>
              
              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Date</label>
                <select 
                  className="w-full p-3 border rounded-lg"
                  value={selectedDate || ''}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime(null); // Reset time when date changes
                  }}
                >
                  <option value="" disabled>Select a date</option>
                  {mockAvailableSlots.map(day => (
                    <option key={day.date} value={day.date}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {mockAvailableSlots.find(day => day.date === selectedDate)?.slots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`p-2 border rounded-lg text-center ${
                          selectedTime === time 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Duration Selection (only for hourly services) */}
              {service.pricingModel === 'hourly' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                  <select 
                    className="w-full p-3 border rounded-lg"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
                      <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Special Instructions (Optional)</label>
                <textarea 
                  className="w-full p-3 border rounded-lg min-h-[100px]"
                  placeholder="Add any special requirements or instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              {/* Urgent Service Option */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                  />
                  <span className="ml-2 text-sm font-medium">Request Urgent Service (+20%)</span>
                </label>
              </div>
              
              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select 
                  className="w-full p-3 border rounded-lg"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="pay_today">PayToday</option>
                  <option value="pay_fast">PayFast</option>
                  <option value="e_wallet">E-Wallet</option>
                  <option value="dop">DOP</option>
                  <option value="easy_wallet">Easy Wallet</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash on Delivery</option>
                </select>
              </div>
              
              {/* Price Breakdown */}
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-2">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>
                      {service.pricingModel === 'hourly' 
                        ? `N$${service.price} x ${duration} hrs` 
                        : `N$${service.price}`
                      }
                    </span>
                  </div>
                  
                  {isUrgent && (
                    <div className="flex justify-between text-amber-600">
                      <span>Urgent Service Fee (20%)</span>
                      <span>
                        +N${(service.pricingModel === 'hourly' 
                          ? service.price * duration * 0.2 
                          : service.price * 0.2).toFixed(2)
                        }
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Total</span>
                    <span>N${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6"
                onClick={handleBookService}
                disabled={!selectedDate || !selectedTime}
              >
                Book Now
              </Button>
              
              <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                <Shield className="h-4 w-4 mr-1" />
                <span>Secure booking. Cancel for free up to 24 hours before.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceDetail;
