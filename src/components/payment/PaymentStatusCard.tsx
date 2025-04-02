
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaymentTransaction } from '@/hooks/usePaymentSystem';
import { CheckCircle2, XCircle, Clock, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { usePaymentMethods } from '@/hooks/usePaymentSystem';
import { toast } from 'sonner';

interface PaymentStatusCardProps {
  payment: PaymentTransaction;
  onViewDetails?: () => void;
  onSubmitProof?: () => void;
  refreshData?: () => void;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  payment,
  onViewDetails,
  onSubmitProof,
  refreshData
}) => {
  const { retryPayment } = usePaymentMethods();
  const [retrying, setRetrying] = React.useState(false);

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'awaiting_verification':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'refunded':
        return <ArrowUpCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'awaiting_verification':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (payment.status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'awaiting_verification':
        return 'Awaiting Verification';
      case 'refunded':
        return 'Refunded';
      default:
        return payment.status;
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const result = await retryPayment(payment.id);
      
      if (result.success) {
        toast.success('Payment retry initiated successfully');
        
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else if (refreshData) {
          refreshData();
        }
      } else {
        toast.error('Failed to retry payment');
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast.error('An error occurred while retrying payment');
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${getStatusColor()} pb-2`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {getStatusIcon()}
            <span>Payment {getStatusText()}</span>
          </CardTitle>
          <Badge variant="outline" className="uppercase text-xs px-2">
            {payment.gateway.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="text-sm opacity-90">
          {format(new Date(payment.createdAt), 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">N${payment.amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reference:</span>
            <span className="font-medium">{payment.reference}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Method:</span>
            <span className="font-medium">{payment.method}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Description:</span>
            <span className="font-medium truncate max-w-[200px]" title={payment.description}>
              {payment.description}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/20 border-t">
        {payment.status === 'awaiting_verification' && onSubmitProof && (
          <Button variant="outline" size="sm" onClick={onSubmitProof}>
            Submit Proof
          </Button>
        )}
        
        {(payment.status === 'failed' || payment.status === 'cancelled') && (
          <Button variant="outline" size="sm" onClick={handleRetry} disabled={retrying}>
            {retrying ? 'Retrying...' : 'Retry Payment'}
          </Button>
        )}
        
        {payment.status !== 'awaiting_verification' && 
         payment.status !== 'failed' && 
         payment.status !== 'cancelled' && (
          <div className="flex-1"></div> // Spacer
        )}
        
        <Button variant="ghost" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentStatusCard;
