
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';

// Pages
import Home from '@/pages/Home';
import Dashboard from '@/pages/dashboard/Dashboard';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import ResetPassword from '@/pages/auth/ResetPassword';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import NotFound from '@/pages/NotFound';

// Initialize services for realtime updates
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'; 
import { useAuthStore } from '@/store/authStore';

function AppRoutes() {
  const { user, isLoading } = useAuthStore();
  
  // Set up realtime updates when user is authenticated
  useRealtimeUpdates();

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/auth/sign-in" />;
    }
    
    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Add other protected routes for different role dashboards */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/provider/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
