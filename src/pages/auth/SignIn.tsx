
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all required fields', {
        description: 'Email and password are required',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Sign in error:', error);
        if (error.status === 400) {
          toast.error('Sign in failed', {
            description: 'Incorrect email or password.',
          });
        } else if (error.status === 422) {
          toast.error('Sign in failed', {
            description: 'Invalid email format.',
          });
        } else {
          toast.error('Sign in failed', {
            description: error.message || 'Please check your credentials and try again.',
          });
        }
      } else {
        toast.success('Sign in successful', {
          description: 'Redirecting to your dashboard...',
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      toast.error('Sign in failed', {
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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your email and password to sign in to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">⚙️</span> Signing In...
                </div>
              ) : 'Sign In'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/auth/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
