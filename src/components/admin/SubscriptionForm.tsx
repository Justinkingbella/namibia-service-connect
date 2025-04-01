
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, MinusCircle, Trash2, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubscriptionFeature, SubscriptionPlan } from '@/types/subscription';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Plan name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  billingCycle: z.enum(['monthly', 'yearly']),
  credits: z.coerce.number().int().positive({ message: 'Credits must be a positive integer.' }),
  maxBookings: z.coerce.number().int().positive({ message: 'Maximum bookings must be a positive integer.' }),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema> & {
  features: SubscriptionFeature[];
};

interface SubscriptionFormProps {
  initialData?: SubscriptionPlan | null;
  onSubmit: (data: SubscriptionPlan) => void;
  isSubmitting?: boolean;
}

export const SubscriptionForm = ({ initialData, onSubmit, isSubmitting = false }: SubscriptionFormProps) => {
  const [features, setFeatures] = useState<SubscriptionFeature[]>(
    initialData?.features || [
      { id: crypto.randomUUID(), name: '', description: '', included: true }
    ]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 49.99,
      billingCycle: initialData?.billingCycle || 'monthly',
      credits: initialData?.credits || 100,
      maxBookings: initialData?.maxBookings || 20,
      isPopular: initialData?.isPopular || false,
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      features: features,
    },
  });

  const handleAddFeature = () => {
    setFeatures([
      ...features,
      { id: crypto.randomUUID(), name: '', description: '', included: true }
    ]);
  };

  const handleRemoveFeature = (id: string) => {
    setFeatures(features.filter(feature => feature.id !== id));
  };

  const handleFeatureChange = (id: string, field: keyof SubscriptionFeature, value: any) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, [field]: value } : feature
    ));
  };

  const handleSubmit = (data: FormValues) => {
    // Validate features
    const validFeatures = features.filter(f => f.name.trim() !== '');
    
    if (validFeatures.length === 0) {
      form.setError('root', { 
        message: 'You must add at least one feature to the plan.' 
      });
      return;
    }

    // Make sure all required properties are explicitly assigned to fix the TypeScript error
    const formData: SubscriptionPlan = {
      id: initialData?.id || crypto.randomUUID(),
      name: data.name,
      description: data.description,
      price: data.price,
      billingCycle: data.billingCycle,
      credits: data.credits,
      maxBookings: data.maxBookings,
      features: validFeatures,
      isPopular: data.isPopular || false,
      isActive: data.isActive,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(formData);
  };

  // When isPopular changes in the initialData
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...form.getValues(),
        isPopular: initialData.isPopular,
      });
    }
  }, [initialData?.isPopular]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-3xl mx-auto">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Basic Plan" {...field} disabled={isSubmitting} />
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
                    placeholder="A brief description of what this plan offers"
                    className="resize-none min-h-24"
                    {...field}
                    disabled={isSubmitting}
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
                  <FormLabel>Price (N$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Cycle</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    Amount of credits included in this plan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxBookings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Bookings</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    Maximum bookings allowed per billing cycle.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isPopular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mark as Popular</FormLabel>
                    <FormDescription>
                      Highlight this plan as a popular choice.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Activate or deactivate this plan.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Plan Features</h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={feature.id} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-10 md:col-span-11 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder="Feature name"
                      value={feature.name}
                      onChange={(e) => handleFeatureChange(feature.id, 'name', e.target.value)}
                      className="mb-1"
                      disabled={isSubmitting}
                    />
                    <Input
                      placeholder="Feature description (optional)"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)}
                      className="mb-1"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`feature-included-${index}`}
                      checked={feature.included}
                      onCheckedChange={(checked) => handleFeatureChange(feature.id, 'included', checked)}
                      disabled={isSubmitting}
                    />
                    <label htmlFor={`feature-included-${index}`} className="text-sm cursor-pointer">
                      {feature.included ? 'Included in plan' : 'Not included in plan'}
                    </label>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFeature(feature.id)}
                    disabled={features.length <= 1 || isSubmitting}
                    className="h-9 w-9"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleAddFeature}
            disabled={isSubmitting}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Feature
          </Button>

          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Plan' : 'Create Plan'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
