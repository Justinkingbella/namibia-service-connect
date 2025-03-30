
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

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      await signUp(email, password, name, role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:py-12">
      <Container size="sm">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Logo size="lg" />
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Create Account</h2>
            
            <Tabs defaultValue="customer" className="mb-5 sm:mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="customer" 
                  onClick={() => setRole('customer')}
                  className="text-xs sm:text-sm"
                >
                  I need services
                </TabsTrigger>
                <TabsTrigger 
                  value="provider" 
                  onClick={() => setRole('provider')}
                  className="text-xs sm:text-sm"
                >
                  I provide services
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="customer" className="mt-3 text-xs sm:text-sm text-muted-foreground">
                Create an account to find and book services in Namibia.
              </TabsContent>
              
              <TabsContent value="provider" className="mt-3 text-xs sm:text-sm text-muted-foreground">
                Create an account to offer your services on our platform.
              </TabsContent>
            </Tabs>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="text-sm"
                />
              </div>
              
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
                  className={`text-sm ${passwordError ? 'border-red-500' : ''}`}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`text-sm ${passwordError ? 'border-red-500' : ''}`}
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-red-500">{passwordError}</p>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </div>
              
              <Button type="submit" className="w-full mt-4" loading={isLoading}>
                Create Account
              </Button>
            </form>
            
            <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm">
              <span className="text-gray-600">Already have an account?</span>{' '}
              <Link to="/auth/sign-in" className="text-primary font-medium hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SignUp;
