
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SiteProvider } from './contexts/SiteContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import CreateAdmin from './pages/auth/CreateAdmin';
import Dashboard from './pages/dashboard/Dashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import ProviderDashboard from './pages/dashboard/ProviderDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import BookingsPage from './pages/dashboard/bookings/BookingsPage';
import BookingDetail from './pages/dashboard/bookings/BookingDetail';
import MessagesPage from './pages/dashboard/messages/MessagesPage';
import ServicesPage from './pages/dashboard/services/ServicesPage';
import ServiceDetail from './pages/dashboard/services/ServiceDetail';
import CreateServicePage from './pages/dashboard/services/CreateServicePage';
import PaymentHistoryPage from './pages/dashboard/customer/PaymentHistoryPage';
import FavoritesPage from './pages/dashboard/customer/FavoritesPage';
import ProfilePage from './pages/dashboard/customer/ProfilePage';
import DisputesPage from './pages/dashboard/customer/DisputesPage';
import SettingsPage from './pages/dashboard/settings/SettingsPage';
import ProviderProfilePage from './pages/dashboard/provider/ProviderProfilePage';
import RevenueReportsPage from './pages/dashboard/provider/RevenueReportsPage';
import SubscriptionPageProvider from './pages/dashboard/provider/SubscriptionPageProvider';
import TransactionsPage from './pages/dashboard/provider/TransactionsPage';
import ProviderDisputesPage from './pages/dashboard/provider/DisputesPage';
import PaymentDetailsPage from './pages/dashboard/provider/PaymentDetailsPage';
import WalletVerificationPage from './pages/dashboard/provider/WalletVerificationPage';
import WalletVerificationsPage from './pages/dashboard/customer/WalletVerificationsPage';
import AdminProfilePage from './pages/dashboard/admin/AdminProfilePage';
import PlatformAnalyticsPage from './pages/dashboard/admin/PlatformAnalyticsPage';
import PlatformControlsPage from './pages/dashboard/admin/PlatformControlsPage';
import ProviderVerificationPage from './pages/dashboard/admin/ProviderVerificationPage';
import AdminWalletVerificationPage from './pages/dashboard/admin/WalletVerificationPage';
import SubscriptionManagementPage from './pages/dashboard/admin/SubscriptionManagementPage';
import SiteSettingsPage from './pages/dashboard/admin/SiteSettingsPage';
import CategoryManagementPage from './pages/dashboard/admin/CategoryManagementPage';
import BookingSettingsPage from './pages/dashboard/admin/BookingSettingsPage';
import NotFound from './pages/NotFound';
import './App.css';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          
          {/* Auth Routes */}
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/create-admin" element={<CreateAdmin />} />
          
          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Customer Dashboard Routes */}
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/dashboard/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payment-history"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <PaymentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/favorites"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/disputes"
            element={
              <ProtectedRoute>
                <DisputesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/wallet-verifications"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <WalletVerificationsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Provider Dashboard Routes */}
          <Route
            path="/dashboard/provider"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/provider/profile"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProviderProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/services"
            element={
              <ProtectedRoute allowedRoles={['provider', 'admin']}>
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/services/:id"
            element={
              <ProtectedRoute allowedRoles={['provider', 'admin']}>
                <ServiceDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/services/create"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <CreateServicePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/revenue"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <RevenueReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/subscription"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <SubscriptionPageProvider />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/transactions"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <TransactionsPage />
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
            path="/dashboard/payment-details"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <PaymentDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/wallet-verification"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <WalletVerificationPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Dashboard Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfilePage />
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
            path="/dashboard/admin/provider-verification"
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
                <AdminWalletVerificationPage />
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
            path="/dashboard/admin/site-settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SiteSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CategoryManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/booking-settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BookingSettingsPage />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </SiteProvider>
  );
}

export default App;
