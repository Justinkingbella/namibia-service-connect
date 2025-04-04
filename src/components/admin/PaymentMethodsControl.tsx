
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DollarSign, CreditCard, Smartphone, Building, Wallet, Edit, Trash, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  fee: number;
  processingTime: string;
}

const PaymentMethodsControl: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([
    {
      id: 'pay_today',
      name: 'PayToday',
      description: 'Direct online payment via PayToday gateway',
      enabled: true,
      icon: <CreditCard className="h-6 w-6" />,
      fee: 2.5,
      processingTime: 'Instant',
    },
    {
      id: 'pay_fast',
      name: 'PayFast',
      description: 'Secure payment through PayFast',
      enabled: true,
      icon: <DollarSign className="h-6 w-6" />,
      fee: 3.0,
      processingTime: 'Instant',
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      description: 'Pay via mobile E-Wallet',
      enabled: true,
      icon: <Smartphone className="h-6 w-6" />,
      fee: 1.5,
      processingTime: 'Instant',
    },
    {
      id: 'dop',
      name: 'DOP',
      description: 'Digital online payments via DOP',
      enabled: false,
      icon: <Wallet className="h-6 w-6" />,
      fee: 2.0,
      processingTime: 'Instant',
    },
    {
      id: 'easy_wallet',
      name: 'EasyWallet',
      description: 'Mobile money payments',
      enabled: true,
      icon: <Smartphone className="h-6 w-6" />,
      fee: 1.8,
      processingTime: 'Instant',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfers',
      enabled: true,
      icon: <Building className="h-6 w-6" />,
      fee: 0.5,
      processingTime: '1-2 business days',
    },
    {
      id: 'cash',
      name: 'Cash',
      description: 'Cash payment on delivery',
      enabled: true,
      icon: <DollarSign className="h-6 w-6" />,
      fee: 0,
      processingTime: 'On delivery',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethodOption>>({
    name: '',
    description: '',
    fee: 0,
    processingTime: 'Instant',
    enabled: true
  });
  
  const [editingMethod, setEditingMethod] = useState<PaymentMethodOption | null>(null);

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
    
    toast.success(`Payment method ${paymentMethods.find(m => m.id === id)?.enabled ? 'disabled' : 'enabled'}`);
  };
  
  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.name || !newPaymentMethod.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = newPaymentMethod.name.toLowerCase().replace(/\s+/g, '_');
    
    const method: PaymentMethodOption = {
      id,
      name: newPaymentMethod.name,
      description: newPaymentMethod.description,
      fee: newPaymentMethod.fee || 0,
      processingTime: newPaymentMethod.processingTime || 'Instant',
      enabled: true,
      icon: <CreditCard className="h-6 w-6" />
    };
    
    setPaymentMethods([...paymentMethods, method]);
    setNewPaymentMethod({
      name: '',
      description: '',
      fee: 0,
      processingTime: 'Instant',
      enabled: true
    });
    
    setIsAddModalOpen(false);
    toast.success("Payment method added successfully");
  };
  
  const handleEditMethod = (method: PaymentMethodOption) => {
    setEditingMethod(method);
  };
  
  const handleUpdateMethod = () => {
    if (!editingMethod) return;
    
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === editingMethod.id ? editingMethod : method
      )
    );
    
    setEditingMethod(null);
    toast.success("Payment method updated successfully");
  };
  
  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    toast.success("Payment method removed");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage available payment options for users
            </CardDescription>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new payment method to the platform
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newPaymentMethod.name}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={newPaymentMethod.description}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Fee (%)</Label>
                  <Input 
                    id="fee" 
                    type="number"
                    min="0"
                    step="0.1"
                    value={newPaymentMethod.fee}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, fee: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingTime">Processing Time</Label>
                  <Input 
                    id="processingTime" 
                    value={newPaymentMethod.processingTime}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, processingTime: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  <div className="flex items-center mt-1 space-x-4">
                    <span className="text-xs text-muted-foreground">Fee: {method.fee}%</span>
                    <span className="text-xs text-muted-foreground">Processing: {method.processingTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" circle onClick={() => handleEditMethod(method)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  {editingMethod && editingMethod.id === method.id && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Payment Method</DialogTitle>
                        <DialogDescription>
                          Update payment method details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Name</Label>
                          <Input 
                            id="edit-name" 
                            value={editingMethod.name}
                            onChange={(e) => setEditingMethod({...editingMethod, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Input 
                            id="edit-description" 
                            value={editingMethod.description}
                            onChange={(e) => setEditingMethod({...editingMethod, description: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-fee">Fee (%)</Label>
                          <Input 
                            id="edit-fee" 
                            type="number"
                            min="0"
                            step="0.1"
                            value={editingMethod.fee}
                            onChange={(e) => setEditingMethod({...editingMethod, fee: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-processingTime">Processing Time</Label>
                          <Input 
                            id="edit-processingTime" 
                            value={editingMethod.processingTime}
                            onChange={(e) => setEditingMethod({...editingMethod, processingTime: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="destructive" onClick={() => handleDeleteMethod(method.id)} className="mr-auto">
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </Button>
                        <Button onClick={handleUpdateMethod}>Update</Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
                <div className="flex items-center">
                  <Switch
                    id={`method-${method.id}`}
                    checked={method.enabled}
                    onCheckedChange={() => togglePaymentMethod(method.id)}
                  />
                  <Label htmlFor={`method-${method.id}`} className="ml-2">
                    {method.enabled ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsControl;
