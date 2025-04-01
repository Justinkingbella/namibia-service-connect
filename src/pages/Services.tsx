
import React from 'react';
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

const Services = () => {
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
          image: "/placeholder.svg",
          popular: true,
        },
        {
          title: "Plumbing",
          description: "Expert plumbers for repairs, installations, and maintenance of all plumbing systems.",
          price: "From N$250",
          image: "/placeholder.svg",
          popular: false,
        },
        {
          title: "Electrical Work",
          description: "Certified electricians for installations, repairs, and maintenance of electrical systems.",
          price: "From N$300",
          image: "/placeholder.svg",
          popular: false,
        },
        {
          title: "Gardening & Landscaping",
          description: "Professional gardening services including maintenance, design, and landscaping.",
          price: "From N$200",
          image: "/placeholder.svg",
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
          image: "/placeholder.svg",
          popular: true,
        },
        {
          title: "Courier & Delivery",
          description: "Fast and reliable delivery of packages, documents, and goods.",
          price: "From N$50",
          image: "/placeholder.svg",
          popular: true,
        },
        {
          title: "Car Washing",
          description: "Professional car cleaning services at your location.",
          price: "From N$150",
          image: "/placeholder.svg",
          popular: false,
        },
        {
          title: "Airport Transfers",
          description: "Reliable transportation to and from Hosea Kutako International Airport.",
          price: "From N$350",
          image: "/placeholder.svg",
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
          image: "/placeholder.svg",
          popular: false,
        },
        {
          title: "Legal Consultation",
          description: "Legal advice and consultation from qualified attorneys.",
          price: "From N$500",
          image: "/placeholder.svg",
          popular: false,
        },
        {
          title: "IT Support",
          description: "Technical support and solutions for computer and network issues.",
          price: "From N$300",
          image: "/placeholder.svg",
          popular: true,
        },
        {
          title: "Web Development",
          description: "Custom website design and development for businesses and individuals.",
          price: "From N$2000",
          image: "/placeholder.svg",
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
          image: "/placeholder.svg",
          popular: true,
        },
        {
          title: "Massage Therapy",
          description: "Professional massage services for relaxation and healing.",
          price: "From N$400",
          image: "/placeholder.svg",
          popular: true,
        },
        {
          title: "Yoga Classes",
          description: "Private and group yoga sessions for all levels.",
          price: "From N$150",
          image: "/placeholder.svg",
          popular: false,
        },
        {
          title: "Nutritional Consultation",
          description: "Expert advice on diet and nutrition from certified nutritionists.",
          price: "From N$350",
          image: "/placeholder.svg",
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
        <section className="py-16 md:py-24 bg-gray-50">
          <Container>
            <div className="text-center">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Browse through our wide range of services available across Namibia.
                </p>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Categories Overview */}
        <section className="py-16 md:py-24">
          <Container>
            <FadeIn>
              <h2 className="text-3xl font-bold mb-12 text-center">Browse by Category</h2>
            </FadeIn>
            
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
                  <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center text-center h-full p-6">
                      <div className="bg-primary/10 p-3 rounded-full mb-4">
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
        <section className="py-16 md:py-24 bg-gray-50">
          <Container>
            <FadeIn>
              <h2 className="text-3xl font-bold mb-6 text-center">Featured Services</h2>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
                Explore our most popular services available across Namibia.
              </p>
            </FadeIn>

            <Tabs defaultValue={categories[0].id} className="w-full">
              <TabsList className="w-full flex flex-wrap justify-center mb-8">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
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
                        <Card className="h-full flex flex-col">
                          <div className="aspect-video bg-gray-100 relative">
                            <img 
                              src={service.image} 
                              alt={service.title} 
                              className="w-full h-full object-cover"
                            />
                            {service.popular && (
                              <div className="absolute top-3 right-3">
                                <Badge variant="default">Popular</Badge>
                              </div>
                            )}
                          </div>
                          <CardHeader>
                            <CardTitle>{service.title}</CardTitle>
                            <CardDescription>{service.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="mt-auto flex items-center justify-between">
                            <div className="font-medium text-primary">{service.price}</div>
                            <Button asChild variant="outline" size="sm">
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
              <Button asChild size="lg">
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
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">How It Works</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  Booking a service with Namibia Service Hub is simple and efficient.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={100}>
                <div className="bg-white p-8 rounded-xl shadow-sm border text-center relative">
                  <div className="w-12 h-12 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-4">Find a Service</h3>
                  <p className="text-muted-foreground">
                    Browse through our categories or search for specific services you need.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={200}>
                <div className="bg-white p-8 rounded-xl shadow-sm border text-center relative">
                  <div className="w-12 h-12 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-4">Book a Provider</h3>
                  <p className="text-muted-foreground">
                    Select your preferred service provider and choose a convenient time.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={300}>
                <div className="bg-white p-8 rounded-xl shadow-sm border text-center relative">
                  <div className="w-12 h-12 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-4">Enjoy Quality Service</h3>
                  <p className="text-muted-foreground">
                    The service provider will arrive at the scheduled time. Rate and review afterward.
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg">
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
