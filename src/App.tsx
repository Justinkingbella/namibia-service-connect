
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import ProviderDashboard from "./pages/dashboard/ProviderDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            
            {/* Protected Routes - Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Provider Routes */}
            <Route 
              path="/dashboard/provider" 
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/bookings" 
              element={
                <ProtectedRoute allowedRoles={['provider', 'customer']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Customer Routes */}
            <Route 
              path="/dashboard/customer" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/services" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'admin']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
