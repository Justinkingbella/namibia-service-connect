
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import Container from '@/components/common/Container';
import { 
  Bell, 
  Search,
  MessageSquare,
  ChevronDown,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full">
        {/* Header */}
        <header className={cn(
          "bg-white border-b sticky top-0 z-10 transition-shadow duration-300",
          isScrolled && "shadow-sm"
        )}>
          <Container className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100" />
                <Logo />
              </div>
              
              <div className="hidden md:flex">
                <div className="relative mx-auto max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="py-2 pl-10 pr-4 w-80 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100 relative">
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </button>
                
                <div className="relative">
                  <button 
                    className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                      <span className="text-sm font-medium">{user?.name.charAt(0)}</span>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-1 z-10 border animate-fade-in">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={() => {
                            navigate('/dashboard/profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User size={16} />
                          Your Profile
                        </button>
                        <button 
                          onClick={() => {
                            navigate('/dashboard/settings');
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings size={16} />
                          Settings
                        </button>
                        <button 
                          onClick={() => {
                            navigate('/help');
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <HelpCircle size={16} />
                          Help Center
                        </button>
                      </div>
                      <div className="py-1 border-t">
                        <button 
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={handleSignOut}
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <AppSidebar />
          
          {/* Main content */}
          <main className="flex-1 overflow-x-hidden p-4 md:p-8">
            <Container>
              {children}
            </Container>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
