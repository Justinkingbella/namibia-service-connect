import React, { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ServiceCategoryEnum, PricingModelEnum } from '@/types';
import ImageUpload from '@/components/ui/image-upload';

interface ServiceFormData {
  title: string;
  description: string;
  category: ServiceCategoryEnum;
  pricing_model: PricingModelEnum;
  pricing_amount: number;
  location: string;
  availability: string;
  images?: string[];
}

interface CreateServiceFormProps {
  onSave: (serviceData: ServiceFormData) => void;
  initialData?: Partial<ServiceFormData>;
  loading?: boolean;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  pricing_model: z.string().min(1, 'Pricing model is required'),
  location: z.string().optional(),
  tags: z.string().optional(),
});

export default function CreateServiceForm({ onSave, initialData = {}, loading }: CreateServiceFormProps) {
  const [serviceImage, setServiceImage] = useState<string>(initialData.image || '');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      price: initialData.price || 0,
      category: initialData.category || '',
      pricing_model: initialData.pricing_model || '',
      location: initialData.location || '',
      tags: initialData.tags ? initialData.tags.join(', ') : '',
    },
  });
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to storage and get URL
      // Here we just create a temporary object URL
      const imageUrl = URL.createObjectURL(file);
      setServiceImage(imageUrl);
    }
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
    
    const serviceData = {
      ...values,
      tags,
      image: serviceImage,
    };
    
    onSave(serviceData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData.id ? 'Edit Service' : 'Create New Service'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. House Cleaning Service" {...field} />
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
                      placeholder="Describe your service..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(ServiceCategoryEnum).map((category) => (
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
                name="pricing_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Model</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(PricingModelEnum).map((model) => (
                          <SelectItem key={model} value={model}>
                            {model.charAt(0) + model.slice(1).toLowerCase().replace('_', ' ')}
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (N$)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
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
                      <Input placeholder="e.g. Windhoek, Namibia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. cleaning, home, professional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Service Image</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </FormControl>
              {serviceImage && (
                <div className="mt-2">
                  <img 
                    src={serviceImage} 
                    alt="Service preview" 
                    className="rounded-md object-cover h-48 w-full"
                  />
                </div>
              )}
            </FormItem>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : initialData.id ? 'Update Service' : 'Create Service'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
