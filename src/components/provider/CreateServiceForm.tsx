import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ImageUpload,
  ImageUploadPreview 
} from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceCategory, PricingModel } from '@/types/service';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(2000),
  category: z.string(),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  pricingModel: z.string(),
  location: z.string().min(3, { message: "Please provide a valid location" }),
  features: z.array(z.string()).optional(),
  faqs: z.array(z.object({
    question: z.string().min(5),
    answer: z.string().min(5)
  })).optional(),
  imageUrl: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  { value: 'home', label: 'Home Services' },
  { value: 'errand', label: 'Errands' },
  { value: 'professional', label: 'Professional Services' },
  { value: 'freelance', label: 'Freelance Services' },
  { value: 'transport', label: 'Transportation' },
  { value: 'health', label: 'Health & Wellness' }
];

const pricingModels = [
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'varying', label: 'Varying (Quote Required)' }
];

const CreateServiceForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'home',
      price: 0,
      pricingModel: 'hourly',
      location: 'Windhoek, Namibia',
      features: [],
      faqs: [],
      imageUrl: ''
    }
  });

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() !== '') {
      setFeatures([...features, newFeature]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    if (newFaq.question.trim() !== '' && newFaq.answer.trim() !== '') {
      setFaqs([...faqs, newFaq]);
      setNewFaq({ question: '', answer: '' });
    }
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a service.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName);
          
        imageUrl = urlData.publicUrl;
      }
      
      const serviceData = {
        title: values.title,
        description: values.description,
        category: values.category,
        price: values.price,
        pricing_model: values.pricingModel,
        location: values.location,
        image: imageUrl || null,
        features: features.length > 0 ? features : null,
        faqs: faqs.length > 0 ? faqs : null,
        provider_id: user.id,
        is_active: true
      };
      
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Service created",
        description: "Your service has been created successfully."
      });
      
      navigate(`/dashboard/services/${data.id}`);
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: "Failed to create service",
        description: "There was an error creating your service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details & Features</TabsTrigger>
              <TabsTrigger value="media">Media & FAQs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    This information will be displayed publicly to potential customers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Professional Home Cleaning" {...field} />
                        </FormControl>
                        <FormDescription>
                          Choose a clear and descriptive title for your service.
                        </FormDescription>
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
                              <SelectItem 
                                key={category.value} 
                                value={category.value}
                              >
                                {category.label}
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              step={0.01} 
                              placeholder="0.00"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Set your price in Namibian dollars (N$).
                          </FormDescription>
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
                                <SelectValue placeholder="Select a pricing model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pricingModels.map((model) => (
                                <SelectItem 
                                  key={model.value} 
                                  value={model.value}
                                >
                                  {model.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How do you want to charge for this service?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Windhoek, Namibia" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where is this service available?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setActiveTab('details')}
                  >
                    Next: Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                  <CardDescription>
                    Provide detailed information about what your service includes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your service in detail..." 
                            className="min-h-[200px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of what your service includes, your experience, and any special qualifications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <FormLabel>Features & Inclusions</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a feature or inclusion..."
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddFeature}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {features.length > 0 && (
                      <ul className="space-y-2 mt-4">
                        {features.map((feature, index) => (
                          <li 
                            key={index}
                            className="flex items-center justify-between bg-secondary/20 p-2 rounded"
                          >
                            <span>{feature}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveFeature(index)}
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setActiveTab('basic')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setActiveTab('media')}
                  >
                    Next: Media & FAQs
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Media & FAQs</CardTitle>
                  <CardDescription>
                    Upload images and add frequently asked questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <FormLabel>Service Image</FormLabel>
                    <FormDescription className="mb-4">
                      Upload a high-quality image that represents your service.
                    </FormDescription>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <ImageUpload onChange={handleImageUpload} currentImage={imagePreview} />
                      </div>
                      
                      {imagePreview && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <ImageUploadPreview src={imagePreview} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <FormLabel>Frequently Asked Questions</FormLabel>
                    <FormDescription>
                      Add common questions and answers to help customers understand your service.
                    </FormDescription>
                    
                    <div className="space-y-4">
                      <Input
                        placeholder="Question"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                      />
                      <Textarea
                        placeholder="Answer"
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddFaq}
                        className="w-full"
                      >
                        Add FAQ
                      </Button>
                    </div>
                    
                    {faqs.length > 0 && (
                      <div className="space-y-4 mt-4">
                        {faqs.map((faq, index) => (
                          <div 
                            key={index}
                            className="bg-secondary/20 p-4 rounded space-y-2"
                          >
                            <div className="flex justify-between">
                              <p className="font-medium">{faq.question}</p>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveFaq(index)}
                              >
                                Remove
                              </Button>
                            </div>
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setActiveTab('details')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Service'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default CreateServiceForm;
