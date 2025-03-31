
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const planFeatures = {
  free: [
    { name: 'Up to 5 bookings per month', included: true },
    { name: 'Standard service listing', included: true },
    { name: 'In-platform messaging', included: true },
    { name: 'Basic analytics', included: true },
    { name: 'Standard commission (10%)', included: true },
    { name: 'Priority in search results', included: false },
    { name: 'Urgent booking requests', included: false },
    { name: 'Dedicated account manager', included: false },
    { name: 'Custom branding options', included: false },
  ],
  pro: [
    { name: 'Unlimited bookings', included: true },
    { name: 'Premium service listing', included: true },
    { name: 'In-platform messaging', included: true },
    { name: 'Advanced analytics', included: true },
    { name: 'Reduced commission (8%)', included: true },
    { name: 'Priority in search results', included: true },
    { name: 'Urgent booking requests', included: true },
    { name: 'Dedicated account manager', included: false },
    { name: 'Custom branding options', included: false },
  ],
  enterprise: [
    { name: 'Unlimited bookings', included: true },
    { name: 'Featured service listing', included: true },
    { name: 'In-platform messaging', included: true },
    { name: 'Comprehensive analytics', included: true },
    { name: 'Lowest commission (5%)', included: true },
    { name: 'Top priority in search results', included: true },
    { name: 'Urgent booking requests', included: true },
    { name: 'Dedicated account manager', included: true },
    { name: 'Custom branding options', included: true },
  ],
};

const SubscriptionPlans: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Subscription Plans</h2>
        <p className="text-muted-foreground">Choose the plan that works for your business</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>For individuals just getting started</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">N$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {planFeatures.free.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 mr-2 shrink-0" />
                  )}
                  <span className={!feature.included ? 'text-muted-foreground' : ''}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Current Plan
            </Button>
          </CardFooter>
        </Card>
        
        {/* Pro Plan */}
        <Card className="border-primary shadow-md relative">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <Badge className="bg-primary text-white">Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>For growing service providers</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">N$299</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {planFeatures.pro.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 mr-2 shrink-0" />
                  )}
                  <span className={!feature.included ? 'text-muted-foreground' : ''}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>
        
        {/* Enterprise Plan */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Enterprise Plan</CardTitle>
            <CardDescription>For established businesses</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">N$599</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {planFeatures.enterprise.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 mr-2 shrink-0" />
                  )}
                  <span className={!feature.included ? 'text-muted-foreground' : ''}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-medium mb-2">Enterprise Solutions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Need custom solutions for your business? Contact our sales team for tailored
          enterprise packages with advanced features and dedicated support.
        </p>
        <Button variant="outline" size="sm">
          Contact Enterprise Sales
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
