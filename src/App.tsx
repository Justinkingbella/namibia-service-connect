import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { SiteProvider } from './contexts/SiteContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';

// Public Pages
import Index from './pages/Index';
import AboutPage from './pages/AboutPage';
import Services from './pages/Services';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFound from './pages/NotFound';

// Auth Pages
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CreateAdmin from './pages/auth/CreateAdmin';

// Dashboard Base
import Dashboard from './pages/dashboard/Dashboard';

// Dashboard Pages - Overview
import BookingsPage from './pages/dashboard/bookings/BookingsPage';
import BookingDetail from './pages/dashboard/bookings/BookingDetail';
import ServicesPage from './pages/dashboard/services/ServicesPage';
import ServiceDetail from './pages/dashboard/services/ServiceDetail';
import CreateServicePage from './pages/dashboard/services/CreateServicePage';
import MessagesPage from './pages/dashboard/messages/MessagesPage';
import SettingsPage from './pages/dashboard/settings/SettingsPage';

// Customer Pages
import CustomerFavoritesPage from './pages/dashboard/customer/FavoritesPage';
import CustomerProfilePage from './pages/dashboard/customer/ProfilePage';
import CustomerPaymentHistoryPage from './pages/dashboard/customer/PaymentHistoryPage';
import CustomerPaymentPage from './pages/dashboard/customer/PaymentPage';
import CustomerDisputesPage from './pages/dashboard/customer/DisputesPage';
import CustomerWalletVerificationsPage from './pages/dashboard/customer/WalletVerificationsPage';

// Provider Pages
import ProviderProfilePage from './pages/dashboard/provider/profile/ProviderProfilePage';
import ProviderRevenueReportsPage from './pages/dashboard/provider/RevenueReportsPage';
import ProviderPaymentDetailsPage from './pages/dashboard/provider/PaymentDetailsPage';
import ProviderTransactionsPage from './pages/dashboard/provider/TransactionsPage';
import ProviderDisputesPage from './pages/dashboard/provider/DisputesPage';
import ProviderWalletVerificationPage from './pages/dashboard/provider/WalletVerificationPage';
import SubscriptionPageProvider from './pages/dashboard/provider/SubscriptionPageProvider';

// Admin Pages
import AdminProfilePage from './pages/dashboard/admin/profile/AdminProfilePage';
import AdminPlatformAnalyticsPage from './pages/dashboard/admin/PlatformAnalyticsPage';
import AdminPlatformControlsPage from './pages/dashboard/admin/PlatformControlsPage';
import AdminContentEditorPage from './pages/dashboard/admin/ContentEditorPage';
import AdminSiteSettingsPage from './pages/dashboard/admin/SiteSettingsPage';
import AdminBookingSettingsPage from './pages/dashboard/admin/BookingSettingsPage';
import AdminCategoryManagementPage from './pages/dashboard/admin/CategoryManagementPage';
import AdminSubscriptionPage from './pages/dashboard/admin/SubscriptionPage';
import AdminDisputesPage from './pages/dashboard/admin/DisputesPage';
import AdminProviderVerificationPage from './pages/dashboard/admin/ProviderVerificationPage';
import AdminWalletVerificationPage from './pages/dashboard/admin/WalletVerificationPage';
import SubscriptionPage from './pages/dashboard/admin/SubscriptionPage';
import SubscriptionManagementPage from './pages/dashboard/admin/SubscriptionManagementPage';

const App = () => {
  return (
    <AuthProvider>
      <SiteProvider>
        <SupabaseProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
              {/* Auth Routes */}
              <Route path="/auth/sign-in" element={<SignIn />} />
              <Route path="/auth/sign-up" element={<SignUp />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
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
              
              {/* Bookings */}
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
              
              {/* Services */}
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
                  <RoleBasedRoute allowedRoles={['admin', 'provider']}>
                    <CreateServicePage />
                  </RoleBasedRoute>
                }
              />
              
              {/* Add Provider CreateService route */}
              <Route
                path="/dashboard/provider/services/create"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <CreateServicePage />
                  </RoleBasedRoute>
                }
              />
              
              {/* Messages */}
              <Route
                path="/dashboard/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Settings */}
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Customer specific routes */}
              <Route
                path="/dashboard/customer/favorites"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerFavoritesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/customer/profile"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerProfilePage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/customer/payment-history"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerPaymentHistoryPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/customer/payment"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerPaymentPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/customer/disputes"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerDisputesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/customer/wallet-verifications"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerWalletVerificationsPage />
                  </RoleBasedRoute>
                }
              />
              
              {/* Provider specific routes */}
              <Route
                path="/dashboard/provider/profile"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderProfilePage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/provider/revenue"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderRevenueReportsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/provider/payment-details"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderPaymentDetailsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/provider/transactions"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderTransactionsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/provider/disputes"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderDisputesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/provider/wallet-verification"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderWalletVerificationPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/provider/subscription"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <SubscriptionPageProvider />
                  </RoleBasedRoute>
                }
              />
              
              {/* Admin specific routes */}
              <Route
                path="/dashboard/admin/profile"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminProfilePage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/analytics"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminPlatformAnalyticsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/platform-controls"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminPlatformControlsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/content-editor"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminContentEditorPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/site-settings"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminSiteSettingsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/booking-settings"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminBookingSettingsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/category-management"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminCategoryManagementPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/subscription-management"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <SubscriptionManagementPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/disputes"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminDisputesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/provider-verification"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminProviderVerificationPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/wallet-verification"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminWalletVerificationPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/admin/subscription"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <SubscriptionPage />
                  </RoleBasedRoute>
                }
              />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </SupabaseProvider>
      </SiteProvider>
    </AuthProvider>
  );
};

export default App;
