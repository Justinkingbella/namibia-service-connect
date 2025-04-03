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

interface LocationState {
  from?: {
    pathname: string;
  };
}

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const state = location.state as LocationState;
      const from = state?.from?.pathname || `/${user.role}/dashboard`;
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    const { email, password } = formData;
    if (!email || !password) {
      setError('Please provide both email and password');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await signIn(email, password);
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (role: 'admin' | 'provider' | 'customer') => {
    const credentials = {
      admin: { email: 'admin@namibiaservice.com', password: 'admin123' },
      provider: { email: 'provider@namibiaservice.com', password: 'provider123' },
      customer: { email: 'customer@namibiaservice.com', password: 'password' },
    };

    setFormData(credentials[role]);
    setError(null);
    
    toast({
      title: `Demo ${role} credentials set`,
      description: "Click Sign In to continue",
    });
  };

  const disabled = isLoading || isSubmitting;

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
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={disabled}
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
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={disabled}
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
                loading={disabled}
                disabled={disabled}
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
              {(['admin', 'provider', 'customer'] as const).map((role) => (
                <button 
                  key={role}
                  className="text-primary hover:underline text-xs" 
                  onClick={() => setDemoCredentials(role)}
                  disabled={disabled}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} Login
                </button>
              ))}
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
