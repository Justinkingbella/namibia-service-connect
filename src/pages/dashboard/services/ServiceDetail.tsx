
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@/components/ui/tabs';
import { ServiceData } from '@/types/service';
import { AlertCircle } from 'lucide-react';
import { Calendar, Clock, MapPin, User, Tag, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useServiceStore } from '@/store/serviceStore';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { services } = useServiceStore();

  useEffect(() => {
    // First check if the service exists in the store
    const storeService = services.find(s => s.id === id);
    if (storeService) {
      setService(storeService);
      setLoading(false);
      return;
    }

    // If not in store, fetch it from the database
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .single();
        
        if (fetchError) throw fetchError;
        
        if (data) {
          setService(data as ServiceData);
        } else {
          setError('Service not found');
        }
      } catch (err: any) {
        console.error('Error fetching service:', err);
        setError(err.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [id, services]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !service) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Service not found'}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </DashboardLayout>
    );
  }

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };

  const formatPricingModel = (model: string) => {
    switch (model) {
      case 'hourly': return '/hour';
      case 'daily': return '/day';
      case 'fixed': return ' flat rate';
      case 'project': return ' per project';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        <h1 className="text-2xl font-bold">{service.title}</h1>
        <div className="flex-grow"></div>
        <Badge variant={service.is_active ? "default" : "secondary"}>
          {service.is_active ? "Active" : "Inactive"}
        </Badge>
        {service.featured && (
          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
            Featured
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              {service.image ? (
                <div className="mb-6 rounded-lg overflow-hidden h-64 w-full">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="mb-6 bg-muted rounded-lg h-64 w-full flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
              
              <Tabs defaultValue="description">
                <TabList>
                  <Tab value="description">Description</Tab>
                  <Tab value="features">Features</Tab>
                  <Tab value="faqs">FAQs</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel value="description">
                    <div className="py-4">
                      <p className="whitespace-pre-wrap">{service.description}</p>
                    </div>
                  </TabPanel>
                  <TabPanel value="features">
                    <div className="py-4">
                      {service.features && service.features.length > 0 ? (
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No features specified</p>
                      )}
                    </div>
                  </TabPanel>
                  <TabPanel value="faqs">
                    <div className="py-4">
                      {service.faqs && Array.isArray(service.faqs) && service.faqs.length > 0 ? (
                        <div className="space-y-4">
                          {service.faqs.map((faq, index) => (
                            <div key={index}>
                              <h3 className="font-medium mb-1">{faq.question}</h3>
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No FAQs available</p>
                      )}
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>
              <div className="text-3xl font-bold mb-6">
                ${service.price}{' '}
                <span className="text-lg font-normal text-muted-foreground">
                  {formatPricingModel(service.pricing_model)}
                </span>
              </div>
              
              <Button className="w-full mb-4">Book Now</Button>
              <Button variant="outline" className="w-full">Contact Provider</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p>{service.provider_name || 'Unknown Provider'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Tag className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{formatCategory(service.category)}</p>
                </div>
              </div>
              
              {service.location && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{service.location}</p>
                  </div>
                </div>
              )}
              
              {service.created_at && (
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p>{new Date(service.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              
              {service.updated_at && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Updated</p>
                    <p>{new Date(service.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceDetail;
