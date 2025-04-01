
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please provide both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await signIn(email, password);
      // The redirect will be handled by the useEffect above
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Container size="sm" className="py-6 sm:py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Logo size="lg" />
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Sign In</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="text-sm"
                />
              </div>
              
              <div className="text-xs sm:text-sm text-right">
                <Link to="/auth/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full mt-2" loading={isLoading}>
                Sign In
              </Button>
            </form>
            
            <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm">
              <span className="text-gray-600">Don't have an account?</span>{' '}
              <Link to="/auth/sign-up" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>For demo purposes:</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2">
              <button 
                className="text-primary hover:underline text-xs" 
                onClick={() => {
                  setEmail('admin@namibiaservice.com');
                  setPassword('password');
                }}
              >
                Admin Login
              </button>
              <button 
                className="text-primary hover:underline text-xs" 
                onClick={() => {
                  setEmail('provider@namibiaservice.com');
                  setPassword('password');
                }}
              >
                Provider Login
              </button>
              <button 
                className="text-primary hover:underline text-xs" 
                onClick={() => {
                  setEmail('customer@namibiaservice.com');
                  setPassword('password');
                }}
              >
                Customer Login
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SignIn;
