
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import Logo from '@/components/common/Logo';
import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    try {
      setIsSubmitting(true);
      await signUp(email, password, name, role);
      toast({
        title: "Account created!",
        description: "You've been successfully registered.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <Container size="sm">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center justify-center mb-8">
            <Logo size="lg" />
            <h1 className="mt-4 text-2xl font-bold text-center text-gray-900">Create your account</h1>
            <p className="mt-2 text-center text-gray-600">Join our community and start exploring services in Namibia</p>
          </div>
          
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-2">
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger 
                    value="customer" 
                    onClick={() => setRole('customer')}
                    className="text-sm"
                  >
                    I need services
                  </TabsTrigger>
                  <TabsTrigger 
                    value="provider" 
                    onClick={() => setRole('provider')}
                    className="text-sm"
                  >
                    I provide services
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="customer" className="mt-3 text-sm text-muted-foreground">
                  Create an account to find and book services in Namibia.
                </TabsContent>
                
                <TabsContent value="provider" className="mt-3 text-sm text-muted-foreground">
                  Create an account to offer your services on our platform.
                </TabsContent>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="text-sm w-full"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="text-sm w-full"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`text-sm w-full ${passwordError ? 'border-red-500' : ''}`}
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`text-sm w-full ${passwordError ? 'border-red-500' : ''}`}
                  />
                  {passwordError && (
                    <p className="mt-1 text-xs text-red-500">{passwordError}</p>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-4" 
                  loading={isSubmitting || isLoading}
                  disabled={isSubmitting || isLoading}
                >
                  Create Account
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="border-t pt-4 flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/auth/sign-in" className="text-primary font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default SignUp;
