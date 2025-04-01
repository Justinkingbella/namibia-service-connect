
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Redirect if already authenticated - using useEffect to handle navigation
  useEffect(() => {
    if (user) {
      console.log('User already signed in, navigating to dashboard');
      const from = location.state?.from?.pathname || '/dashboard';
      // Use setTimeout to delay the navigation slightly, preventing immediate state changes
      setTimeout(() => {
        navigate(from);
      }, 100);
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    if (!email || !password) {
      setError('Please provide both email and password');
      setIsSubmitting(true);
      return;
    }
    
    try {
      console.log('Attempting login with credentials:', email);
      await signIn(email, password);
      // The redirect will be handled by the useEffect above
      console.log('Sign in successful');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Authentication failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (role: string) => {
    switch (role) {
      case 'admin':
        setEmail('admin@namibiaservice.com');
        setPassword('admin123');
        break;
      case 'provider':
        setEmail('provider@namibiaservice.com');
        setPassword('provider123');
        break;
      case 'customer':
        setEmail('customer@namibiaservice.com');
        setPassword('password');
        break;
    }
    
    // Clear any previous errors when setting new credentials
    setError(null);
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
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
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
              
              <Button 
                type="submit" 
                className="w-full mt-2" 
                loading={isLoading || isSubmitting}
              >
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
                onClick={() => setDemoCredentials('admin')}
              >
                Admin Login
              </button>
              <button 
                className="text-primary hover:underline text-xs" 
                onClick={() => setDemoCredentials('provider')}
              >
                Provider Login
              </button>
              <button 
                className="text-primary hover:underline text-xs" 
                onClick={() => setDemoCredentials('customer')}
              >
                Customer Login
              </button>
            </div>
            <div className="mt-2">
              <Link to="/auth/create-admin" className="text-primary hover:underline text-xs">
                Create Admin Account
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SignIn;
