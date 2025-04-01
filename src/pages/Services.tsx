
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Building, Car, Heart, Home, ShoppingBag, Truck, User, Utensils, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/FadeIn';
import ContentBlock from '@/components/content/ContentBlock';
import { getServiceCategories, ServiceCategory } from '@/services/contentService';

const Services = () => {
  const [activeTab, setActiveTab] = useState<string>('home');

  const categories = [
    {
      id: "home",
      name: "Home Services",
      icon: <Home className="h-6 w-6" />,
      description: "Services for your home including cleaning, repairs, and maintenance",
      services: [
        {
          title: "House Cleaning",
          description: "Professional cleaning for homes of all sizes, including deep cleaning and regular maintenance.",
          price: "From N$300",
          image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: true,
        },
        {
          title: "Plumbing",
          description: "Expert plumbers for repairs, installations, and maintenance of all plumbing systems.",
          price: "From N$250",
          image: "https://images.unsplash.com/photo-1573600073955-f15b3b6caab7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: false,
        },
        {
          title: "Electrical Work",
          description: "Certified electricians for installations, repairs, and maintenance of electrical systems.",
          price: "From N$300",
          image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: false,
        },
        {
          title: "Gardening & Landscaping",
          description: "Professional gardening services including maintenance, design, and landscaping.",
          price: "From N$200",
          image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: true,
        },
      ],
    },
    {
      id: "transport",
      name: "Transportation",
      icon: <Car className="h-6 w-6" />,
      description: "Transportation services including delivery, moving, and vehicle services",
      services: [
        {
          title: "Local Moving",
          description: "Professional moving services for homes and offices within the city.",
          price: "From N$500",
          image: "https://images.unsplash.com/photo-1600125693167-04e74c618e23?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: true,
        },
        {
          title: "Courier & Delivery",
          description: "Fast and reliable delivery of packages, documents, and goods.",
          price: "From N$50",
          image: "https://images.unsplash.com/photo-1568010567469-8622db8079bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: true,
        },
        {
          title: "Car Washing",
          description: "Professional car cleaning services at your location.",
          price: "From N$150",
          image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: false,
        },
        {
          title: "Airport Transfers",
          description: "Reliable transportation to and from Hosea Kutako International Airport.",
          price: "From N$350",
          image: "https://images.unsplash.com/photo-1556122071-e404eaedb77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: false,
        },
      ],
    },
    {
      id: "professional",
      name: "Professional Services",
      icon: <User className="h-6 w-6" />,
      description: "Professional services including consulting, legal, and financial services",
      services: [
        {
          title: "Accounting & Tax",
          description: "Professional accounting and tax services for individuals and businesses.",
          price: "From N$400",
          image: "https://images.unsplash.com/photo-1586486855514-8c633cc6fd39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: false,
        },
        {
          title: "Legal Consultation",
          description: "Legal advice and consultation from qualified attorneys.",
          price: "From N$500",
          image: "https://images.unsplash.com/photo-1589578527966-4082d56bf8d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: false,
        },
        {
          title: "IT Support",
          description: "Technical support and solutions for computer and network issues.",
          price: "From N$300",
          image: "https://images.unsplash.com/photo-1573495804664-b1c0849e5ec5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: true,
        },
        {
          title: "Web Development",
          description: "Custom website design and development for businesses and individuals.",
          price: "From N$2000",
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: true,
        },
      ],
    },
    {
      id: "health",
      name: "Health & Wellness",
      icon: <Heart className="h-6 w-6" />,
      description: "Services for your physical and mental wellbeing",
      services: [
        {
          title: "Personal Training",
          description: "Customized fitness programs with certified personal trainers.",
          price: "From N$250",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: true,
        },
        {
          title: "Massage Therapy",
          description: "Professional massage services for relaxation and healing.",
          price: "From N$400",
          image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: true,
        },
        {
          title: "Yoga Classes",
          description: "Private and group yoga sessions for all levels.",
          price: "From N$150",
          image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: false,
        },
        {
          title: "Nutritional Consultation",
          description: "Expert advice on diet and nutrition from certified nutritionists.",
          price: "From N$350",
          image: "https://images.unsplash.com/photo-1551893161-f97de6e1a2a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          popular: false,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-blue-100">
          <Container>
            <ContentBlock 
              pageName="services" 
              blockName="hero"
              showEditButton
              className="text-center"
            >
              {(content) => (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>
          </Container>
        </section>

        {/* Categories Overview */}
        <section className="py-16 md:py-24">
          <Container>
            <ContentBlock 
              pageName="services" 
              blockName="categories"
              showEditButton
              className="text-center mb-12"
            >
              {(content) => (
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
              )}
            </ContentBlock>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: "Home Services", icon: <Home className="h-6 w-6" /> },
                { name: "Transportation", icon: <Car className="h-6 w-6" /> },
                { name: "Professional", icon: <User className="h-6 w-6" /> },
                { name: "Health & Wellness", icon: <Heart className="h-6 w-6" /> },
                { name: "Food & Beverage", icon: <Utensils className="h-6 w-6" /> },
                { name: "Repair & Maintenance", icon: <Wrench className="h-6 w-6" /> },
                { name: "Errands & Delivery", icon: <Truck className="h-6 w-6" /> },
                { name: "Shopping & Personal", icon: <ShoppingBag className="h-6 w-6" /> },
                { name: "Business Services", icon: <Building className="h-6 w-6" /> },
                { name: "All Categories", icon: <ArrowRight className="h-6 w-6" /> },
              ].map((category, index) => (
                <FadeIn key={category.name} delay={index * 50}>
                  <Card className="h-full hover:border-blue-300 transition-colors cursor-pointer hover:shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center text-center h-full p-6">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                        {category.icon}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Featured Services */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-blue-100">
          <Container>
            <ContentBlock 
              pageName="services" 
              blockName="featured"
              showEditButton
              className="text-center mb-12"
            >
              {(content) => (
                <>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                  <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>

            <Tabs defaultValue={categories[0].id} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex justify-center mb-8 bg-white/70 backdrop-blur-sm p-1 rounded-full border border-blue-100 shadow-md mx-auto max-w-fit">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id} 
                    className="flex items-center gap-2 px-4 py-2 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.services.map((service, index) => (
                      <FadeIn key={service.title} delay={index * 100}>
                        <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border border-blue-100">
                          <div className="aspect-video bg-gray-100 relative rounded-t-lg overflow-hidden">
                            <img 
                              src={service.image} 
                              alt={service.title} 
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            {service.popular && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-blue-600">Popular</Badge>
                              </div>
                            )}
                          </div>
                          <CardHeader>
                            <CardTitle className="text-blue-800">{service.title}</CardTitle>
                            <CardDescription>{service.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="mt-auto flex items-center justify-between">
                            <div className="font-medium text-blue-600">{service.price}</div>
                            <Button asChild variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                              <Link to="/auth/sign-in">Book Now</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </FadeIn>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600">
                <Link to="/auth/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <Container>
            <ContentBlock 
              pageName="services" 
              blockName="how_it_works"
              showEditButton
              className="text-center mb-12"
            >
              {(content) => (
                <>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{content.title}</h2>
                  <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    {content.subtitle}
                  </p>
                </>
              )}
            </ContentBlock>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={100}>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 text-center relative hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Find a Service</h3>
                  <p className="text-muted-foreground">
                    Browse through our categories or search for specific services you need.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={200}>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 text-center relative hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Book a Provider</h3>
                  <p className="text-muted-foreground">
                    Select your preferred service provider and choose a convenient time.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={300}>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 text-center relative hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Enjoy Quality Service</h3>
                  <p className="text-muted-foreground">
                    The service provider will arrive at the scheduled time. Rate and review afterward.
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Link to="/how-it-works">
                  Learn More About Our Process
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
