
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration (would be replaced with real backend integration)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@namibiaservice.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
    isVerified: true,
  },
  {
    id: '2',
    email: 'provider@namibiaservice.com',
    name: 'Service Provider',
    role: 'provider',
    createdAt: new Date(),
    isVerified: true,
  },
  {
    id: '3',
    email: 'customer@namibiaservice.com',
    name: 'Customer User',
    role: 'customer',
    createdAt: new Date(),
    isVerified: true,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for saved session on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('namibiaServiceUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('namibiaServiceUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in real app, this would be a backend validation)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        // In a real app, we would validate the password here
        setUser(foundUser);
        localStorage.setItem('namibiaServiceUser', JSON.stringify(foundUser));
        toast({
          title: 'Signed in successfully',
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        toast({
          title: 'Authentication failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Authentication failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === email)) {
        toast({
          title: 'Registration failed',
          description: 'Email already in use',
          variant: 'destructive',
        });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email,
        name,
        role,
        createdAt: new Date(),
        isVerified: false,
      };
      
      // In a real app, we would save the user to the database here
      mockUsers.push(newUser);
      
      // Auto sign in after signup
      setUser(newUser);
      localStorage.setItem('namibiaServiceUser', JSON.stringify(newUser));
      
      toast({
        title: 'Registration successful',
        description: `Welcome to Namibia Service Hub, ${name}!`,
      });
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: 'Registration failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Remove user from state and local storage
      setUser(null);
      localStorage.removeItem('namibiaServiceUser');
      toast({
        title: 'Signed out successfully',
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
