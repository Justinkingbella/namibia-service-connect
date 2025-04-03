import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProviderDashboard from '@/pages/dashboard/ProviderDashboard';
import CreateServicePage from '@/pages/dashboard/provider/CreateServicePage';
import ProviderProfilePage from '@/pages/dashboard/provider/profile/ProviderProfilePage';
import PaymentDetailsPage from '@/pages/dashboard/provider/PaymentDetailsPage';
import RoleBasedRoute from './components/auth/RoleBasedRoute';


function App() {
  return (
    <Router>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Namibia Service Connect</h1>
          <p className="mb-4">Please navigate to one of our available pages:</p>
          <div className="flex flex-col gap-2 items-center">
            <a href="/provider/dashboard" className="text-blue-500 hover:underline">Provider Dashboard</a>
            <a href="/provider/profile" className="text-blue-500 hover:underline">Provider Profile</a>
            <a href="/provider/services/create" className="text-blue-500 hover:underline">Create Service</a>
          </div>
        </div>} />
        
        {/* Provider routes */}
        <Route path="/provider/dashboard" element={<RoleBasedRoute allowedRoles="provider"><ProviderDashboard /></RoleBasedRoute>} />
        <Route path="/provider/services/create" element={<RoleBasedRoute allowedRoles="provider"><CreateServicePage /></RoleBasedRoute>} />
        <Route path="/provider/profile" element={<RoleBasedRoute allowedRoles={['provider']}><ProviderProfilePage /></RoleBasedRoute>} />
        <Route path="/provider/payments" element={<RoleBasedRoute allowedRoles="provider"><PaymentDetailsPage /></RoleBasedRoute>} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;