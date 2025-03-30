
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import Container from '@/components/common/Container';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Bell,
  MessageSquare,
  Search,
  Package,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badgeCount?: number;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, badgeCount, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg",
        isActive ? "bg-primary/10 text-primary" : "text-gray-500"
      )}>
        {icon}
      </div>
      <span className="flex-1">{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <Badge variant="secondary" className="ml-auto">
          {badgeCount}
        </Badge>
      )}
    </Link>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Determine navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { to: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { to: '/dashboard/users', icon: <Users size={20} />, label: 'Users' },
        { to: '/dashboard/services', icon: <Package size={20} />, label: 'Services' },
        { to: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages', badgeCount: 2 },
        { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
      ];
    }

    if (user?.role === 'provider') {
      return [
        ...commonItems,
        { to: '/dashboard/bookings', icon: <Calendar size={20} />, label: 'Bookings' },
        { to: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages', badgeCount: 2 },
        { to: '/dashboard/earnings', icon: <CreditCard size={20} />, label: 'Earnings' },
        { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
      ];
    }

    // Customer
    return [
      ...commonItems,
      { to: '/dashboard/services', icon: <Package size={20} />, label: 'Services' },
      { to: '/dashboard/bookings', icon: <Calendar size={20} />, label: 'My Bookings' },
      { to: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages', badgeCount: 2 },
      { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className={cn(
        "bg-white border-b sticky top-0 z-10 transition-shadow duration-300",
        isScrolled && "shadow-sm"
      )}>
        <Container className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
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
                      <Link 
                        to="/dashboard/profile" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} />
                        Your Profile
                      </Link>
                      <Link 
                        to="/dashboard/settings" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <Link 
                        to="/help" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HelpCircle size={16} />
                        Help Center
                      </Link>
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
        <aside 
          className={cn(
            "fixed inset-0 z-20 md:relative md:block transform transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            "w-72 bg-white border-r md:bg-white md:border-r"
          )}
        >
          <div className="h-16 md:h-0 flex items-center px-4 md:hidden">
            <Logo />
          </div>
          
          <div className="p-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <SidebarLink 
                  key={item.label}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  badgeCount={item.badgeCount}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
              
              <div className="pt-4 mt-4 border-t">
                <button 
                  className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg text-red-500">
                    <LogOut size={20} />
                  </div>
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden backdrop-blur-xs" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <Container>
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
