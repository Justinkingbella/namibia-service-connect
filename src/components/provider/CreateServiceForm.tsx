
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronsUpDown } from 'lucide-react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from '@/components/common/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { PricingModel, ServiceCategory } from '@/types/service';

// Form schema validation with zod
const serviceFormSchema = z.object({
  title: z.string().min(5, {
    message: "Service title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  category: z.string() as z.ZodType<ServiceCategory>,
  pricingModel: z.string() as z.ZodType<PricingModel>,
  price: z.coerce.number().min(10, {
    message: "Price must be at least N$10.",
  }),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional(),
  location: z.string().min(3, {
    message: "Please specify a valid location.",
  }),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const defaultValues: Partial<ServiceFormValues> = {
  title: "",
  description: "",
  category: "home",
  pricingModel: "hourly",
  price: 250,
  isActive: true,
  location: "Windhoek, Namibia",
};

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  all: 'All',
  home: 'Home Services',
  errand: 'Errands',
  professional: 'Professional',
  freelance: 'Freelance',
  transport: 'Transport',
  health: 'Health'
};

const CreateServiceForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues,
  });

  function onSubmit(data: ServiceFormValues) {
    // In a real app, this would be an API call
    console.log(data);
    
    // Show success toast
    toast({
      title: "Service created successfully!",
      description: "Your new service has been created and is now listed.",
    });
    
    // Redirect to services management
    setTimeout(() => {
      navigate('/dashboard/services');
    }, 1500);
  }

  return (
    <div className="p-6 bg-white rounded-xl border shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Create New Service</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Home Cleaning Service" {...field} />
                  </FormControl>
                  <FormDescription>
                    Create a clear, descriptive title for your service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Category */}
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
                      {(Object.keys(CATEGORY_LABELS) as ServiceCategory[])
                        .filter(cat => cat !== 'all')
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {CATEGORY_LABELS[category]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best describes your service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your service in detail..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of what your service includes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pricing Model */}
            <FormField
              control={form.control}
              name="pricingModel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Pricing Model</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hourly" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Hourly Rate
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fixed" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fixed Price
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (N$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {form.watch('pricingModel') === 'hourly' 
                      ? 'Set your hourly rate in Namibian dollars.' 
                      : 'Set your fixed price in Namibian dollars.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Location</FormLabel>
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
            
            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Activate Service
                    </FormLabel>
                    <FormDescription>
                      Make this service visible to customers
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
          </div>
          
          <div className="flex justify-end pt-4 gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard/services')}>
              Cancel
            </Button>
            <Button type="submit">
              Create Service
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateServiceForm;
