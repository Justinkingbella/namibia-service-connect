import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
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
import ServicesPage from "./pages/dashboard/services/ServicesPage";
import ServiceDetail from "./pages/dashboard/services/ServiceDetail";
import CreateServicePage from "./pages/dashboard/services/CreateServicePage";
import BookingsPage from "./pages/dashboard/bookings/BookingsPage";
import BookingDetail from "./pages/dashboard/bookings/BookingDetail";
import MessagesPage from "./pages/dashboard/messages/MessagesPage";
import ProviderVerificationPage from "./pages/dashboard/admin/ProviderVerificationPage";
import WalletVerificationPage from "./pages/dashboard/admin/WalletVerificationPage";
import PlatformAnalyticsPage from "./pages/dashboard/admin/PlatformAnalyticsPage";
import PlatformControlsPage from "./pages/dashboard/admin/PlatformControlsPage";
import SubscriptionManagementPage from "./pages/dashboard/admin/SubscriptionManagementPage";
import RevenueReportsPage from "./pages/dashboard/provider/RevenueReportsPage";
import PaymentDetailsPage from "./pages/dashboard/provider/PaymentDetailsPage";
import ProviderWalletVerificationPage from "./pages/dashboard/provider/WalletVerificationPage";
import ProviderDisputesPage from "./pages/dashboard/provider/DisputesPage";
import ProviderTransactionsPage from "./pages/dashboard/provider/TransactionsPage";
import SubscriptionPageProvider from "./pages/dashboard/provider/SubscriptionPageProvider";
import ProfilePage from "./pages/dashboard/customer/ProfilePage";
import FavoritesPage from "./pages/dashboard/customer/FavoritesPage";
import CustomerWalletVerificationsPage from "./pages/dashboard/customer/WalletVerificationsPage";
import CustomerPaymentHistoryPage from "./pages/dashboard/customer/PaymentHistoryPage";
import CustomerDisputesPage from "./pages/dashboard/customer/DisputesPage";
import SettingsPage from "./pages/dashboard/settings/SettingsPage";
import NotFound from "./pages/NotFound";

// Create QueryClient outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  }
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
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
              
              {/* Service Routes */}
              <Route 
                path="/dashboard/services" 
                element={
                  <ProtectedRoute>
                    <ServicesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/services/:id" 
                element={
                  <ProtectedRoute>
                    <ServiceDetail />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/services/create" 
                element={
                  <ProtectedRoute allowedRoles={['provider', 'admin']}>
                    <CreateServicePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Booking Routes */}
              <Route 
                path="/dashboard/bookings" 
                element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/bookings/:id" 
                element={
                  <ProtectedRoute>
                    <BookingDetail />
                  </ProtectedRoute>
                } 
              />
              
              {/* Messages Route */}
              <Route 
                path="/dashboard/messages" 
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Settings Route */}
              <Route 
                path="/dashboard/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
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
                path="/dashboard/admin/providers/verification" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ProviderVerificationPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/admin/wallet-verification" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <WalletVerificationPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/admin/analytics" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PlatformAnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/admin/controls" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PlatformControlsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/admin/subscriptions" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SubscriptionManagementPage />
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
                path="/dashboard/provider/reports" 
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <RevenueReportsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/provider/payment-details" 
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <PaymentDetailsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/provider/wallet-verification" 
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderWalletVerificationPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/provider/subscription" 
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <SubscriptionPageProvider />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/provider/disputes" 
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderDisputesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/provider/transactions" 
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderTransactionsPage />
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
                path="/dashboard/customer/profile" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/customer/favorites" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <FavoritesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/customer/wallet-verifications" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerWalletVerificationsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/customer/payment-history" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerPaymentHistoryPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/customer/disputes" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDisputesPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
