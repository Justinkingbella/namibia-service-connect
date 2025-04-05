
import React from 'react';
import { useForm } from 'react-hook-form';
import { ServiceData, PricingModel } from '@/types/service';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Create the form schema
const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  pricing_model: z.string(),
  category: z.string(),
  location: z.string().optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface CreateServiceFormProps {
  initialData?: ServiceData;
  onSubmit: (data: ServiceFormData) => void;
  loading?: boolean;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({
  initialData,
  onSubmit,
  loading = false
}) => {
  // Initialize the form
  const { register, handleSubmit, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      pricing_model: initialData?.pricing_model || 'fixed',
      category: initialData?.category || 'home',
      location: initialData?.location || '',
      features: initialData?.features || [],
      tags: initialData?.tags || []
    }
  });

  const pricingModels: PricingModel[] = ['fixed', 'hourly', 'daily', 'project', 'quote'];
  const categories = ['home', 'repair', 'cleaning', 'electrical', 'plumbing', 'tutoring', 'transport', 'health', 'professional'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Service Title
          </label>
          <input
            {...register('title')}
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. Professional House Cleaning"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Detailed description of your service..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Price
            </label>
            <input
              {...register('price')}
              type="number"
              step="0.01"
              id="price"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="pricing_model" className="block text-sm font-medium">
              Pricing Model
            </label>
            <select
              {...register('pricing_model')}
              id="pricing_model"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {pricingModels.map((model) => (
                <option key={model} value={model}>
                  {model.charAt(0).toUpperCase() + model.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              {...register('category')}
              id="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              {...register('location')}
              id="location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g. New York City"
            />
          </div>
        </div>

        {/* You can add more fields here for features, tags, etc. */}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {initialData ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  );
};

export default CreateServiceForm;
