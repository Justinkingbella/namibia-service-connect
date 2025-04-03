
import React, { useState } from 'react';
import { Service, ServiceCategory, PricingModel } from '@/types/service';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createService } from '@/services/profileService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check, Home, Truck, Wrench, BookOpen, Code, Flower2, Zap, Droplet, Trash, Grid, ShoppingBag, Briefcase, Heart, Car, Palette } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Update the form state initialization to use proper type
const CreateServiceForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    price: 0,
    pricingModel: 'fixed' as PricingModel,
    category: 'all' as ServiceCategory,
    features: [],
    isActive: true,
  });

  const [newFeature, setNewFeature] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const addFeature = () => {
    if (newFeature.trim() && formData.features) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    if (formData.features) {
      setFormData(prev => ({
        ...prev,
        features: prev.features?.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('You must be logged in to create a service');
      return;
    }
    
    if (!formData.title || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const serviceId = await createService(user.id, formData as any);
      
      if (serviceId) {
        toast.success('Service created successfully');
        navigate('/dashboard/services');
      } else {
        toast.error('Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('An error occurred while creating the service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'cleaning': return <Trash className="h-4 w-4" />;
      case 'repair': return <Wrench className="h-4 w-4" />;
      case 'plumbing': return <Droplet className="h-4 w-4" />;
      case 'electrical': return <Zap className="h-4 w-4" />;
      case 'moving': return <Truck className="h-4 w-4" />;
      case 'painting': return <Palette className="h-4 w-4" />;
      case 'landscaping': return <Flower2 className="h-4 w-4" />;
      case 'tutoring': return <BookOpen className="h-4 w-4" />;
      case 'home': return <Home className="h-4 w-4" />;
      case 'errand': return <ShoppingBag className="h-4 w-4" />;
      case 'professional': return <Briefcase className="h-4 w-4" />;
      case 'freelance': return <Code className="h-4 w-4" />;
      case 'transport': return <Car className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      default: return <Grid className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Home Cleaning Service"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <Select 
                value={formData.category as string} 
                onValueChange={handleSelectChange('category')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="moving">Moving</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="tutoring">Tutoring</SelectItem>
                  <SelectItem value="home">Home Services</SelectItem>
                  <SelectItem value="errand">Errands</SelectItem>
                  <SelectItem value="professional">Professional Services</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="transport">Transportation</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service in detail"
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price*</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price?.toString()}
                onChange={handleNumberChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pricingModel">Pricing Model*</Label>
              <Select 
                value={formData.pricingModel as string} 
                onValueChange={handleSelectChange('pricingModel')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="hourly">Hourly Rate</SelectItem>
                  <SelectItem value="quote">Quote Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Service Features</Label>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                className="flex-1"
              />
              <Button type="button" onClick={addFeature} variant="outline">Add</Button>
            </div>
            
            {formData.features && formData.features.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {formData.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="flex-1">{feature}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No features added yet</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">Service is active and available for booking</Label>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating...' : 'Create Service'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateServiceForm;
