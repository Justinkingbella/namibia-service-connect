
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ServiceData } from '@/types/service';

// Define the form schema
const serviceFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  pricingModel: z.string().min(1, { message: 'Please select a pricing model' }),
  location: z.string().optional(),
  features: z.array(z.string()).optional(),
  image: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export interface CreateServiceFormProps {
  onSubmit: (data: Partial<ServiceData>) => void;
  isSubmitting: boolean;
}

export const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ onSubmit, isSubmitting }) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      category: '',
      pricingModel: 'fixed',
      location: '',
      features: [],
    },
  });

  const handleSubmit = (values: ServiceFormValues) => {
    onSubmit({
      title: values.title,
      description: values.description,
      price: values.price,
      category: values.category,
      pricing_model: values.pricingModel,
      location: values.location,
      features: values.features || [],
      image: values.image || '',
    });
  };

  const categories = [
    'Home Services',
    'Beauty & Wellness',
    'Professional Services',
    'Tech & IT',
    'Events & Entertainment',
    'Education & Tutoring',
    'Health & Fitness',
    'Automotive',
  ];

  const pricingModels = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'daily', label: 'Daily Rate' },
    { value: 'project', label: 'Project Based' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, concise name for your service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          N$
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                name="pricingModel"
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
                        {pricingModels.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
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
                  <FormItem className="col-span-2">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Service location or area covered" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where the service is provided (e.g., Windhoek, Northern Region, Online)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your service in detail..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your service, including what's included and any requirements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Image</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Image URL or upload an image"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add an image URL or upload an image for your service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button">
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Service'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
