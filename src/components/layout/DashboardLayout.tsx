
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import Container from '@/components/common/Container';
import { 
  Bell, 
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Menu,
  X,
  Home,
  Calendar,
  Heart,
  CreditCard,
  Package,
  PieChart,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when location changes
    setShowMobileMenu(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getMobileNavItems = () => {
    if (!user) return [];
    
    if (user.role === 'admin') {
      return [
        { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Package, label: 'Services', path: '/admin/services' },
        { icon: PieChart, label: 'Analytics', path: '/admin/analytics' },
        { icon: User, label: 'Profile', path: '/admin/profile' },
      ];
    }
    
    if (user.role === 'provider') {
      return [
        { icon: Home, label: 'Dashboard', path: '/provider/dashboard' },
        { icon: Package, label: 'Services', path: '/provider/services' },
        { icon: Calendar, label: 'Bookings', path: '/provider/bookings' },
        { icon: CreditCard, label: 'Payments', path: '/provider/transactions' },
        { icon: User, label: 'Profile', path: '/provider/profile' },
      ];
    }
    
    return [
      { icon: Home, label: 'Dashboard', path: '/customer/dashboard' },
      { icon: Package, label: 'Services', path: '/customer/services' },
      { icon: Calendar, label: 'Bookings', path: '/customer/bookings' },
      { icon: Heart, label: 'Favorites', path: '/customer/favorites' },
      { icon: User, label: 'Profile', path: '/customer/profile' },
    ];
  };

  const mobileNavItems = getMobileNavItems();

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim() || user.email || '';
  };

  // Get avatar initials
  const getAvatarInitials = () => {
    if (!user) return 'U';
    return user.firstName?.charAt(0) || user.email?.charAt(0) || 'U';
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full">
        {/* Fixed Header */}
        <header className={cn(
          "bg-white border-b sticky top-0 z-40 transition-all duration-300 h-[60px]",
          isScrolled ? "shadow-md" : ""
        )}>
          <Container className="h-full">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-3">
                <button 
                  className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100 md:hidden"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                </button>
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
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium">
                          {getAvatarInitials()}
                        </span>
                      )}
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-1 z-50 border animate-fade-in">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={() => {
                            if (user?.role === 'admin') {
                              navigate('/dashboard/admin/profile');
                            } else if (user?.role === 'provider') {
                              navigate('/dashboard/provider/profile');
                            } else {
                              navigate('/dashboard/profile');
                            }
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User size={16} />
                          Your Profile
                        </button>
                        {user?.role === 'admin' && (
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
                        )}
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

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 top-[60px] bg-white z-30 md:hidden animate-fade-in">
            <ScrollArea className="h-[calc(100vh-60px)]">
              <div className="p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                
                <nav>
                  <ul className="space-y-3">
                    {mobileNavItems.map((item) => (
                      <li key={item.label}>
                        <Link 
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg",
                            location.pathname === item.path 
                              ? "bg-primary/10 text-primary" 
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <item.icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="flex flex-1 relative">
          {/* Sidebar with Collapsible Feature */}
          <div className="hidden md:block">
            <AppSidebar />
          </div>
          
          {/* Main content */}
          <main className="flex-1 overflow-x-hidden p-4 md:p-8 pb-20 md:pb-8">
            <ScrollArea className="h-[calc(100vh-160px)] md:h-[calc(100vh-130px)]">
              <Container>
                {children}
              </Container>
            </ScrollArea>
          </main>
        </div>

        {/* Modern Mobile bottom navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-30 shadow-lg">
          <div className="flex justify-between items-center px-1">
            {mobileNavItems.slice(0, 5).map((item, index) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-2 px-2 rounded-lg m-1 transition-all",
                  location.pathname === item.path 
                    ? "text-primary bg-primary/5" 
                    : "text-gray-500"
                )}
              >
                <div className={cn(
                  "p-1 rounded-full transition-colors",
                  location.pathname === item.path ? "bg-primary/10" : ""
                )}>
                  <item.icon size={20} />
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

// For TypeScript compatibility
const Link = ({ to, className, children }: { to: string, className?: string, children: React.ReactNode }) => {
  const navigate = useNavigate();
  
  return (
    <a 
      href={to} 
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};

export default DashboardLayout;
