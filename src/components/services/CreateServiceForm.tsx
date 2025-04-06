
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ServiceData, PricingModelEnum } from '@/types/service';
import ImageUpload from "@/components/ui/image-upload";

interface CreateServiceFormProps {
  onSubmit: (data: Partial<ServiceData>) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Partial<ServiceData>;
}

export const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ 
  onSubmit, 
  isSubmitting,
  initialData = {
    title: '',
    description: '',
    price: 0,
    pricing_model: 'HOURLY',
    category: 'home',
    features: [],
    is_active: true,
  }
}) => {
  const [formData, setFormData] = useState<Partial<ServiceData>>(initialData);

  const [imageUrl, setImageUrl] = useState<string>(initialData.image || '');
  const [feature, setFeature] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddFeature = () => {
    if (feature.trim() && formData.features) {
      setFormData({
        ...formData,
        features: [...formData.features, feature.trim()],
      });
      setFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (formData.features) {
      const updatedFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        features: updatedFeatures,
      });
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setFormData({
      ...formData,
      image: url,
    });
  };

  const handleImageChange = (file: File) => {
    // Handle file upload logic if needed
    console.log("File selected:", file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const categories = [
    { value: 'home', label: 'Home Services' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'repair', label: 'Repair' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'moving', label: 'Moving' },
    { value: 'painting', label: 'Painting' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'errand', label: 'Errands' },
    { value: 'professional', label: 'Professional Services' },
    { value: 'freelance', label: 'Freelance Services' },
    { value: 'transport', label: 'Transportation' },
    { value: 'health', label: 'Health & Wellness' },
  ];

  const pricingModels = [
    { value: 'FIXED', label: 'Fixed Price' },
    { value: 'HOURLY', label: 'Hourly Rate' },
    { value: 'DAILY', label: 'Daily Rate' },
    { value: 'PROJECT', label: 'Project-Based' },
    { value: 'QUOTE', label: 'Quote Required' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium mb-1">Service Image</label>
                <ImageUpload
                  initialImage={imageUrl}
                  onImageUpload={handleImageUpload}
                  onChange={handleImageChange}
                  className="h-64"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="title">
                  Service Title
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Professional House Cleaning"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="category">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="price">
                  Price
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="pricing_model">
                  Pricing Model
                </label>
                <Select
                  value={formData.pricing_model}
                  onValueChange={(value) => handleSelectChange('pricing_model', value)}
                >
                  <SelectTrigger id="pricing_model">
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your service in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="location">
                  Service Location
                </label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Windhoek, Namibia"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium mb-1">Service Features</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a feature e.g. Fast Service"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddFeature}>
                    Add
                  </Button>
                </div>
                
                {formData.features && formData.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.features.map((item, index) => (
                      <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded">
                        <span className="text-sm">{item}</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default CreateServiceForm;
