import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Dashboard Pages - Overview
import Dashboard from './pages/dashboard/Dashboard';
import BookingsPage from './pages/dashboard/bookings/BookingsPage';
import BookingDetail from './pages/dashboard/bookings/BookingDetail';
import ServicesPage from './pages/dashboard/services/ServicesPage';
import ServiceDetail from './pages/dashboard/services/ServiceDetail';
import CreateServicePage from './pages/dashboard/services/CreateServicePage';
import MessagesPage from './pages/dashboard/messages/MessagesPage';
import SettingsPage from './pages/dashboard/settings/SettingsPage';

// Customer Pages
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import CustomerFavoritesPage from './pages/dashboard/customer/FavoritesPage';
import CustomerProfilePage from './pages/dashboard/customer/ProfilePage';
import CustomerPaymentHistoryPage from './pages/dashboard/customer/PaymentHistoryPage';
import CustomerPaymentPage from './pages/dashboard/customer/PaymentPage';
import CustomerDisputesPage from './pages/dashboard/customer/DisputesPage';
import CustomerWalletVerificationsPage from './pages/dashboard/customer/WalletVerificationsPage';

// Provider Pages
import ProviderDashboard from './pages/dashboard/ProviderDashboard';
import ProviderProfilePage from './pages/dashboard/provider/profile/ProviderProfilePage';
import ProviderRevenueReportsPage from './pages/dashboard/provider/RevenueReportsPage';
import ProviderPaymentDetailsPage from './pages/dashboard/provider/PaymentDetailsPage';
import ProviderTransactionsPage from './pages/dashboard/provider/TransactionsPage';
import ProviderDisputesPage from './pages/dashboard/provider/DisputesPage';
import ProviderWalletVerificationPage from './pages/dashboard/provider/WalletVerificationPage';
import SubscriptionPageProvider from './pages/dashboard/provider/SubscriptionPageProvider';

// Admin Pages
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminProfilePage from './pages/dashboard/admin/profile/AdminProfilePage';
import AdminPlatformAnalyticsPage from './pages/dashboard/admin/PlatformAnalyticsPage';
import AdminPlatformControlsPage from './pages/dashboard/admin/PlatformControlsPage';
import AdminContentEditorPage from './pages/dashboard/admin/ContentEditorPage';
import AdminSiteSettingsPage from './pages/dashboard/admin/SiteSettingsPage';
import AdminBookingSettingsPage from './pages/dashboard/admin/BookingSettingsPage';
import AdminCategoryManagementPage from './pages/dashboard/admin/CategoryManagementPage';
import AdminSubscriptionManagementPage from './pages/dashboard/admin/SubscriptionManagementPage';
import AdminDisputesPage from './pages/dashboard/admin/DisputesPage';
import AdminProviderVerificationPage from './pages/dashboard/admin/ProviderVerificationPage';
import AdminWalletVerificationPage from './pages/dashboard/admin/WalletVerificationPage';

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

              {/* Main Dashboard Route - Redirects based on role */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN ROUTES */}
              <Route
                path="/admin/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminProfilePage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminPlatformAnalyticsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/platform-controls"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminPlatformControlsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/content-editor"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminContentEditorPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/site-settings"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminSiteSettingsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/booking-settings"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminBookingSettingsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/category-management"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminCategoryManagementPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/subscription-management"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminSubscriptionManagementPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/disputes"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminDisputesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/provider-verification"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminProviderVerificationPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/wallet-verification"
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminWalletVerificationPage />
                  </RoleBasedRoute>
                }
              />

              {/* PROVIDER ROUTES */}
              <Route
                path="/provider/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/profile"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderProfilePage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/revenue"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderRevenueReportsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/payment-details"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderPaymentDetailsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/transactions"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderTransactionsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/disputes"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderDisputesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/wallet-verification"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ProviderWalletVerificationPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/subscription"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <SubscriptionPageProvider />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/services/create"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <CreateServicePage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/services"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ServicesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/services/:id"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <ServiceDetail />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/bookings"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <BookingsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/bookings/:id"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <BookingDetail />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/provider/messages"
                element={
                  <RoleBasedRoute allowedRoles={['provider']}>
                    <MessagesPage />
                  </RoleBasedRoute>
                }
              />

              {/* CUSTOMER ROUTES */}
              <Route
                path="/customer/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/favorites"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerFavoritesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/profile"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerProfilePage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/payment-history"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerPaymentHistoryPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/payment"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerPaymentPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/disputes"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerDisputesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/wallet-verifications"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CustomerWalletVerificationsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/services"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <ServicesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/services/:id"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <ServiceDetail />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/bookings"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <BookingsPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/bookings/:id"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <BookingDetail />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/customer/messages"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <MessagesPage />
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