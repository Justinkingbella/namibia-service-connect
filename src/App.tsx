
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { SiteProvider } from './contexts/SiteContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import AppRoutes from './Routes';

const App = () => {
  return (
    <AuthProvider>
      <SiteProvider>
        <SupabaseProvider>
          <AppRoutes />
          <Toaster />
        </SupabaseProvider>
      </SiteProvider>
    </AuthProvider>
  );
};

export default App;
