
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';
import { useAuthStore } from '@/store/authStore';

const SignUp = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [businessName, setBusinessName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp, user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const validateForm = () => {
    if (!email || !password || !passwordConfirm || !firstName || !lastName) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }

    // Require business name if role is provider
    if (role === 'provider' && !businessName.trim()) {
      toast.error('Please enter your business name');
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Create user data based on role
      const userData = {
        firstName,
        lastName,
        ...(role === 'provider' ? { businessName } : {})
      };

      const { error, data } = await signUp(email, password, role, userData);
      
      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('already registered')) {
          toast.error('Sign up failed', {
            description: 'This email is already registered. Please sign in instead.',
          });
        } else if (error.message.includes('Invalid email')) {
          toast.error('Sign up failed', {
            description: 'Please enter a valid email address.',
          });
        } else {
          toast.error('Sign up failed', {
            description: error.message || 'Please check your information and try again.',
          });
        }
      } else {
        toast.success('Account created successfully', {
          description: 'Redirecting to your dashboard...',
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      toast.error('Sign up failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your information to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <Input 
                  id="passwordConfirm" 
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Customer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="provider" id="provider" />
                  <Label htmlFor="provider">Service Provider</Label>
                </div>
              </RadioGroup>
            </div>
            
            {role === 'provider' && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">⚙️</span> Creating Account...
                </div>
              ) : 'Create Account'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
