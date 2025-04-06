
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ServiceCategoryEnum, PricingModelEnum } from '@/types';
import { ImageUpload } from '@/components/ui/image-upload';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const schema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  price: z.coerceTo(z.number()).min(0, { message: 'Price must be a positive number' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  pricing_model: z.enum(['FIXED', 'HOURLY', 'DAILY', 'PROJECT', 'QUOTE']),
  image: z.string().optional(),
  location: z.string().optional(),
  features: z.string().optional(),
  is_active: z.boolean().default(true),
});

const pricingOptions = [
  { label: 'Fixed Price', value: 'FIXED' },
  { label: 'Hourly Rate', value: 'HOURLY' },
  { label: 'Daily Rate', value: 'DAILY' },
  { label: 'Project Based', value: 'PROJECT' },
  { label: 'Quote Required', value: 'QUOTE' },
];

export interface CreateServiceFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ onSubmit, isLoading = false, initialData = null }) => {
  const [imageUrl, setImageUrl] = useState(initialData?.image || '');
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: '',
      description: '',
      price: 0,
      category: '',
      pricing_model: 'FIXED',
      image: '',
      location: '',
      features: '',
      is_active: true,
    },
  });

  const handleSubmit = (data: any) => {
    if (!imageUrl) {
      toast({
        title: "Image Required",
        description: "Please upload an image for your service",
        variant: "destructive"
      });
      return;
    }
    
    const features = data.features ? data.features.split(',').map((item: string) => item.trim()) : [];
    
    const serviceData = {
      ...data,
      image: imageUrl,
      features,
    };
    
    onSubmit(serviceData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Professional House Cleaning" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear title helps customers find your service
                  </FormDescription>
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
                      placeholder="Describe your service in detail..."
                      className="resize-none min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of what your service includes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Set the base price for your service
                    </FormDescription>
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
                        {pricingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How you'll charge for this service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
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
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {Object.keys(ServiceCategoryEnum)
                          .filter((key) => key !== 'ALL')
                          .map((category) => (
                            <SelectItem key={category} value={category}>
                              {ServiceCategoryEnum[category as keyof typeof ServiceCategoryEnum]}
                            </SelectItem>
                          ))
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best fits your service
                  </FormDescription>
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
                  <FormDescription>
                    Where is this service available?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Input placeholder="Feature 1, Feature 2, Feature 3" {...field} />
                  </FormControl>
                  <FormDescription>
                    List the key features of your service, separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Set your service as active to make it visible to customers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      initialImage={imageUrl || initialData?.image}
                      onImageUpload={(url) => {
                        setImageUrl(url);
                        field.onChange(url);
                      }}
                      className="w-full max-w-xl mx-auto"
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image that showcases your service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : initialData ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateServiceForm;
