
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, TrendingDown, Calendar, Users } from 'lucide-react';
import { ServiceCategory } from '@/types';

interface RegionalData {
  region: string;
  totalBookings: number;
  growthRate: number;
  topCategory: ServiceCategory;
  providerCount: number;
  customerCount: number;
  demandSupplyRatio: number;
}

const mockRegionalData: RegionalData[] = [
  {
    region: 'Windhoek',
    totalBookings: 450,
    growthRate: 18,
    topCategory: 'home',
    providerCount: 120,
    customerCount: 350,
    demandSupplyRatio: 2.9
  },
  {
    region: 'Swakopmund',
    totalBookings: 180,
    growthRate: 22,
    topCategory: 'errand',
    providerCount: 45,
    customerCount: 120,
    demandSupplyRatio: 2.7
  },
  {
    region: 'Walvis Bay',
    totalBookings: 160,
    growthRate: 15,
    topCategory: 'home',
    providerCount: 40,
    customerCount: 110,
    demandSupplyRatio: 2.8
  },
  {
    region: 'Oshakati',
    totalBookings: 130,
    growthRate: 12,
    topCategory: 'transport',
    providerCount: 35,
    customerCount: 95,
    demandSupplyRatio: 2.7
  },
  {
    region: 'Rundu',
    totalBookings: 90,
    growthRate: 8,
    topCategory: 'professional',
    providerCount: 25,
    customerCount: 70,
    demandSupplyRatio: 2.8
  },
  {
    region: 'Katima Mulilo',
    totalBookings: 70,
    growthRate: 10,
    topCategory: 'errand',
    providerCount: 18,
    customerCount: 55,
    demandSupplyRatio: 3.1
  },
  {
    region: 'Otjiwarongo',
    totalBookings: 85,
    growthRate: 7,
    topCategory: 'home',
    providerCount: 22,
    customerCount: 65,
    demandSupplyRatio: 3.0
  },
  {
    region: 'Keetmanshoop',
    totalBookings: 65,
    growthRate: 5,
    topCategory: 'home',
    providerCount: 15,
    customerCount: 50,
    demandSupplyRatio: 3.3
  },
  {
    region: 'Mariental',
    totalBookings: 45,
    growthRate: -2,
    topCategory: 'transport',
    providerCount: 12,
    customerCount: 35,
    demandSupplyRatio: 2.9
  },
  {
    region: 'Okahandja',
    totalBookings: 55,
    growthRate: 3,
    topCategory: 'home',
    providerCount: 14,
    customerCount: 40,
    demandSupplyRatio: 2.9
  }
];

const getCategoryLabel = (category: ServiceCategory) => {
  switch (category) {
    case 'home': return 'Home Services';
    case 'errand': return 'Errands';
    case 'professional': return 'Professional';
    case 'freelance': return 'Freelance';
    case 'transport': return 'Transport';
    case 'health': return 'Health';
    default: return category;
  }
};

const getCategoryColor = (category: ServiceCategory) => {
  switch (category) {
    case 'home': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'errand': return 'bg-green-100 text-green-800 border-green-200';
    case 'professional': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'freelance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'transport': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'health': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const RegionalDemandMap: React.FC = () => {
  const [sortBy, setSortBy] = useState<'bookings' | 'growth' | 'ratio'>('bookings');
  const [timeRange, setTimeRange] = useState<string>('3m');

  const sortedData = [...mockRegionalData].sort((a, b) => {
    if (sortBy === 'bookings') return b.totalBookings - a.totalBookings;
    if (sortBy === 'growth') return b.growthRate - a.growthRate;
    if (sortBy === 'ratio') return b.demandSupplyRatio - a.demandSupplyRatio;
    return 0;
  });
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Regional Service Demand</CardTitle>
            <CardDescription>
              Monitor service demand and supply across different regions
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              className="p-2 border rounded-md text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button 
            variant={sortBy === 'bookings' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('bookings')}
          >
            <Calendar className="h-4 w-4 mr-2" /> Sort by Bookings
          </Button>
          <Button 
            variant={sortBy === 'growth' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('growth')}
          >
            <TrendingUp className="h-4 w-4 mr-2" /> Sort by Growth
          </Button>
          <Button 
            variant={sortBy === 'ratio' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSortBy('ratio')}
          >
            <Users className="h-4 w-4 mr-2" /> Sort by Demand/Supply Ratio
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedData.map((region) => (
            <Card key={region.region} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle className="text-lg">{region.region}</CardTitle>
                  </div>
                  <Badge variant="outline" className={getCategoryColor(region.topCategory)}>
                    {getCategoryLabel(region.topCategory)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-xl font-semibold">{region.totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <div className="flex items-center">
                      {region.growthRate >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                      )}
                      <p className={`text-xl font-semibold ${region.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {region.growthRate}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Providers</p>
                    <p className="text-xl font-semibold">{region.providerCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customers</p>
                    <p className="text-xl font-semibold">{region.customerCount}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Demand/Supply Ratio</p>
                  <div className="bg-gray-100 rounded-full h-2 mt-1 mb-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${Math.min((region.demandSupplyRatio / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">1:1</p>
                    <p className="text-xs font-medium">{region.demandSupplyRatio.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">1:5</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalDemandMap;
