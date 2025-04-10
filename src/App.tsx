
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { SiteProvider } from './contexts/SiteContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Routes component that imports all routes
const Routes = React.lazy(() => import('./Routes'));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <SiteProvider>
          <Router>
            <AuthProvider>
              <React.Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }>
                <Routes />
                <Toaster />
              </React.Suspense>
            </AuthProvider>
          </Router>
        </SiteProvider>
      </SupabaseProvider>
    </QueryClientProvider>
  );
};

export default App;
