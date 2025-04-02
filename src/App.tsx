
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SiteProvider } from './contexts/SiteContext';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/dashboard/Dashboard';
import ProfilePage from './pages/dashboard/customer/ProfilePage';
import ServicesPage from './pages/dashboard/services/ServicesPage';
import ServiceDetailPage from './pages/dashboard/services/ServiceDetail';
import BookingsPage from './pages/dashboard/bookings/BookingsPage';
import BookingDetailPage from './pages/dashboard/bookings/BookingDetail';
import FavoritesPage from './pages/dashboard/customer/FavoritesPage';
import PaymentHistoryPage from './pages/dashboard/customer/PaymentHistoryPage';
import ProviderTransactionsPage from './pages/dashboard/provider/TransactionsPage';
import ProviderProfilePage from './pages/dashboard/provider/ProviderProfilePage';
import UsersPage from './components/admin/UserManagement';
import AnalyticsPage from './pages/dashboard/admin/PlatformAnalyticsPage';
import WalletVerificationPage from './pages/dashboard/admin/WalletVerificationPage';
import SiteSettingsPage from './pages/dashboard/admin/SiteSettingsPage';
import AdminProfilePage from './pages/dashboard/admin/AdminProfilePage';
import PlatformControlsPage from './pages/dashboard/admin/PlatformControlsPage';
import CreateServicePage from './pages/dashboard/services/CreateServicePage';
import HomePage from './pages/Index';
import SignInPage from './pages/auth/SignIn';
import SignUpPage from './pages/auth/SignUp';
import ServicesListPage from './pages/Services';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HowItWorksPage from './pages/HowItWorks';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import NotFoundPage from './pages/NotFound';
import MessagesPage from './pages/dashboard/messages/MessagesPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import FAQPage from './pages/FAQPage';
import ContentEditorPage from './pages/dashboard/admin/ContentEditorPage';
import SubscriptionPageProvider from './pages/dashboard/provider/SubscriptionPageProvider';
import SubscriptionManagementPage from './pages/dashboard/admin/SubscriptionManagementPage';
import RevenueReportsPage from './pages/dashboard/provider/RevenueReportsPage';
import PaymentDetailsPage from './pages/dashboard/provider/PaymentDetailsPage';
import DisputesPage from './pages/dashboard/admin/DisputesPage';
import ProviderWalletVerificationPage from './pages/dashboard/provider/WalletVerificationPage';
import CustomerDisputesPage from './pages/dashboard/customer/DisputesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SiteProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/sign-in" element={<SignInPage />} />
            <Route path="/auth/sign-up" element={<SignUpPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/services" element={<ServicesListPage />} />
            <Route path="/services/:id" element={<ServicesListPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            
            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/dashboard/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
            <Route path="/dashboard/services/create" element={<ProtectedRoute><CreateServicePage /></ProtectedRoute>} />
            <Route path="/dashboard/services/:id" element={<ProtectedRoute><ServiceDetailPage /></ProtectedRoute>} />
            <Route path="/dashboard/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
            <Route path="/dashboard/bookings/:id" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
            <Route path="/dashboard/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/dashboard/admin/profile" element={<RoleBasedRoute role="admin"><AdminProfilePage /></RoleBasedRoute>} />
            <Route path="/dashboard/users" element={<RoleBasedRoute role="admin"><UsersPage /></RoleBasedRoute>} />
            <Route path="/dashboard/admin/analytics" element={<RoleBasedRoute role="admin"><AnalyticsPage /></RoleBasedRoute>} />
            <Route path="/dashboard/admin/platform-controls" element={<RoleBasedRoute role="admin"><PlatformControlsPage /></RoleBasedRoute>} />
            <Route path="/dashboard/admin/wallet-verification" element={<RoleBasedRoute role="admin"><WalletVerificationPage /></RoleBasedRoute>} />
            <Route path="/dashboard/admin/disputes" element={<RoleBasedRoute role="admin"><DisputesPage /></RoleBasedRoute>} />
            <Route path="/dashboard/settings" element={<RoleBasedRoute role="admin"><SiteSettingsPage /></RoleBasedRoute>} />
            <Route path="/dashboard/admin/subscriptions" element={<RoleBasedRoute role="admin"><SubscriptionManagementPage /></RoleBasedRoute>} />
            <Route path="/dashboard/admin/content-editor" element={<RoleBasedRoute role="admin"><ContentEditorPage /></RoleBasedRoute>} />
            
            {/* Provider Routes */}
            <Route path="/dashboard/provider/profile" element={<RoleBasedRoute role="provider"><ProviderProfilePage /></RoleBasedRoute>} />
            <Route path="/dashboard/provider/transactions" element={<RoleBasedRoute role="provider"><ProviderTransactionsPage /></RoleBasedRoute>} />
            <Route path="/dashboard/provider/subscription" element={<RoleBasedRoute role="provider"><SubscriptionPageProvider /></RoleBasedRoute>} />
            <Route path="/dashboard/provider/reports" element={<RoleBasedRoute role="provider"><RevenueReportsPage /></RoleBasedRoute>} />
            <Route path="/dashboard/provider/payment-details" element={<RoleBasedRoute role="provider"><PaymentDetailsPage /></RoleBasedRoute>} />
            <Route path="/dashboard/provider/wallet-verification" element={<RoleBasedRoute role="provider"><ProviderWalletVerificationPage /></RoleBasedRoute>} />
            
            {/* Customer Routes */}
            <Route path="/dashboard/customer/favorites" element={<RoleBasedRoute role="customer"><FavoritesPage /></RoleBasedRoute>} />
            <Route path="/dashboard/customer/payment-history" element={<RoleBasedRoute role="customer"><PaymentHistoryPage /></RoleBasedRoute>} />
            <Route path="/dashboard/customer/disputes" element={<RoleBasedRoute role="customer"><CustomerDisputesPage /></RoleBasedRoute>} />
            
            {/* Catch all */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
          
          <Toaster />
        </SiteProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
