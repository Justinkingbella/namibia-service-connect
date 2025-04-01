
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import { Input } from '@/components/ui/input';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';

const CreateAdmin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin already exists
    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);
      
      if (error) {
        console.error('Error checking for admin:', error);
        return;
      }
      
      setAdminExists(data && data.length > 0);
    };

    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Create user in auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' '),
            role: 'admin'
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // 2. Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' '),
          email: email,
          role: 'admin',
          is_verified: true,
          active: true
        });
        
      if (profileError) throw profileError;
      
      // 3. Create admin permissions
      const { error: permissionError } = await supabase
        .from('admin_permissions')
        .upsert({
          user_id: authData.user.id,
          permissions: ['all', 'user_management', 'provider_verification', 'dispute_resolution']
        });
        
      if (permissionError) throw permissionError;
      
      toast({
        title: 'Admin created successfully',
        description: 'You can now sign in with the admin credentials.',
      });
      
      setCreated(true);
      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Failed to create admin',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Container size="sm" className="py-6">
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <Alert variant="default" className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Admin account exists</AlertTitle>
              <AlertDescription className="text-yellow-700">
                An admin account has already been created. This page is only for initial setup.
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => navigate('/auth/sign-in')}>
                Go to Sign In
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (created) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Container size="sm" className="py-6">
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Admin Created Successfully</AlertTitle>
              <AlertDescription className="text-green-700">
                Your admin account has been created. You will be redirected to the login page shortly.
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => navigate('/auth/sign-in')}>
                Go to Sign In
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Container size="sm" className="py-6">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          
          <div className="bg-white shadow-md rounded-xl p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Create Admin Account</h2>
            <p className="text-muted-foreground text-center mb-6">This is a one-time setup page to create the initial admin account.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Admin Name"
                />
              </div>
              
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
                  placeholder="admin@example.com"
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
                  placeholder="•••••••••"
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground mt-1">Password must be at least 8 characters</p>
              </div>
              
              <Button type="submit" className="w-full mt-2" loading={isLoading}>
                Create Admin Account
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CreateAdmin;
