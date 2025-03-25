
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Container size="sm" className="py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <div className="text-sm text-right">
                <Link to="/auth/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full" loading={isLoading}>
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>{' '}
              <Link to="/auth/sign-up" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>For demo purposes:</p>
            <div className="flex justify-center gap-4 mt-2">
              <button 
                className="text-primary hover:underline" 
                onClick={() => {
                  setEmail('admin@namibiaservice.com');
                  setPassword('password');
                }}
              >
                Admin Login
              </button>
              <button 
                className="text-primary hover:underline" 
                onClick={() => {
                  setEmail('provider@namibiaservice.com');
                  setPassword('password');
                }}
              >
                Provider Login
              </button>
              <button 
                className="text-primary hover:underline" 
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
