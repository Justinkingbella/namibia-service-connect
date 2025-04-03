import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProviderDashboard from '@/pages/dashboard/provider/ProviderDashboard';
import CreateServicePage from '@/pages/dashboard/provider/CreateServicePage';
import ProviderProfilePage from '@/pages/dashboard/provider/profile/ProviderProfilePage';
import PaymentDetailsPage from '@/pages/dashboard/provider/PaymentDetailsPage';
import RoleBasedRoute from './components/RoleBasedRoute'; // Assuming this component exists


function App() {
  return (
    <Router>
      <Routes>
        {/* Provider routes */}
        <Route path="/provider/dashboard" element={<RoleBasedRoute allowedRoles="provider"><ProviderDashboard /></RoleBasedRoute>} />
        <Route path="/provider/services/create" element={<RoleBasedRoute allowedRoles="provider"><CreateServicePage /></RoleBasedRoute>} />
        <Route path="/provider/profile" element={<RoleBasedRoute allowedRoles="provider"><ProviderProfilePage /></RoleBasedRoute>} />
        <Route path="/dashboard/provider/profile" element={<RoleBasedRoute allowedRoles="provider"><ProviderProfilePage /></RoleBasedRoute>} />
        <Route path="/provider/payments" element={<RoleBasedRoute allowedRoles="provider"><PaymentDetailsPage /></RoleBasedRoute>} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;