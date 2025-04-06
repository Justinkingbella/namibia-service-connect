
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingModelEnum, ServiceCategoryEnum, ServiceData } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface CreateServiceFormProps {
  onSubmit: (data: ServiceData) => void;
  initialData?: Partial<ServiceData>;
  isLoading?: boolean;
}

const serviceFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  price: z.coerce.number().min(1, { message: 'Price is required' }),
  category: z.string({ required_error: 'Please select a category' }),
  pricing_model: z.string({ required_error: 'Please select a pricing model' }),
  location: z.string().optional(),
  features: z.string().optional(),
});

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ 
  onSubmit, 
  initialData = {},
  isLoading = false
}) => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState(initialData.image || '');
  
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      price: initialData.price || 0,
      category: initialData.category || '',
      pricing_model: initialData.pricing_model || '',
      location: initialData.location || '',
      features: initialData.features ? initialData.features.join(', ') : '',
    },
  });

  const handleFormSubmit = (values: z.infer<typeof serviceFormSchema>) => {
    try {
      const featuresArray = values.features
        ? values.features.split(',').map(item => item.trim()).filter(item => item)
        : [];

      const serviceData: ServiceData = {
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category,
        pricing_model: values.pricing_model,
        location: values.location,
        features: featuresArray,
        provider_id: '',  // Will be set on the server side with the current user's ID
        provider_name: '',  // Will be set on the server side
        is_active: true,
        image: imageUrl,
      };

      onSubmit(serviceData);
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: 'Error',
        description: 'Failed to create service. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this file to a storage service
      // For now, we'll just set a placeholder URL
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData.id ? 'Edit Service' : 'Create New Service'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your service in detail" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pricing_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pricing model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PricingModelEnum.FIXED}>Fixed Price</SelectItem>
                        <SelectItem value={PricingModelEnum.HOURLY}>Hourly Rate</SelectItem>
                        <SelectItem value={PricingModelEnum.DAILY}>Daily Rate</SelectItem>
                        <SelectItem value={PricingModelEnum.PROJECT}>Project-based</SelectItem>
                        <SelectItem value={PricingModelEnum.QUOTE}>Quote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ServiceCategoryEnum).filter(cat => cat !== 'ALL').map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Service location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Feature 1, Feature 2, Feature 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Service Image</FormLabel>
              <div className="mt-1 flex items-center">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="w-full" 
                />
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img src={imageUrl} alt="Service preview" className="h-32 object-cover rounded-md" />
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData.id ? 'Update Service' : 'Create Service'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateServiceForm;
