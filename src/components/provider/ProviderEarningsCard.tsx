
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { DollarSign, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { SubscriptionTier } from '@/types';

interface ProviderEarningsCardProps {
  earnings: {
    totalEarnings: number;
    pendingPayouts: number;
    thisMonth: number;
    lastMonth: number;
  };
  subscriptionTier: SubscriptionTier;
}

const ProviderEarningsCard: React.FC<ProviderEarningsCardProps> = ({ 
  earnings, 
  subscriptionTier 
}) => {
  const navigate = useNavigate();
  
  const getCommissionRate = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return '10%';
      case 'pro':
        return '8%';
      case 'enterprise':
        return '5%';
      default:
        return '10%';
    }
  };
  
  const getGrowthRate = () => {
    if (earnings.lastMonth === 0) return 100;
    return Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100);
  };
  
  const growthRate = getGrowthRate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Earnings Overview</CardTitle>
          <Badge variant={subscriptionTier === 'free' ? 'outline' : 'default'}>
            {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-primary mr-1" />
              <span className="text-2xl font-bold">N${earnings.totalEarnings.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pending Payouts</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-1" />
              <span className="text-2xl font-bold">N${earnings.pendingPayouts.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">This Month</p>
            <div className="flex items-center">
              <span className="text-xl font-bold">N${earnings.thisMonth.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monthly Growth</p>
            <div className="flex items-center">
              <TrendingUp className={`h-4 w-4 ${growthRate >= 0 ? 'text-green-500' : 'text-red-500'} mr-1`} />
              <span className={`text-xl font-bold ${growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {growthRate >= 0 ? '+' : ''}{growthRate}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Commission</span>
            <span className="font-medium">{getCommissionRate(subscriptionTier)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between pt-0">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/provider/reports')}>
          View Earnings <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        {subscriptionTier === 'free' && (
          <Button size="sm" onClick={() => navigate('/dashboard/provider/reports?tab=subscription')}>
            Upgrade Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProviderEarningsCard;
